export class CustomError extends Error {
  readonly statusCode: number;
  constructor(statusCode?: number, message?: string) {
    super(message);
    this.name = 'CustomError';
    this.statusCode = statusCode | 404;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
