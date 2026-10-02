export type SignInRequest = {
  email: string;
  password: string;
};

export type SignUpRequest = {
  name: string;
  email: string;
  password: string;
};

export type ForgetPasswordRequest = {
  email: string;
};

export type AuthAction = "signin" | "signout" | "signup" | "forget";

export type AuthResponse = {
  message?: string;
};
