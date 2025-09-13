import type ImportItem from "./importItem";

export default interface Attribute {
  id: number;
  note: string;
  importDate: Date;
  supplierId: number;
  supplierName: string;
  importItemList: ImportItem[];
}
