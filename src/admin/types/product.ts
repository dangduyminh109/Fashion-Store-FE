import type Variant from "./variant";

export default interface Product {
  id: number;
  name: string;
  description: string;
  status: boolean;
  isFeatured: boolean;
  isDeleted: boolean;
  brandId: number;
  brandName: string;
  categoryId: number;
  categoryName: string;
  slug: string;
  variants: Variant[];
  productImages: string[];
}
