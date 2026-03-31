import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "함이현의 포트폴리오 | Game Client Developer",
  description: "파고드는 개발자 함이현의 네오브루탈리즘 스타일 게임 클라이언트 프로그래머 포트폴리오입니다.",
};

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>HAM YI-HYEON</div>
        <nav className={styles.navLinks}>
          <a href="https://github.com/HamYiHyeon" target="_blank" rel="noreferrer" className={styles.navButton}>GitHub</a>
          <a href="https://youtube.com/@punnaegi" target="_blank" rel="noreferrer" className={styles.navButton}>YouTube</a>
          <a href="mailto:ehyun1165@gmail.com" className={styles.navButton}>Email</a>
        </nav>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>파고드는 개발자<br/>함이현입니다</h1>
          <p className={styles.heroSubtitle}>
            게임 클라이언트 프로그래머 (Game Client Programmer)<br/>
            언리얼 엔진(C++/Blueprint)을 주력으로 사용하며 프로젝트의 완성도와 효율적인 시스템 아키텍처 설계를 중시합니다.
          </p>
        </section>

        {/* SKILLS SECTION */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>💪 SKILLS</h2>
          <div className={styles.skillsGrid}>
            <div className={styles.skillCard} data-color="purple">
              <h3 className={styles.skillCategory}>Engines</h3>
              <div className={styles.skillBadgeList}>
                <span className={styles.skillBadge}>Unreal Engine 5</span>
                <span className={styles.skillBadge}>Unity</span>
              </div>
            </div>
            <div className={styles.skillCard} data-color="orange">
              <h3 className={styles.skillCategory}>Languages</h3>
              <div className={styles.skillBadgeList}>
                <span className={styles.skillBadge}>C++</span>
                <span className={styles.skillBadge}>C</span>
                <span className={styles.skillBadge}>C#</span>
                <span className={styles.skillBadge}>Python</span>
                <span className={styles.skillBadge}>HTML/CSS/JS</span>
                <span className={styles.skillBadge}>MySQL</span>
              </div>
            </div>
            <div className={styles.skillCard} data-color="yellow">
              <h3 className={styles.skillCategory}>Tools</h3>
              <div className={styles.skillBadgeList}>
                <span className={styles.skillBadge}>Git / GitHub</span>
                <span className={styles.skillBadge}>Blender</span>
                <span className={styles.skillBadge}>Clip Studio</span>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🚀 PROJECTS</h2>
          <div className={styles.projectsGrid}>
            {/* Project 1 */}
            <article className={styles.projectCard}>
              <div className={styles.projectHeader}>
                <h3 className={styles.projectTitle}>Shards of Veyara</h3>
                <span className={styles.projectDate}>2025.09 - Present</span>
              </div>
              <div className={styles.projectBody}>
                <p className={styles.projectDesc}>
                  3D 액션 어드벤처 및 농사 시뮬레이션 게임. 메인 시스템 구현 및 최적화 진행 중.
                </p>
                <div className={styles.projectTechs}>
                  <span className={styles.projectTechBadge}>Unreal Engine 5</span>
                  <span className={styles.projectTechBadge}>C++</span>
                </div>
              </div>
            </article>

            {/* Project 2 */}
            <article className={styles.projectCard}>
              <div className={styles.projectHeader} style={{ background: 'var(--neo-green)' }}>
                <h3 className={styles.projectTitle}>MineRuins</h3>
                <span className={styles.projectDate}>2025.09 - 2025.12</span>
              </div>
              <div className={styles.projectBody}>
                <p className={styles.projectDesc}>
                  VR 모듈화 시스템 및 물리 기반 상호작용이 강조된 액션 어드벤처.
                </p>
                <div className={styles.projectTechs}>
                  <span className={styles.projectTechBadge}>Unreal Engine 5</span>
                  <span className={styles.projectTechBadge}>C++</span>
                  <span className={styles.projectTechBadge}>VR</span>
                </div>
              </div>
            </article>

            {/* Project 3 */}
            <article className={styles.projectCard}>
              <div className={styles.projectHeader} style={{ background: 'var(--neo-pink)' }}>
                <h3 className={styles.projectTitle}>ChicaHeros</h3>
                <span className={styles.projectDate}>2025.04 - 2025.09</span>
              </div>
              <div className={styles.projectBody}>
                <p className={styles.projectDesc}>
                  VR 환경 최적화 액션 캐주얼 게임. GameState, SaveGame 시스템 설계 및 연동.
                </p>
                <div className={styles.projectTechs}>
                  <span className={styles.projectTechBadge}>Unreal Engine 5</span>
                  <span className={styles.projectTechBadge}>C++</span>
                  <span className={styles.projectTechBadge}>VR</span>
                </div>
              </div>
            </article>

            {/* Project 4 */}
            <article className={styles.projectCard}>
              <div className={styles.projectHeader} style={{ background: 'var(--neo-cyan)' }}>
                <h3 className={styles.projectTitle}>MIND-SET</h3>
                <span className={styles.projectDate}>2024.10 - 2024.12</span>
              </div>
              <div className={styles.projectBody}>
                <p className={styles.projectDesc}>
                  2D 액션 로그라이크 타워 디펜스 게임. 다익스트라 등 알고리즘 기반 AI 추격 로직 구현.
                </p>
                <div className={styles.projectTechs}>
                  <span className={styles.projectTechBadge}>Unity</span>
                  <span className={styles.projectTechBadge}>C#</span>
                </div>
              </div>
            </article>

            {/* Project 5 */}
            <article className={styles.projectCard}>
              <div className={styles.projectHeader} style={{ background: 'var(--neo-orange)' }}>
                <h3 className={styles.projectTitle}>RedHood Run</h3>
                <span className={styles.projectDate}>2024.10 - 2024.12</span>
              </div>
              <div className={styles.projectBody}>
                <p className={styles.projectDesc}>
                  2D 러닝 액션 게임. 다양한 장애물 요소 및 게임 코어 메커니즘을 포함하여 개발.
                </p>
                <div className={styles.projectTechs}>
                  <span className={styles.projectTechBadge}>Unity</span>
                  <span className={styles.projectTechBadge}>C#</span>
                </div>
              </div>
            </article>

            {/* Project 6 */}
            <article className={styles.projectCard}>
              <div className={styles.projectHeader} style={{ background: 'var(--neo-purple)' }}>
                <h3 className={styles.projectTitle}>RE-CREATE</h3>
                <span className={styles.projectDate}>2024.04 - 2024.06</span>
              </div>
              <div className={styles.projectBody}>
                <p className={styles.projectDesc}>
                  상속 및 다형성 객체지향적 접근을 적용한 C++ 2D 턴제 RPG 시스템.
                </p>
                <div className={styles.projectTechs}>
                  <span className={styles.projectTechBadge}>C++</span>
                </div>
              </div>
            </article>

          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 900 }}>LET'S CONNECT</h2>
        <p style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.5rem' }}>📞 010-9720-6230</p>
        <p style={{ fontWeight: 700, fontSize: '1.2rem' }}>✉️ ehyun1165@gmail.com</p>
        <p style={{ marginTop: '2rem', opacity: 0.8, fontWeight: 600 }}>&copy; 2026 Ham Yi-Hyeon. All rights reserved.</p>
      </footer>
    </div>
  );
}
