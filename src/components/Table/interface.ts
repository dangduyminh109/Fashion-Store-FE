export interface HeadCell<T> {
  id: keyof T;
  label: string;
  hasSort: boolean;
  isMoney?: boolean;
}

export interface RowData {
  [key: string]: any;
}

export type Order = "asc" | "desc" | "default";
