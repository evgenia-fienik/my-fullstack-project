'use client';

import Link from 'next/link';
import {Logo, FacebookIcon, InstagramIcon, XIcon, YouTubeIcon} from '../Icons'
import styles from './Footer.module.css'

type FooterProps = {
    isAuthenticated?: boolean;
}

export default function Footer({isAuthenticated = false}: FooterProps){
    return(
        <footer className={styles.footer} role='contentinfo'>
            <div className={styles.wraper}>
                <div className={styles.top}>
                    <div className={styles.brand}>
                        <Link href="/" aria-label="Подорожники — головна" className={styles.brandLink}>
                            <Logo className={styles.logo}/>
                            <span className={styles.brandText}>Подорожники</span>
                        </Link>
                    </div>
                </div>

                {/* Social links */}
                <div className={styles.social}>
                    <ul className={styles.socialList} aria-label="Соціальні мережі">
                        <li>
                            <a
                              href="https://www.facebook.com/"
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Facebook"
                             title="Facebook"
                             >
                                <FacebookIcon/>
                            </a>
                         </li>
                         <li>
                            <a
                            href="https://www.instagram.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            title="Instagram"
                            >
                              <InstagramIcon/>
                            </a>
                        </li>
                        <li>
                            <a 
                            href="https://x.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="X"
                            title="X (Twitter)"
                            >
                                <XIcon/>
                            </a>
                        </li>
                        <li>
                            <a
                            href="https://www.youtube.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="YouTube"
                            title="YouTube"
                            >
                                <YouTubeIcon/>
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Navigation */}
                <nav ria-label="Footer navigation" className={styles.nav}>
                    <ul className={styles.navList}>
                        <li>
                            <Link href="/" className={styles.navLink}>Головна</Link>
                        </li>
                        <li>
                            <Link href="/stories" className={styles.navLink}>Історії</Link>
                        </li>
                        <li>
                            <Link href='/travellers' className={styles.navLink}>Мандрівники</Link>
                        </li>
                        {isAuthenticated && (
                        <li>
                            <Link href='/travellers/[travallerId]'>Профіль</Link>
                        </li>

                        )}
                    </ul>
                </nav>
                <div className={styles.bottom}>
                    <p className={styles.copyright}>© 2025 Подорожники. Усі права захищені.</p>
                    </div>
            </div>
        </footer>

    )
}