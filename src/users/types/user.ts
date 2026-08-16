export type EmailConfirmation = {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
};

export type User = {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  emailConfirmation: EmailConfirmation;
};

export type UserInputModel = {
  login: string;
  password: string;
  email: string;
};

export type UserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
};

export type UserQueryInput = {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};