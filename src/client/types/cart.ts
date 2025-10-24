import type AttributeValue from "./attributeValue";

export interface CartVariant {
  id: number;
  sku: string;
  status: boolean;
  inventory: number;
  salePrice: number;
  originalPrice: number;
  promotionalPrice: number;
  promotionEndTime: Date;
  promotionStartTime: Date;
  attributeValues: AttributeValue[];
  product: {
    id: number;
    name: string;
    productImages: string[];
    isFeatured: boolean;
    brandName: string;
    categoryName: string;
    categoryId: number;
    slug: string;
  };
}

export default interface Cart {
  quantity: number;
  isSelect: boolean;
  variant: CartVariant;
}
