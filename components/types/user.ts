export type User = {
  email: string;
  access_token: string;
};

export type UserJWT = {
  uid: string;
  iat: number;
  exp: number;
};
