export const ERROR_MESSAGES = {
  GENERAL: {
    USER_ALREADY_EXISTS: "A user with this email already exists.",
    SIGNUP_FAILED: "Signup failed. Please try again later.",
  },
  AUTH: {
    SERVER_ERROR: "Something went wrong. Please try again.",
    INVALID_CREDENTIALS: "Invalid email or password.",
    INVALID_CREDENTIALS_EMAIL: "No user found with this email.",
    INVALID_CREDENTIALS_PASSWORD: "Password is incorrect.",
  },
  INPUT: {
    INVALID: "Invalid input. Please check your data.",
  },
  JWT:{
    SECRET_KEY_NOT_DEFINE:"Secret key not defined in environment variables",
    INVALID_DATA_USER:"Invalid user role"
  }
};

