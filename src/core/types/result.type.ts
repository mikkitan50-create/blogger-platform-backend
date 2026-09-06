export enum ResultStatus {
  Success = 'Success',
  NotFound = 'NotFound',
  Forbidden = 'Forbidden',
  Unauthorized = 'Unauthorized',
  BadRequest = 'BadRequest',
  TooManyRequests = 'TooManyRequests',
}

type ExtensionType = { field: string | null; message: string };

export type Result<T = null> = {
  status: ResultStatus;
  errorMessage?: string;
  extensions: ExtensionType[];
  data: T;
};