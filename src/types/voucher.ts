export default interface Voucher {
  id: number;
  name: string;
  code: string;
  used: number;
  status: boolean;
  quantity: number;
  description: string;
  endDate: Date;
  startDate: Date;
  discountValue: number;
  minOrderValue: number;
  maxDiscountValue: number;
  discountType: string;
}
