export interface Register {
  id: string;
  name: string;
  gender: string;
  email: string;
  // password: string;
  phonenumber: string;
  Address?: {
    address1: string;
    address2: string;
    city: string;
    state_name: string;
    state_code: string;
    country_code: string;
    country_name: string;
    zip: string;
  }[];
}
