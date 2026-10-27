export type Row = {
  id: string;
  name: string;
  status: string;
  date: string;
  patient?: string;
  professional?: string;
  [key: string]: string | number | string[] | undefined;
};
export type Database = Record<string, Row[]>;
