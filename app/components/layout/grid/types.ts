export type Column = {
  start?: number;
  span?: number;
};
export type Background = {
  smColumn?: Column;
  mdColumn?: Column;
  lgColumn?: Column;
  xlColumn?: Column;
  className?: string;
};

export type Span = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
