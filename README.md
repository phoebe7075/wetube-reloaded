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

# 에러 해결 목록

## path to regexp

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

## Stack

- express: "^5.1.0"
- morgan: "^1.10.0"
- pug: "^3.0.3"
- nodejs: "^22.16.0"
- babel: "^7.27.1"
  - nodemon: "^3.1.10"
