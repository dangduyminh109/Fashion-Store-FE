import type Cart from "~/client/types/cart";

function getPrice(cartItem: Cart) {
  let displayPrice = 0;
  let variant = cartItem.variant;
  if (variant) {
    if (
      variant.promotionalPrice &&
      new Date(variant.promotionEndTime).getTime() > Date.now() &&
      new Date(variant.promotionStartTime).getTime() <= Date.now()
    ) {
      displayPrice = variant.promotionalPrice;
    } else {
      displayPrice = variant.salePrice;
    }
  }
  return displayPrice * cartItem.quantity;
}

export default getPrice;
