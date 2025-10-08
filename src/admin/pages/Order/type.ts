export interface productOption {
  id: number;
  sku: string;
  name: string;
  image: string;
  inventory: number;
  value: string;
  price: number;
}

export interface voucherOption {
  id: number;
  name: string;
  code: string;
  discountValue: number;
  minOrderValue: number;
  maxDiscountValue: number;
  discountType: string;
}

export interface customerOption {
  id: string;
  fullName: string;
  phone: string;
  avatar: string;
}
