import { UserPasswordValidationError } from '../../core/errors/user.password.validation.error';
import { UserIdValidationError } from '../../core/errors/user.id.validation.error';

export class User {
  constructor(
    private readonly _id: string,
    private readonly _password: string,
  ) {}

  static create(id: string, password: string): User {
    if (password.length < 8)
      throw new UserPasswordValidationError(
        `패스워드는 8자 이상이어야 합니다.`,
      );
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password))
      throw new UserPasswordValidationError(
        `패스워드는 특수문자가 포함되어야 합니다.`,
      );
    if (id.length < 5)
      throw new UserIdValidationError(`아이디는 5자 이상이어야 합니다.`);
    if (/[^\w]/gi.exec(id))
      throw new UserIdValidationError(
        `아이디는 특수문자를 사용할 수 없습니다.`,
      );
    return new User(id, password);
  }

  get password(): string {
    return this._password;
  }

  get id(): string {
    return this._id;
  }
}
