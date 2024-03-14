# Overview

- 간단한 블로그 포스팅 서비스를 TDD로 구현해 봅니다.
- 단위 테스트를 먼저 작성하고, 통합 테스트, E2E 테스트 순서로 작성합니다.

---

# Goals

- [x] `User` 서비스 구현
- [ ] `Post` 서비스 구현

---

# Commands

## 패키지 설치

```bash
$ npm i
```

## 테스트 실행 방법

```bash
# 단위 테스트
$ npm run test:small

# 통합 테스트
$ npm run test:medium

# E2E 테스트
$ npm run test:big
```

위 명령어들로 각각의 테스트를 실행해 볼 수 있습니다.

## 프로젝트 빌드

```bash
$ npm run build
```

테스트가 모두 성공했다면 마지막으로 프로젝트를 빌드해 실제 구현에서 실패하는 부분이 없는지 확인해야 합니다.

### 프로젝트 실행

```bash
# production
$ npm run start:prod

# dev
$ npm run start:dev
```

프로젝트는 현재 `dev` 환경에서 구동되도록 구현되었습니다. `prod` 환경에서 구동되려면 추가적인 환경 구성이 필요합니다.

> [!requiremets]
>
> - Docker
> - Docker Compose

---

# 구현 방법(w/TDD)

## (0) 테스트 프로젝트 구조 정하기

```
📦src
📦test
 ┣ 📂user
 ┃ ┣ 📂fake
 ┃ ┃ ┗ 📜user.memory.repository.ts
 ┃ ┣ 📂medium
 ┃ ┃ ┣ 📜user.controller.spec.ts
 ┃ ┃ ┣ 📜user.repository.spec.ts
 ┃ ┃ ┗ 📜user.service.spec.ts
 ┃ ┗ 📂small
 ┃ ┃ ┣ 📜user.controller.test.ts
 ┃ ┃ ┣ 📜user.domain.test.ts
 ┃ ┃ ┣ 📜user.repository.test.ts
 ┃ ┃ ┗ 📜user.service.test.ts
 ┗ 📜jest-e2e.json
```

테스트 프로젝트의 구조가 위와 같아지도록 테스트 코드를 작성해 봅니다.

## (1) 실패하는 테스트부터 작성하기 - <span style="color:red">RED</span>

```typescript
describe(`❌ 유저를 생성할 수 없음 - 길이가 짧은 아이디`, () => {
  const username: string = 'test';
  const password: string = 'test1234';

  expect(() => {
    User.from(username, password);
  }).toThrow(new UserIdValidationError(`아이디는 5자 이상이어야 합니다.`));
});
```

위 테스트는 당연히 컴파일부터 실패해야 합니다. 테스트를 성공시키기 위한 첫 번째 스텝으로 테스트에 필요한 자료구조나 클래스, 함수 등을 정의하는 것입니다.

## (2) 테스트가 통과하도록 하기 - <span style="color:green">GREEN</span>

테스트가 통과하는데 필요한 `UserCreateDto`와 `User`, 그리고 `UserIdValidationError`를 구현하면 됩니다.

우선 IDE에서 빨간 줄이 표시되지 않을 정도로만 정의합니다.

```typescript
export class User {
  constructor(
    private readonly _username: string,
    private readonly _password: string,
  ) {}

  static from(username: string, password: string): User {
    return new User(username, password);
  }
}

export class UserIdValidationError extends Error {
  readonly statusCode: number = 400;
  constructor(message: string) {
    super(message);
  }
}

describe(`❌ 유저를 생성할 수 없음 - 길이가 짧은 아이디`, () => {
  const username: string = 'test';
  const password: string = 'test1234';

  expect(() => {
    User.from(username, password);
  }).toThrow(new UserIdValidationError(`아이디는 5자 이상이어야 합니다.`));
});
```

테스트를 실행하면 실패해야 합니다. 여기서는 `from` 안에서 지정한 예외가 발생하지 않아 테스트가 실패합니다.

이제 테스트를 성공시키기 위한 구현을 진행합니다.

```typescript
export class User {
  constructor(
    private readonly _username: string,
    private readonly _password: string,
  ) {}

  static from(username: string, password: string): User {
    if (username.length < 5)
      throw new UserIdValidationError(`아이디는 5자 이상이어야 합니다.`);
    return new User(username, password);
  }
}

export class UserIdValidationError extends Error {
  readonly statusCode: number = 400;
  constructor(message: string) {
    super(message);
  }
}

describe(`❌ 유저를 생성할 수 없음 - 길이가 짧은 아이디`, () => {
  const username: string = 'test';
  const password: string = 'test1234';

  expect(() => {
    User.from(username, password);
  }).toThrow(new UserIdValidationError(`아이디는 5자 이상이어야 합니다.`));
});
```

테스트를 실행하면 성공합니다.

> [!note]
> TDD를 진행할 때는 테스트에 필요한 요소를 정의/추가/변경할 때 마다 매순간 테스트를 실행하는 습관이 중요!

## (3) 리팩토링 하기 - <span style="color:orange">REFACTOR</span>

테스트가 성공하고 나서 리팩토링할 부분을 찾습니다.

위에서 작성된 코드에서 우리는 클라이언트의 요청으로 부터 많은 데이터를 전달받아야 할 수도 있음을 알 수 있습니다.

따라서 `username`, `password` 변수를 따로 패싱하는 것이 아니라 `UserCreateDto`로 부터 패싱하도록 하면 좋을거 같습니다.

```typescript
export class User {
	constructor(private readonly _username: string, private readonly _password: string) {}

	static from(data: UserCreateDto): User {
		if(data.username.length < 5)
			throw new UserIdValidationError(`아이디는 5자 이상이어야 합니다.`)
		return new User(data.username, data.password)
	}
}

export class UserIdValidationError extends Error {
	readonly statusCode: number = 400
	constructor(message: string) {
		super(message)
	}
}

describe(`❌ 유저를 생성할 수 없음 - 길이가 짧은 아이디`, () => {
	const data: UserCreateDto = {
		username: string
		password: string
	}

	expect(() => {
		User.from(data)
	}).toThrow(new UserIdValidationError(`아이디는 5자 이상이어야 합니다.`))
})
```

성공적으로 리팩토링 되었는지 확인하기 위해 테스트를 실행합니다.

이런식으로 **(1) 테스트 실패하기 > (2) 테스트 성공하기 > (3) 리팩토링 하기** 를 반복해 개발하면 됩니다.
또한 변경 사항이 있을 때 마다 테스트를 반복적으로 실행해 위 과정이 의도한 대로 동작하는 지 확인해야 합니다.

---

# End.

테스트 코드 작성을 통해 원하는 기능을 만드는 것에 성공했다면 테스트 코드와 같은 위치에 있던 실제 구현 사항들을 모두 `src` 디렉토리로 옮기도록 합니다.

`vscode`에서 `Control(˄) + T`키를 누르면 **Move to a new file** 옵션을 선택할 수 있습니다.
이 옵션으로 새파일을 만들고 원하는 이름으로 변경해 `src` 디렉토리에 모두 옮깁니다.

최종적으로 프로젝트 구조는 아래와 같아집니다.

```
📦test
📦src
 ┣ 📂config
 ┃ ┗ 📜typeorm.config.ts
 ┣ 📂core
 ┃ ┗ 📂errors
 ┃ ┃ ┣ 📜custom.error.ts
 ┃ ┃ ┣ 📜user.id.validation.error.ts
 ┃ ┃ ┗ 📜user.password.validation.error.ts
 ┣ 📂user
 ┃ ┣ 📂controllers
 ┃ ┃ ┣ 📂dtos
 ┃ ┃ ┃ ┗ 📜user.create.dto.ts
 ┃ ┃ ┗ 📜user.controller.ts
 ┃ ┣ 📂domains
 ┃ ┃ ┣ 📜user.repository.ts
 ┃ ┃ ┗ 📜user.ts
 ┃ ┣ 📂infrastructures
 ┃ ┃ ┣ 📜user.entity.ts
 ┃ ┃ ┗ 📜user.typeorm.repository.ts
 ┃ ┣ 📂services
 ┃ ┃ ┗ 📜user.service.ts
 ┃ ┗ 📜user.module.ts
 ┣ 📜app.module.ts
 ┗ 📜main.ts
```
