// 영상에 들어가는 모든 숫자는 이 파일에서만 바꾸면 됩니다.
// 아래 값은 예시(placeholder)입니다. 실제 채널 데이터로 교체하세요.

export type TopVideo = {
  title: string;
  views: number;
  // public/ 폴더 기준 경로. 예: "thumbnails/top1.jpg"
  thumbnail: string;
};

export const channel = {
  name: "채널 이름",
  period: "2026년 9월",
};

export const kpis = {
  views: 412380,
  watchHours: 18240,
  subscribersGained: 2135,
  revenueUsd: 1284,
};

// 1일부터 30일까지 일별 조회수
export const dailyViews: number[] = [
  9800, 10400, 11200, 10900, 12800, 15100, 14300, 11900, 11400, 12100, 13300,
  12700, 16900, 18200, 15600, 12400, 12900, 13800, 14100, 13200, 17400, 21800,
  19300, 14600, 13900, 14800, 15200, 14400, 16100, 17900,
];

// 조회수 순서대로 1위, 2위, 3위
export const topVideos: TopVideo[] = [
  { title: "1위 영상 제목", views: 86400, thumbnail: "thumbnails/top1.svg" },
  { title: "2위 영상 제목", views: 54200, thumbnail: "thumbnails/top2.svg" },
  { title: "3위 영상 제목", views: 38900, thumbnail: "thumbnails/top3.svg" },
];
