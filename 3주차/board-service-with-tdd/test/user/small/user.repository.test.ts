import { User } from '../../../src/user/domains/user';
import { UserMemoryRepository } from '../fake/user.memory.repository';
import { UserRepository } from '../../../src/user/domains/user.repository';

describe(`유저 레포지토리`, () => {
  const userRepository: UserRepository = new UserMemoryRepository();

  it(`⭕️ 유저를 저장할 수 있음`, async () => {
    const id = 'test1234';
    const password = 'test1234!@#';
    const newUser: User = User.create(id, password);

    const user: User = await userRepository.save(newUser);

    expect(user).not.toBeNull();
    expect(user.id).toBe(id);
    expect(user.password).toBe(password);
  });
  it(`⭕️ 유저를 조회할 수 있음`, async () => {
    const id = 'test1234';

    const findings: User = await userRepository.findById(id);

    expect(findings).not.toBeNull();
    expect(findings.id).toBe('test1234');
    expect(findings.password).not.toBeNull();
  });
});
