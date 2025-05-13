interface IUserAccount {
  dataSources: number[];
  id: number;
  permissions: number[];
  username: string;
}

export interface IUser {
  clientId: string;
  userAccount: IUserAccount;
}

export class User {
  clientId: string;
  userAccount: IUserAccount;

  constructor(user: IUser) {
    this.clientId = user.clientId;
    this.userAccount = user.userAccount;
  }
  toObject() {
    return {
      clientId: this.clientId,
      userAccount: this.userAccount,
    };
  }
}


export class LoginRequest {
  grant_type = "password";
  client_id = "ynixWeb";
  client_secret = "ynixWebSecret";
  username: string;
  password: string;

  constructor(user: LoginRequestType) {
    this.username = user.username;
    this.password = user.password;
  }

  toObject() {
    return {
      grant_type: this.grant_type,
      client_id: this.client_id,
      client_secret: this.client_secret,
      username: this.username,
      password: this.password,
    };
  }
}
export type LoginRequestType = {
  grant_type?: string;
  client_id?: string;
  client_secret?: string;
  username: string;
  password: string;
};
export interface ResetPasswordRequest {
  username: string;
  oldPassword: string;
  newPassword: string;
}

const initialState: any = {
  auth: null,
  user: null,
};

export default initialState;
