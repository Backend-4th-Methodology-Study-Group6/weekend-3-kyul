import { CustomError } from './custom.error';

export class UserPasswordValidationError extends CustomError {
  constructor(message: string) {
    super(404, message);
    Object.setPrototypeOf(this, UserPasswordValidationError.prototype);
  }
}
