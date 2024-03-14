import { User } from '../../../src/user/domains/user';
import { UserMemoryRepository } from '../fake/user.memory.repository';
import { UserRepository } from '../../../src/user/domains/user.repository';
import { UserService } from '../../../src/user/services/user.service';

describe(`유저 서비스`, () => {
  const userRepository: UserRepository = new UserMemoryRepository();
  const userService: UserService = new UserService(userRepository);

  it(`⭕️ 유저를 생성할 수 있음`, async () => {
    // given
    const id = 'test1234';
    const password = 'test1234!@#';

    // when
    const user: User = await userService.create(id, password);

    // then
    expect(user).not.toBeNull();
    expect(user.id).toBe(id);
    expect(user.password).toBe(password);
  });
  it(`⭕️ 유저를 조회할 수 있음`, async () => {
    // given
    const id = 'test1234';

    // when
    const user: User = await userService.findById(id);

    // then
    expect(user).not.toBeNull();
    expect(user.id).toBe(id);
    expect(user.password).not.toBeUndefined();
  });
});
