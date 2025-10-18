import type AttributeValue from "./attributeValue";

export default interface Variant {
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
}
