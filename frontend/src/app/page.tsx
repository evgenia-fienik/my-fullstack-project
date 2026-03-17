'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('Завантаження...');

  useEffect(() => {
    // Робимо запит до нашого бекенду (Express)
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/`)
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => {
        console.error(err);
        setMessage('Помилка зв’язку з бекендом');
      });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white text-black">
      <h1 className="text-4xl font-bold mb-8">Мій Fullstack Проект</h1>
      
      <div className="p-6 border-2 border-blue-500 rounded-xl shadow-lg">
        <p className="text-lg mb-2">Статус з'єднання:</p>
        <p className="text-2xl font-mono text-blue-600 font-bold">
          {message}
        </p>
      </div>

      <div className="mt-10 text-gray-500">
        <p>Бекенд: http://localhost:4000</p>
        <p>Фронтенд: http://localhost:3000</p>
      </div>
    </main>
  );
}
