import { User } from '../../../src/user/domains/user';
import { UserIdValidationError } from '../../../src/core/errors/user.id.validation.error';
import { UserPasswordValidationError } from '../../../src/core/errors/user.password.validation.error';

describe(`유저 도메인`, () => {
  it(`❌ 유저를 생성할 수 없음 - 길이가 짧은 아이디`, () => {
    // given
    const id = 'test';
    const password = 'test123!@#';

    // then
    expect(() => {
      User.create(id, password);
    }).toThrow(new UserIdValidationError(`아이디는 5자 이상이어야 합니다.`));
  });
  it(`❌ 유저를 생성할 수 없음 - 특수문자를 사용한 아이디`, () => {
    // given
    const id = 'test1111@@!11';
    const password = 'test123!@#';

    // then
    expect(() => {
      User.create(id, password);
    }).toThrow(
      new UserIdValidationError(`아이디는 특수문자를 사용할 수 없습니다.`),
    );
  });
  it(`❌ 유저를 생성할 수 없음 - 길이가 짧은 패스워드`, () => {
    // given
    const id = 'test1';
    const password = 'test1';

    // then
    expect(() => {
      User.create(id, password);
    }).toThrow(
      new UserPasswordValidationError(`패스워드는 8자 이상이어야 합니다.`),
    );
  });
  it(`❌ 유저를 생성할 수 없음 - 특수문자가 포함되지 않은 패스워드`, () => {
    // given
    const id = 'test1';
    const password = 'test12345';
    // then
    expect(() => {
      User.create(id, password);
    }).toThrow(
      new UserPasswordValidationError(
        `패스워드는 특수문자가 포함되어야 합니다.`,
      ),
    );
  });
  it(`⭕️ 유저를 생성할 수 있음`, () => {
    // given
    const id = 'test1234';
    const password = 'test@1234!';

    // when
    const newUser = User.create(id, password);

    // then
    expect(newUser).not.toBeNull();
    expect(newUser.id).toBe(id);
    expect(newUser.password).toBe(password);
  });
});
