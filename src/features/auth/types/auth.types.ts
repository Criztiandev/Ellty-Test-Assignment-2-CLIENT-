export interface IUser {
  id: number;
  username: string;
  role: string;
}

export interface ILoginInput {
  username: string;
  password: string;
}

export interface IRegisterInput {
  username: string;
  password: string;
}

export interface IPasswordResetInput {
  username: string;
}

export interface IPasswordConfirmInput {
  token: string;
  new_password: string;
}

export interface IAuthResponse {
  payload: {
    token: string;
    user: IUser;
  };
  message: string;
}

export interface IPasswordResetResponse {
  payload: {
    token: string;
    expires_at: string;
  };
  message: string;
}
