'use client';

import Link from 'next/link';
import {Logo} from '../Icons'
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { usePathname } from 'next/navigation';

import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import styles from './Header.module.css';


export default function Header() {
  const { isLoggedIn, user, clearUser } = useAuthStore();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  //Блокування скролу

  useEffect(()=> {
    if (menuOpen) {
        document.body.style.overflow = 'hidden';
    }else {
        document.body.style.overflow = '';
    }
    return () =>{ document.body.style.overflow = '';};
  }, [menuOpen]);

  return (
    <header className={`${styles.header} ${isHome ? styles.transparent : styles.white}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
        
        <Logo />
        
          Подорожники
        </Link>

        {/* Десктоп nav */}
        <div className={styles.rightSide}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>Головна</Link>
          <Link href="/stories" className={styles.navLink}>Історії</Link>
          <Link href="/travellers" className={styles.navLink}>Мандрівники</Link>

        </nav>

        <div className={styles.actions}>
          {isLoggedIn ? (
             <>
             <img src={user?.avatar || '/default-avatar.png'} alt='avatar' className={styles.avatar} />
             <span className={styles.userName}>{user?.name}</span>
             <Link href='/profile' className={styles.navLink}>Мій Профіль</Link>
             <Link href='/stories/create' className={styles.btnPrimary}>Опублікувати історію</Link>
             <button className={styles.logoutBtn} onClick={() => setIsModalOpen(true)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg></button>
             </>
          ) : (
            <>
              <Link href="/auth/login" className={styles.btnSecondary}>Вхід</Link>
              <Link href="/auth/register" className={styles.btnPrimary}>Реєстрація</Link>
            </>
          )}
        </div>
        
        <div className={styles.rightSide}>
        <div className={styles.tabletActions}>
          {isLoggedIn ? (
            
            <Link href='/stories/create' className={styles.btnPrimary}>Опублікувати історію</Link>
             ) : (
            <>
            <Link href="/auth/login" className={styles.btnSecondary}>Вхід</Link>
            <Link href="/auth/register" className={styles.btnPrimary}>Реєстрація</Link>
            </>
              )}
        </div>
        </div>

        {/* Мобільний бургер */}
        <button
        className={styles.burger} 
        onClick={()=> setMenuOpen(true)}
       ><svg width="19" height="13" viewBox="0 0 19 13" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0.85175 12.4425C0.61125 12.4425 0.409167 12.3602 0.2455 12.1957C0.0818333 12.0312 0 11.8262 0 11.5805C0 11.3388 0.0818333 11.1372 0.2455 10.9755C0.409167 10.814 0.61125 10.7332 0.85175 10.7332H17.4472C17.6877 10.7332 17.8908 10.8155 18.0565 10.98C18.2222 11.1445 18.305 11.3476 18.305 11.5892C18.305 11.8349 18.2222 12.0385 18.0565 12.2C17.8908 12.3617 17.6877 12.4425 17.4472 12.4425H0.85175ZM0.85175 7.073C0.61125 7.073 0.409167 6.99067 0.2455 6.826C0.0818333 6.6615 0 6.45842 0 6.21675C0 5.97525 0.0818333 5.77367 0.2455 5.612C0.409167 5.45033 0.61125 5.3695 0.85175 5.3695H17.4472C17.6877 5.3695 17.8908 5.45183 18.0565 5.6165C18.2222 5.781 18.305 5.98408 18.305 6.22575C18.305 6.46725 18.2222 6.66883 18.0565 6.8305C17.8908 6.99217 17.6877 7.073 17.4472 7.073H0.85175ZM0.85175 1.70925C0.61125 1.70925 0.409167 1.627 0.2455 1.4625C0.0818333 1.298 0 1.09292 0 0.847249C0 0.605582 0.0818333 0.403999 0.2455 0.242499C0.409167 0.0808321 0.61125 0 0.85175 0H17.4472C17.6877 0 17.8908 0.0822499 18.0565 0.24675C18.2222 0.41125 18.305 0.614333 18.305 0.856C18.305 1.10167 18.2222 1.30533 18.0565 1.467C17.8908 1.6285 17.6877 1.70925 17.4472 1.70925H0.85175Z" fill="white" />
</svg></button>
      </div>
      </div>
      
      {/* Повноекранне мобільне меню */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileMenuHeader}>
          <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
            Подорожники
          </Link>
          <button className={styles.closeBtn} onClick={() => setMenuOpen(false)}>
            ✕
          </button>
        </div>

        <nav className={styles.mobileNav}>

          <Link href="/" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Головна</Link>
          <Link href="/stories" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Історії</Link>
          <Link href="/travellers" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Мандрівники</Link>
          {isLoggedIn && (
            <>
            <Link href='/profile' className={styles.mobileLink}  onClick={() => setMenuOpen(false)}>Мій Профіль</Link>
            <Link href='/stories/create' className={styles.mobileLink}  onClick={() => setMenuOpen(false)}>Опублікувати історію</Link>
            <img src={user?.avatar || '/default-avatar.png'} alt='avatar'/>
            <span>{user?.name}</span>
            <button onClick={() => setIsModalOpen(true)}>Вийти</button>
            </>
          )}
          {!isLoggedIn && (
           <div className={styles.mobileAuthLinks}>
              <Link href="/auth/login" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Вхід</Link>
              <Link href="/auth/register" className={styles.mobileLinkPrimary} onClick={() => setMenuOpen(false)}>Реєстрація</Link>
            </div>
          )}

        </nav>
      </div>
      <ConfirmationModal 
      isOpen={isModalOpen}
      onClose={()=>setIsModalOpen(false)}
      onConfirm={clearUser}/>
    </header>
  );
}