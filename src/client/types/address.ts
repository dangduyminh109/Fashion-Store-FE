export default interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  ward: string;
  district: string;
  cityId: number;
  wardId: number;
  districtId: number;
  isDefault: boolean;
}
