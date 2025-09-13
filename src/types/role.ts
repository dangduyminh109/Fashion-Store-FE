import type Permission from "./permission";

export default interface Supplier {
  id: number;
  name: string;
  description: string;
  status: boolean;
  permissions: Permission[];
}
