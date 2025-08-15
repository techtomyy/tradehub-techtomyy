
export interface SignupBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  conditionagree: boolean;
}


export interface LoginBody {
  email: string;
  password: string;
}


export interface UserData {
    id: string;
    email: string;
    role: 'User' | 'Admin';
}
