'use client';

import React, { useEffect, useState } from 'react';
import styles from './TravellersList.module.css';

type Traveller = {
  _id: string;
  name: string;
  description?: string;
  avatarUrl?: string | null;
  articlesAmount?: number;
};

export default function TravellersList() {
  const [items, setItems] = useState<Traveller[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 4;
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const fetchPage = async (pg = 1) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`[TravellersList] fetch: ${API_BASE}/api/users?page=${pg}&perPage=${perPage}`);
      const res = await fetch(`${API_BASE}/api/users?page=${pg}&perPage=${perPage}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      console.log('[TravellersList] response json:', json);

      const data = json?.data;
      if (!data) throw new Error('Invalid response shape');

      const newUsers = Array.isArray(data.users) ? data.users : [];
     
      setItems(prev => (pg === 1 ? newUsers : [...prev, ...newUsers]));

      setHasNext(Boolean(data.hasNextPage));
      setPage(Number(data.page ?? pg));
    } catch (err: any) {
      console.error('[TravellersList] fetch error', err);
      setError(err?.message || 'Помилка завантаження');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(1);
  }, []);

  const handleLoadMore = async () => {
    if (!hasNext || loading) return;
    await fetchPage(page + 1);
  };

  return (
    <section className={styles.section}>
      <div className={styles.wraper}>
        <h2 className={styles.title}>Наші Мандрівники</h2>

        {error && <div role="alert" className={styles.error}>{error}</div>}

       
        {loading && items.length === 0 && <p>Завантаження...</p>}
        {!loading && items.length === 0 && <p style={{ color: '#777' }}>Карток ще немає</p>}

        <ul className={styles.list}>
          {items.map(item => (
            <li key={item._id} className={styles.item}>
              <article className={styles.card}>
                <figure className={styles.avatarWrap}>
                  <img
                    src={item.avatarUrl || '/placeholder-avatar.png'}
                    alt={item.avatarUrl ? `${item.name} avatar` : ''}
                    className={styles.avatar}
                    width={72}
                    height={72}
                  />
                </figure>
                <div className={styles.info}>
                  <h3 className={styles.name}>{item.name}</h3>
                  <p className={styles.desc}>{item.description}</p>
                  <a href={`/users/${item._id}`} className={styles.profileBtn}>Переглянути профіль</a>
                </div>
              </article>
            </li>
          ))}
        </ul>

        {hasNext && (
          <div className={styles.actions}>
            <button
              className={styles.btn}
              onClick={handleLoadMore}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? 'Завантаження...' : 'Показати ще'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}