import type Variant from "./variant";

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  productName: string;
  variant: Variant;
}

export default interface Order {
  id: number;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  note: string;
  paymentMethod: string;
  isPaid: boolean;
  paidAt: Date;
  customerId: string;
  customerName: string;
  orderStatus: string;
  totalAmount: number;
  totalDiscount: number;
  finalAmount: number;
  voucherId: number;
  voucherName: string;
  discountType: string;
  orderItems: OrderItem[];
}
