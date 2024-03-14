import { CustomError } from './custom.error';

export class UserIdValidationError extends CustomError {
  constructor(message: string) {
    super(404, message);
    Object.setPrototypeOf(this, UserIdValidationError.prototype);
  }
}
