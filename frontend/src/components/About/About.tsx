import {MissionIcon, HistoryIcon, CommunityIcon} from '../Icons'
import styles from './About.module.css'

export default function About(){
 return(
    <section className={styles.about}>
        <div className={styles.container}>
        <div className={styles.into}>
            <h2 className={styles.title}>Проєкт, створений для тих, хто живе подорожами</h2>
            <p className={styles.description}>Ми віримо, що кожна подорож — це унікальна історія, варта того, щоб нею поділилися. Наша платформа створена, щоб об'єднати людей, закоханих у відкриття нового. Тут ви можете ділитися власним досвідом, знаходити друзів та надихатися на наступні пригоди разом з нами.</p>
        </div>
        <div className={styles.features}>
            <div className={styles.feature}>
             <MissionIcon/>
                <h3 className={styles.featureTitle}>Наша місія</h3>
                <p className={styles.featureText}>Об'єднувати людей через любов до пригод та надихати на нові відкриття.</p>
            </div>          
             <div className={styles.feature}>
                <HistoryIcon/>
                <h3 className={styles.featureTitle}>Автентичні історії</h3>
                <p className={styles.featureText}>Ми цінуємо справжні, нередаговані враження від мандрівників з усього світу.</p>
            </div>
            <div className={styles.feature}>
                <CommunityIcon/>         
                <h3 className={styles.featureTitle}>Ваша спільнота</h3>
                <p className={styles.featureText}>Станьте частиною спільноти, де кожен може бути і автором, і читачем.</p>
            </div>
        </div>
        </div>
        </section>
 )
}