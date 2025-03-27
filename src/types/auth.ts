// export interface UserDetails {
//   name: string;
//     email: string;
//     password: string;
//     phonenumber: string; 
// }

export interface Login {
  email: string;
  password: string;
}

export interface Forgot {
  email: string;
}

export interface ResetPassword {
  password: string;
}

export interface VerifyEmail {
  user_status: string;
}

export interface GetUser {
  id: string;
  userData:string;
}

export interface UpdateUser {
  address1: string;
  address2: string;
  name: string;
  gender: string;
  phonenumber: string;
  city: string;
  state_name: string;
  country_name: string;
  zip: string;
}