import type Variant from "~/client/types/variant";

export default function handlePrice(variantList: Variant[]) {
  let minSalePrice = -1;
  let minPromotionPrice = -1;
  variantList.forEach((item) => {
    if (item.promotionalPrice) {
      if (minPromotionPrice < 0 || item.promotionalPrice < minPromotionPrice) {
        minPromotionPrice = item.promotionalPrice;
        minSalePrice = item.salePrice;
      }
    } else if (item.salePrice < minSalePrice || minSalePrice < 0) {
      minSalePrice = item.salePrice;
      minPromotionPrice = item.salePrice;
    }
  });
  return {
    minSalePrice,
    minPromotionPrice,
  };
}
