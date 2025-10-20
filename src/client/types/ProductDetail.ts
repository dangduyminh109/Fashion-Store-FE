import type Variant from "./variant";

export default interface ProductDetail {
  id: number;
  name: string;
  productImages: string[];
  status: boolean;
  isFeatured: boolean;
  brandName: string;
  categoryName: string;
  slug: string;
  variants: Variant[];
}
