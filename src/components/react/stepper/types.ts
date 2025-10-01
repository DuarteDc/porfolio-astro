export interface FirstFormData {
  name: string;
  email: string;
}
export interface FirstFormErrors {
  name?: string;
  email?: string;
}

export interface SecondFormData {
  password: string;
  confirmPassword: string;
}
export interface SecondFormErrors {
  password?: string;
  confirmPassword?: string;
}
