export default interface Customer {
  id: string;
  avatar: string;
  email: string;
  fullName: string;
  phone: string;
  status: boolean;
  isGuest: boolean;
  authProvider: string;
  providerId: string;
}
