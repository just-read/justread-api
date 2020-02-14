# API List

- [사용자](#사용자)
- [회원 가입](#회원-가입)
- [로그인](#로그인)
- [토큰 갱신](#토큰-갱신)

### API 응답

공통 유형은 아래와 같으며 각 API마다 `result`의 객체만 표시해 두었음.

| 키        | 데이터 타입        | 설명                 |
| --------- | ------------------ | -------------------- |
| `success` | `boolean`          | 성공 여부            |
| `message` | `string` or `null` | 응답 메세지(에러 등) |
| `result`  | `object` or `null` | 응답 오브젝트        |

- 성공시

  성공시 `HTTP Status Code`는 200대로 응답

  ```json
  {
    "success": true,
    "message": null,
    "result": {
      // API 응답 객체
    }
  }
  ```

- 실패시

  실패시 `HTTP Status Code`는 실패 사유에 따라 부여

  ```json
  {
    "success": false,
    "message": "에러 메세지",
    "result": null
  }
  ```

## 사용자

### 회원 가입

#### 요청

```
POST {{API_URL}}/v1/users/signup
```

| 파라미터   | 파라미터 유형 | 데이터 타입 | 필수 여부 | 설명     |
| ---------- | ------------- | ----------- | --------- | -------- |
| `email`    | `body`        | `string`    | ✅        | 이메일   |
| `password` | `body`        | `string`    | ✅        | 비밀번호 |
| `nickName` | `body`        | `string`    | ✅        | 이름     |

#### 응답

| 키             | 데이터 타입 | 설명          |
| -------------- | ----------- | ------------- |
| `accessToken`  | `string`    | 인증 토큰     |
| `refreshToken` | `string`    | 리프레시 토큰 |

```json
{
  "accessToken": "ACCESS TOKEN STRING HERE",
  "refreshToken": "REFRESH TOKEN STRING HERE"
}
```

### 로그인

#### 요청

```
POST {{API_URL}}/v1/users/login
```

| 파라미터   | 파라미터 유형 | 데이터 타입 | 필수 여부 | 설명     |
| ---------- | ------------- | ----------- | --------- | -------- |
| `email`    | `body`        | `string`    | ✅        | 이메일   |
| `password` | `body`        | `string`    | ✅        | 비밀번호 |

#### 응답

| 키             | 데이터 타입 | 설명          |
| -------------- | ----------- | ------------- |
| `accessToken`  | `string`    | 인증 토큰     |
| `refreshToken` | `string`    | 리프레시 토큰 |

```json
{
  "accessToken": "ACCESS TOKEN STRING HERE",
  "refreshToken": "REFRESH TOKEN STRING HERE"
}
```

### 토큰 갱신

#### 요청

```
POST {{API_URL}}/v1/users/tokens
```

| 파라미터       | 파라미터 유형 | 데이터 타입 | 필수 여부 | 설명          |
| -------------- | ------------- | ----------- | --------- | ------------- |
| `refreshToken` | `body`        | `string`    | ✅        | 리프레시 토큰 |

#### 응답

| 키             | 데이터 타입 | 설명          |
| -------------- | ----------- | ------------- |
| `accessToken`  | `string`    | 인증 토큰     |
| `refreshToken` | `string`    | 리프레시 토큰 |

```JSON
{
  "accessToken": "ACCESS TOKEN STRING HERE",
  "refreshToken": "REFRESH TOKEN STRING HERE"
}
```

### 프로필 상세

## 책

### 책 목록

### 책 검색

### 책 상세

### 새 책 추가

## 리뷰

### 책 별점 평가

### 책 리뷰 남기기

### 책 리뷰 목록

## 사용자 책 목록

### 책 목록에 책 추가

### 책 목록에서 책 삭제
