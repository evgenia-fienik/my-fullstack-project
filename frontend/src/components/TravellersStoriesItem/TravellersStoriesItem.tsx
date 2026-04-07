'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import{ BookmarkIcon} from '../Icons'
import styles from './TravellersStoriesItem.module.css';

// Типи для category та автора
interface ICategory {
    _id: string;
    name: string;
}

interface IOwner {
    _id: string;
    name: string;
    avatarUrl?: string;
}

// Головний тип сторі
export interface IStory {
    _id: string;
    title?: string;
    img?: string;
    article?: string;
    category?: ICategory;      // тепер об’єкт
    ownerId?: IOwner;          // об’єкт автора
    date?: string;
    favoriteCount?: number;
}

interface Props {
    story?: IStory; // optional
    isSaved?: boolean;
    onSaveToggle?: (id: string, add: boolean) => Promise<void>;
    isAuthenticated?: boolean;
}

export default function TravellersStoriesItem({
    story,
    isSaved: initialSaved,
    onSaveToggle,
    isAuthenticated = false
}: Props) {

    // Якщо story немає, нічого не рендеримо
    if (!story) return null;

    const [isSavedState, setIsSavedState] = useState(initialSaved ?? false);
    const [loading, setLoading] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [favoriteCount, setFavoriteCount] = useState(story.favoriteCount ?? 0);

    const handleSaveClick = async () => {
        if (!isAuthenticated) {
            setShowAuthModal(true);
            return;
        }
        if (!onSaveToggle) return;

        try {
            setLoading(true);
            await onSaveToggle(story._id, !isSavedState);
            setIsSavedState(!isSavedState);
            setFavoriteCount(prev => prev + (isSavedState ? -1 : 1));
        } catch (error: any) {
            alert(error?.message || 'Помилка при збереженні статті');
        } finally {
            setLoading(false);
        }
    };

    // Дані для відображення
    const img = story.img ?? '/default-hero.jpg';
    const title = story.title ?? 'Без назви';
    const article = story.article ?? '';
    const category = story.category?.name ?? 'Інше';
    const authorName = story.ownerId?.name ?? 'Автор';
    const authorAvatar = story.ownerId?.avatarUrl ?? '/default-avatar.png';
    const date = story.date ? new Date(story.date).toLocaleDateString('uk-UA') : '';
    const articleRef = useRef<HTMLParagraphElement | null>(null);
    const [hasMoreText, setHasMoreText] = useState(false);

    useEffect(() => {
  const el = articleRef.current;
  if (!el) return;
  setHasMoreText(el.scrollHeight > el.clientHeight);
}, [article]); // залежить від тексту article

    return (
        <article className={`${styles.card} ${isSavedState ? styles.saved : ''}`}>
            <div className={styles.imageWrapper}>
                <Image src={img} alt={title} fill className={styles.imgStory} />
            </div>
           <div className={styles.cardBody}>
              <p className={styles.category}>{category}</p>
              <h3 className={styles.title}>{title}</h3>
              <p ref={articleRef} className={`${styles.article} ${hasMoreText ? styles.hasMore : ''}`}>{article}</p>
              <div className={styles.authorInfo}>
                <Image src={authorAvatar} alt={authorName} width={48} height={48} className={styles.authorAvatar} />
                <div>
                    <div className={styles.authorName}>{authorName}</div>
                    <div className={styles.meta}>
                        {date} • {favoriteCount} <BookmarkIcon size={16}/>
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                <Link href={`/stories/${story._id}`} className={styles.viewLink}>
                    Переглянути статтю
                </Link>
                <button
                
                    onClick={handleSaveClick}
                    aria-pressed={isSavedState}
                    className={`${styles.saveButton} ${isSavedState ? styles.active : ''}`}
                    disabled={loading}
                ><BookmarkIcon size={24}/>
                </button>
            </div>
            </div>
        </article>
    );
}