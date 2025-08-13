export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  conditionagree: boolean;
  marketingEmails: boolean;
}

export interface SignupFormProps {
  onSubmit: (data: SignupFormData) => void;
  isLoading: boolean;
}

export interface GoogleSignupButtonProps {
  onClick: () => void;
  isLoading: boolean;
}
