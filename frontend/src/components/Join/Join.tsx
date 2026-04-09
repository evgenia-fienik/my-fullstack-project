'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './Join.module.css'

export default function Join(){
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
    // Приклад: перевірка токена у localStorage
    const token = localStorage.getItem('token'); // або будь-який інший маркер авторизації
    setIsAuthenticated(!!token);
  }, []);

  const handleClick = () => {
    if (isAuthenticated) {
      router.push('/auth/profile'); // авторизований → Збережені історії
    } else {
      router.push('/auth/register'); // НЕ авторизований → Реєстрація
    }
  };
    return (
        <section className={styles.section}>
            <div className={styles.card}>
            <div className={styles.content}>
            <h2 className={styles.title}>Приєднуйтесь до нашої спільноти</h2>
            <p className={styles.desc}>Долучайтеся до мандрівників, які діляться своїми історіями та надихають на нові пригоди.</p>
              <button className={styles.cta} onClick={handleClick}>
               {isAuthenticated ? 'Збережені' : 'Зареєструватися'}
               </button>
            </div>
            </div>
        </section>
    )
}