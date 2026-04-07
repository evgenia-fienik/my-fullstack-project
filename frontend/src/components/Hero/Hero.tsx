import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <video className={styles.video} autoPlay muted loop playsInline>
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className={styles.overlay} />
      <div className={styles.inner}>
      <div className={styles.content}>
        <div className={styles.titdesc}>
        <h1 className={styles.title}>Відкрийте світ подорожей з нами!</h1>
        <p className={styles.description}>
          Приєднуйтесь до нашої спільноти мандрівників, де ви зможете ділитися своїми історіями та отримувати натхнення для нових пригод. Відкрийте для себе нові місця та знайдіть однодумців!
        </p>
        </div>
        <Link href="/stories" className={styles.btn}>Доєднатись</Link>
        </div>
      </div>
    </section>
  );
}