export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export const DUMMY_LINKS: LinkItem[] = [
  {
    id: "1",
    title: "인스타그램",
    url: "https://instagram.com/",
    icon: "instagram",
  },
  {
    id: "2",
    title: "유튜브",
    url: "https://youtube.com/",
    icon: "youtube",
  },
  {
    id: "3",
    title: "블로그",
    url: "https://velog.io/",
    icon: "book",
  },
  {
    id: "4",
    title: "GitHub",
    url: "https://github.com/",
    icon: "github",
  },
  {
    id: "5",
    title: "포트폴리오",
    url: "https://portfolio.com/",
    icon: "user",
  },
];
