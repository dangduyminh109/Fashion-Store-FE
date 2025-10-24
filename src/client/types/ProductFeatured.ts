import type Variant from "./variant";

export default interface ProductFeatured {
  id: number;
  name: string;
  productImages: string[];
  isFeatured: boolean;
  brandName: string;
  categoryName: string;
  categoryId: number;
  slug: string;
  variants: Variant[];
  description: string;
}
