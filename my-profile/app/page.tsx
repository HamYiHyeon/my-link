import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "함이현의 포트폴리오",
  description: "바이브 코딩을 배우고 있는 대학생 함이현의 프로필 페이지입니다.",
};

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Background ambient orbs for a premium look */}
      <div className={styles.orb}></div>
      <div className={styles.orb2}></div>

      <main className={styles.card}>
        {/* Profile Avatar with dynamic hover ring */}
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>
            <span className={styles.avatarText}>함</span>
          </div>
        </div>

        {/* Text Content */}
        <h1 className={styles.name}>함이현</h1>
        <p className={styles.description}>
          안녕하세요. 바이브 코딩을 배우며,<br />
          아이디어를 현실로 만들어가는 대학생입니다. 🚀
        </p>

        {/* Call to Actions */}
        <div className={styles.buttonGroup}>
          <button className={styles.primaryButton}>
            Contact Me
          </button>
          <button className={styles.secondaryButton}>
            Portfolio
          </button>
        </div>
      </main>
    </div>
  );
}
