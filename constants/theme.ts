export const LIGHT = {
  bg: '#F6F4EE',
  surface: '#FFFFFF',
  surface2: '#F0EDE6',
  text: '#15181D',
  muted: '#8A8478',
  outMonth: '#C9C3B5',
  weekend: '#B65A7B',
  divider: '#E7E2D6',
  selectedBg: '#EBE6D8',
  shellBg: '#EAE4D3',
} as const;

export const DARK = {
  bg: '#0E1116',
  surface: '#171B22',
  surface2: '#1F2530',
  text: '#ECEFF4',
  muted: '#8893A4',
  outMonth: '#3A4250',
  weekend: '#A4537A',
  divider: '#262C36',
  selectedBg: '#222A36',
  shellBg: '#0A0D11',
} as const;

export const ACCENT = {
  xd: '#E25241',
  pay: '#1F9D6B',
  today: '#2D6CDF',
  xdAlpha8: '#E2524114',
  xdAlpha20: '#E2524133',
  payAlpha8: '#1F9D6B14',
  payAlpha20: '#1F9D6B33',
  todayAlpha8: '#2D6CDF14',
  todayAlpha20: '#2D6CDF33',
} as const;

export const RADIUS = {
  sm: 8,
  md: 10,
  cell: 12,
  card: 14,
  sheet: 24,
  pill: 999,
} as const;

export const FONT_SIZE = {
  eyebrow: 11,
  caption: 11,
  body: 13,
  cardTitle: 15,
  sectionTitle: 18,
  display: 26,
} as const;

export type Theme = {
  bg: string;
  surface: string;
  surface2: string;
  text: string;
  muted: string;
  outMonth: string;
  weekend: string;
  divider: string;
  selectedBg: string;
  shellBg: string;
};
