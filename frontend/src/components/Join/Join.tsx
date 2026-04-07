import Link from 'next/link';
import styles from './Join.module.css'

export default function Join(){
    return (
        <section className={styles.section}>
            <div className={styles.card}>
            <div className={styles.content}>
            <h2 className={styles.title}>Приєднуйтесь до нашої спільноти</h2>
            <p className={styles.desc}>Долучайтеся до мандрівників, які діляться своїми історіями та надихають на нові пригоди.</p>
            <Link href='/signur' className={styles.cta}>Зареєструватися</Link>
            </div>
            </div>
        </section>
    )
}