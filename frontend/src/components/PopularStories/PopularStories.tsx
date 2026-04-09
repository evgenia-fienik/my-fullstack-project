'use client';

import { useEffect, useRef, useState } from 'react';
import TravellersStoriesItem, { IStory } from '../TravellersStoriesItem/TravellersStoriesItem';
import styles from './PopularStories.module.css';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://my-fullstack-project-vr8p.onrender.com';

export default function PopularStories() {
  const [stories, setStories] = useState<IStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const gridRef = useRef<HTMLDivElement | null>(null);
  const scrollAfterRef = useRef<number>(0); // множник карток для прокрутки (1 або 1.5)

  const getIncrement = () => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
    if (width < 768) return 3;
    if (width < 1440) return 4;
    return 3;
  };

  // множник карток для прокрутки: мобільний 1.5, інші 1
  const getScrollMultiplier = () => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
    return width < 768 ? 1.5 : 1;
  };

  // helper: fetch specific page and append (or replace for page 1)
  const fetchStoriesPage = async (pageToLoad = 1, incForVisible?: number) => {
    console.log('[fetchStoriesPage] start, pageToLoad =', pageToLoad);
    setLoading(true);
    try {
      const url = `${API_BASE}/api/stories?page=${pageToLoad}`;
      console.log('[fetchStoriesPage] fetching url:', url);
      const res = await fetch(url);
      console.log('[fetchStoriesPage] http status:', res.status);
      const data = await res.json();

      const received: IStory[] = data?.data?.stories ?? [];
      const meta = {
        page: data?.data?.page,
        perPage: data?.data?.perPage,
        totalItems: data?.data?.totalItems,
        totalPages: data?.data?.totalPages,
        hasNextPage: data?.data?.hasNextPage,
      };
      console.log('[fetchStoriesPage] response meta:', { ...meta, received: received.length });

      setStories(prev => {
        const newArr = pageToLoad === 1 ? [...received] : [...prev, ...received];

        if (typeof incForVisible === 'number') {
          // visibleCount оновимо залежно від фактичної довжини після додавання
          setVisibleCount(prevVisible => Math.min(prevVisible + incForVisible, newArr.length));
        }

        return newArr;
      });

      setPage(meta.page ?? pageToLoad);
      setHasNextPage(Boolean(meta.hasNextPage ?? (meta.page < (meta.totalPages ?? 0))));
    } catch (err) {
      console.error('[fetchStoriesPage] Помилка завантаження сторіс:', err);
    } finally {
      setLoading(false);
      console.log('[fetchStoriesPage] finished');
    }
  };

  // initial load
  useEffect(() => {
    fetchStoriesPage(1);
  }, []);

  // responsive visibleCount
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setVisibleCount(3);
      else if (width < 1440) setVisibleCount(4);
      else setVisibleCount(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // При зміні visibleCount виконуємо прокрутку, якщо потрібно
  useEffect(() => {
    const toScrollMultiplier = scrollAfterRef.current;
    if (!toScrollMultiplier) return;

    // Затримка, щоб DOM встиг промалювати нові елементи
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const gridEl = gridRef.current;
        if (!gridEl) {
          scrollAfterRef.current = 0;
          return;
        }

        // беремо першу картку в гріді (як еталон висоти)
        const firstChild = gridEl.children[0] as HTMLElement | undefined;
        const cardHeight = firstChild ? firstChild.getBoundingClientRect().height : window.innerHeight * 0.5;

        // невелика корекція на gap між картками та header (за потреби відкоригуй)
        const computedStyle = window.getComputedStyle(gridEl);
        const rowGap = parseFloat(computedStyle.rowGap || computedStyle.gap || '0') || 0;

        // header offset (якщо header фіксований поверх, віднімаємо його висоту)
        const headerEl = document.querySelector('header');
        const headerHeight = headerEl ? (headerEl as HTMLElement).getBoundingClientRect().height : 0;

        const distance = (cardHeight + rowGap) * toScrollMultiplier - headerHeight;

        // забезпечимо позитивне значення
        const top = Math.max(0, distance);

        window.scrollBy({ top, behavior: 'smooth' });

        // сброс
        scrollAfterRef.current = 0;
      });
    });
  }, [visibleCount]);

  // load more handler
  const handleLoadMore = async () => {
    console.log(
      '[handleLoadMore] clicked — current page:',
      page,
      'stories length:',
      stories.length,
      'visibleCount:',
      visibleCount
    );
    const inc = getIncrement();

    // вкажемо, на скільки карток скролити після рендеру
    scrollAfterRef.current = getScrollMultiplier();

    // Якщо локально є достатньо елементів — просто показуємо більше
    if (stories.length >= visibleCount + inc) {
      console.log('[handleLoadMore] enough local stories, just increase visibleCount');
      setVisibleCount(prev => prev + inc);
      return;
    }

    // Інакше підвантажуємо наступну сторінку (якщо є)
    if (hasNextPage && !loading) {
      const nextPage = (page ?? 1) + 1;
      console.log('[handleLoadMore] fetching nextPage:', nextPage);
      await fetchStoriesPage(nextPage, inc);
      return;
    }

    // fallback: збільшуємо видимість до наявних локальних елементів
    setVisibleCount(prev => Math.min(prev + inc, stories.length));
  };

  if (loading && stories.length === 0) return <p>Завантаження...</p>;

  return (
    <section className={styles.section}>
      <div className={styles.wraper}>
        <h2 className={styles.title}>Популярні історії</h2>

        <div className={styles.grid} ref={gridRef}>
          {stories.slice(0, visibleCount).map(story => (
            <TravellersStoriesItem
              key={story._id}
              story={story}
              isSaved={false}
              isAuthenticated={false}
              onSaveToggle={handleSaveToggle}
            />
          ))}

          {(hasNextPage || stories.length > visibleCount) && (
            <button className={styles.btn} onClick={handleLoadMore} disabled={loading}>
              {loading ? 'Завантаження...' : 'Переглянути ще'}
            </button>
          )}
        </div>
      </div>
    </section>
  );

  // логіка "зберегти"
  async function handleSaveToggle(id: string, add: boolean) {
    try {
      const method = add ? 'POST' : 'DELETE';
      await fetch(`${API_BASE}/api/stories/${id}/favorites`, {
        method,
        credentials: 'include',
      });
    } catch (error) {
      console.error('Помилка при збереженні:', error);
      throw error;
    }
  }
}