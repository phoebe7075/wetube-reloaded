# Wetube Reloaded

- / : Home

- /join : Join

- /login : Log in

- /search : Search

- /users/:id : See user profile
- /users/logout : Log Out
- /users/edit : Edit My Profile
- /users/remove : remove My Profile

- /videos/:id : Watch Video
- /videos/:id/edit : edit Video
- /videos/:id/remove : remove Video
- /videos/upload : upload video

## 에러 해결 목록

### path to regexp

- "/:id(\\d+)" 와 같은 파라미터에 직접 regular expression을 하는 경우 에러 발생.
- 이는 8.0.0 버전 올라가면서 보안문제 (백트래킹으로 ReDoS 공격을 할 수 있음 등)에 의해 삭제된 것으로 추측.
- 해결 방법으로는 2가지 존재. 버전을 다운그레이드 하면 되는게 첫 번째.

```
"dependencies": {
    ...
  },
  "devDependencies": {
    ...
  },
  "overrides": {
    "path-to-regexp" : "6.3.0"
  }
```

- 위와 같이 overrides로 강제로 path to regexp 라이브러리의 버전을 6.3.0으로 낮추고 node_modules, package-lock.json을 삭제 후 `npm install` 하여 재설치하면 된다.
- 다른 방법으론

```
const validateNumericId = (req, res, next) => {
  const id = req.params.id; // id 파라미터를 가져옴

  // 정규식: 문자열의 시작(^)부터 끝($)까지 오직 숫자(\d) 하나 이상(+)으로만 이루어져 있는지 검사
  if (!/^\d+$/.test(id)) {
    // 유효하지 않은 경우, 404 Not Found 응답 (또는 400 Bad Request)
    // 메시지도 조금 더 구체적으로 변경 가능
    return res.status(404).render("404", { pageTitle: "Invalid ID Format" });
    // 또는 API라면: return res.status(400).json({ error: "Invalid ID format. ID must be numeric." });
  }
  // 유효한 경우, 다음 미들웨어 또는 라우트 핸들러로 제어를 넘김
  next();
};
```

- 와 같은 미들웨어를 사용해서 검사를 해야함. 이 경우는 순서를 지키는 과정은 필수이기 때문에 파라미터를 쓰지 않는 라우터들을 위로 올려야 한다.

### mongodb 관련

- 먼저 mongod 명령어 안뜨는 부분은 시스템 환경변수에 `C:\Program Files\MongoDB\Server\8.0\bin` 와 같은 경로를 추가해야 함. 그래야 실행됨
- mongo 명령어는 mongosh로 대체됨 (6버전 이상 부터). 그래서 mongosh (mongo shell) 을 따로 설치해야 mongosh 명령어가 작동할 것.
- wsl에서는 연결을 하려면 먼저 window cmd 등에서 ipconfig로 wsl의 로컬 ip를 찾아서 복사해두고 mongod 경로에 있는 mongod.cfg 안에
  ```# network interfaces
  net:
    port: 27017
    bindIp: 127.0.0.1, 172.27.96.1
  ```
  이렇게 추가를 해줘야 함(관리자 권한으로 메모장 실행하고 수정해야 적용가능)
  그 다음 윈도우 방화벽에서 새 규칙 추가 - 포트 - 27017 추가 하여야 함.
  그 다음 실제 코드 상에서도 wsl을 통해 접속하므로 wsl 로컬 ip로 수정해야 될 것.
- 만약 wsl에서 window로 포트가 정상적으로 연결되는지 테스트를 해보고싶다면 `telnet 172.27.96.1 27017` 으로 해보면 된다. 종료하려면 `ctrl + ]` 를 하거나, `telnet>` 이렇게 뜰 경우 quit 입력하면 연결 종료.
- 이런식으로 mongod.cfg를 수정했다면 보통 그냥 상태에선 서비스 등록이 안되있어서 mongod 실행 시 그냥 기본상태로 실행하려고만 함. 그래서 서비스 등록을 통해 자동으로 --config 뒤의 내용을 실행하게끔 해야 한다. 그건 powershell 관리자 권한 실행해서
  ```
  mongod.exe --config "C:\Program Files\MongoDB\Server\8.0\bin\mongod.cfg" --install --serviceName "MongoDB" --serviceDisplayName "MongoDB Server"
  ```
  를 하면 됨. 그 뒤에 powershell 관리자권한으로 `net start MongoDB` 해주면 된다.

## 팁

### pug

- 페이지 구성 시 href 등으로 링크를 작성할 때 `"/aaa/bbb"`와 같이 앞에 /를 붙이면 현재 루트 경로에서 바로 시작하게 되는, 즉 /aaa/bbb 라는 경로를 갖게 된다. 반대로 `"aaa/bbb"` 로 사용하게 된다면 현재 페이지의 링크에서 해당하는 경로가 더 붙는 상대경로로 가게 된다. 즉 /xxx/yyy/aaa/bbb 와 같이 됨.

## Stack

- express: "^5.1.0"
- morgan: "^1.10.0"
- pug: "^3.0.3"
- nodejs: "^22.16.0"
- babel: "^7.27.1"
  - nodemon: "^3.1.10"
- MongoDB: "8.0.9"
- Mongoose: "8.15.1"
- bcrypt: "6.0.0"
