import type Address from "./address";

export default interface Customer {
  id: string;
  avatar: string;
  email: string;
  fullName: string;
  phone: string;
  addresses: Address;
}
