export default interface DashboardResponse {
  totalOrder: number;
  totalPost: number;
  totalCustomer: number;
  totalRevenue: number;
  totalOrderPrev: number;
  totalPostPrev: number;
  totalCustomerPrev: number;
  totalRevenuePrev: number;
  monthlyRevenue: number[];
  monthlyRevenuePrev: number[];
  topCategory: { [key: string]: number };
  customerList: CustomerDashboard[];
  orderList: OrderDashboard[];
}

interface CustomerDashboard {
  avatar: string;
  fullName: number;
  createdAt: Date;
}

interface OrderDashboard {
  customerName: string;
  createdAt: Date;
  orderStatus: string;
  totalAmount: number;
  numOfProduct: number;
}
