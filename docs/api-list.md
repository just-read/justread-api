# API List

- [인증](#인증)
  - [✅ 회원 가입](#회원-가입)
  - [✅ 로그인](#로그인)
  - [✅ 구글 로그인](#구글-로그인)
  - [✅ 토큰 갱신](#토큰-갱신)
- [사용자](#사용자)
  - [😶 프로필 상세](#프로필-상세)
- [책](#책)
  - [✅ 책 목록](#책-목록)
  - [✅ 책 검색](#책-검색)
  - [✅ 책 상세](#책-상세)
  - [✅ 새 책 추가](#새-책-추가)
  - [✅ 책 수정](#책-수정)
  - [✅ 책의 내 리뷰](#책의-내-리뷰)
  - [✅ 책의 리뷰들](#책의-리뷰들)
- [리뷰](#리뷰)
  - [✅ 새 책 별점 평가 생성](#새-책-별점-평가-생성)
  - [✅ 책 별점 평가 삭제](#책-별점-평가-삭제)
  - [✅ 새 책 리뷰 생성](#새-책-리뷰-생성)
  - [책 리뷰 수정](#책-리뷰-수정)
  - [✅ 책 리뷰 삭제](#책-리뷰-삭제)
- [사용자 책장](#사용자-책장)
  - [✅ 새 책장 생성](#새-책장-생성)
  - [✅ 책장 목록](#책장-리스트)
  - [✅ 책장 상세](#책장-상세)
  - [✅ 책장 이름 수정](#책장-이름-수정)
  - [✅ 책장 삭제](#책장-삭제)
  - [✅ 책장에 책 추가](#책장에-책-추가)
  - [✅ 책장에서 책 삭제](#책장에서-책-삭제)

### API 응답

공통 유형은 아래와 같으며 각 API마다 `result`의 객체만 표시해 두었음.

| 키        | 데이터 타입        | 설명                 |
| --------- | ------------------ | -------------------- |
| `success` | `boolean`          | 성공 여부            |
| `message` | `string` or `null` | 응답 메세지(에러 등) |
| `result`  | `object` or `null` | 응답 오브젝트        |

- 성공시

  성공시 `HTTP Status Code`는 200대로 응답

  ```jsonc
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

  ```jsonc
  {
    "success": false,
    "message": "에러 메세지",
    "result": null
  }
  ```

## 인증

### 회원 가입

#### 요청

```
POST {{API_URL}}/v1/auth/signup
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

```jsonc
{
  "accessToken": "ACCESS TOKEN STRING HERE",
  "refreshToken": "REFRESH TOKEN STRING HERE"
}
```

### 로그인

#### 요청

```
POST {{API_URL}}/v1/auth/login
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

```jsonc
{
  "accessToken": "ACCESS TOKEN HERE",
  "refreshToken": "REFRESH TOKEN HERE"
}
```

### 구글 로그인

#### 요청

```
POST {{API_URL}}/v1/auth/google
```

| 파라미터   | 파라미터 유형 | 데이터 타입 | 필수 여부 | 설명      |
| ---------- | ------------- | ----------- | --------- | --------- |
| `email`    | `body`        | `string`    | ✅        | 이메일    |
| `nickName` | `body`        | `string`    | ✅        | 이름      |
| `googleId` | `body`        | `string`    | ✅        | 구글 ID   |
| `tokenId`  | `body`        | `string`    | ✅        | 구글 토큰 |

#### 응답

| 키             | 데이터 타입 | 설명          |
| -------------- | ----------- | ------------- |
| `accessToken`  | `string`    | 인증 토큰     |
| `refreshToken` | `string`    | 리프레시 토큰 |

```jsonc
{
  "accessToken": "ACCESS TOKEN HERE",
  "refreshToken": "REFRESH TOKEN HERE"
}
```

### 토큰 갱신

#### 요청

```
POST {{API_URL}}/v1/auth/tokens
```

| 파라미터       | 파라미터 유형 | 데이터 타입 | 필수 여부 | 설명          |
| -------------- | ------------- | ----------- | --------- | ------------- |
| `refreshToken` | `body`        | `string`    | ✅        | 리프레시 토큰 |

#### 응답

| 키             | 데이터 타입 | 설명          |
| -------------- | ----------- | ------------- |
| `accessToken`  | `string`    | 인증 토큰     |
| `refreshToken` | `string`    | 리프레시 토큰 |

```jsonc
{
  "accessToken": "ACCESS TOKEN HERE",
  "refreshToken": "REFRESH TOKEN HERE"
}
```

## 사용자

### 프로필 상세

#### 요청

```
POST {{API_URL}}/v1/users/{userId}
```

| 파라미터 | 파라미터 유형 | 데이터 타입 | 필수 여부 | 설명    |
| -------- | ------------- | ----------- | --------- | ------- |
| `userId` | `path`        | `number`    | ✅        | 유저 ID |

#### 응답

| 키         | 데이터 타입 | 설명      |
| ---------- | ----------- | --------- |
| `userInfo` | `object`    | 유저 정보 |

## 책

#### 책 오브젝트 기본 타입

```typescript
interface Book {
  uniqueId: string;
  title: string;
  description: string;
  year: number;
}
```

#### 페이지 정보 오브젝트 기본 타입

```typescript
interface PageInfo {
  total: number;
  current: number;
  limit: number;
  count: number;
}
```

### 책 목록

#### 요청

```
GET {{API_URL}}/v1/books?type={type}
```

| 파라미터 | 파라미터 유형 | 데이터 타입 | 필수 여부          | 설명                    |
| -------- | ------------- | ----------- | ------------------ | ----------------------- |
| `type`   | `query`       | `string`    | `(default) recent` | 가져올 책 목록의 타입   |
| `page`   | `query`       | `string`    | `(default) 1`      | 가져올 페이지 번호      |
| `limit`  | `query`       | `string`    | `(default) 10`     | 페이지에 표시될 책 갯수 |

#### 응답

| 키          | 데이터 타입 | 설명        |
| ----------- | ----------- | ----------- |
| `bookItems` | `Book[]`    | 책 목록     |
| `pageInfo`  | `PageInfo`  | 페이지 정보 |

```jsonc
{
  "bookItems": [
    {
      "uniqueId": "UNIQUE ID",
      "title": "TITLE",
      "description": "DESCRIPTION",
      "year": 2020
    },
    {
      "uniqueId": "UNIQUE ID",
      "title": "TITLE",
      "description": "DESCRIPTION",
      "year": 2020
    }
    // more books...
  ],
  "pageInfo": {
    "total": 2,
    "current": 1,
    "limit": 10,
    "count": 2
  }
}
```

### 책 검색

#### 요청

```
GET {{API_URL}}/v1/books?p={search_term}
```

| 파라미터 | 파라미터 유형 | 데이터 타입 | 필수 여부      | 설명                        |
| -------- | ------------- | ----------- | -------------- | --------------------------- |
| `q`      | `query`       | `string`    | ✅             | 검색어(ISBN, 제목, 저자 등) |
| `page`   | `query`       | `string`    | `(default) 1`  | 가져올 페이지 번호          |
| `limit`  | `query`       | `string`    | `(default) 10` | 페이지에 표시될 책 갯수     |

#### 응답

| 키          | 데이터 타입 | 설명        |
| ----------- | ----------- | ----------- |
| `bookItems` | `Book[]`    | 책 목록     |
| `pageInfo`  | `PageInfo`  | 페이지 정보 |

```jsonc
{
  "bookItems": [
    {
      "uniqueId": "UNIQUE ID",
      "title": "TITLE",
      "description": "DESCRIPTION",
      "year": 2020
    },
    {
      "uniqueId": "UNIQUE ID",
      "title": "TITLE",
      "description": "DESCRIPTION",
      "year": 2020
    }
    // more books...
  ],
  "pageInfo": {
    "total": 2,
    "current": 1,
    "limit": 10,
    "count": 2
  }
}
```

### 책 상세

```
GET {{API_URL}}/v1/books/{bookUniqueId}
```

### 새 책 추가

```
POST {{API_URL}}/v1/books
```

### 책 수정

```
PUT {{API_URL}}/v1/books/{bookUniqueId}
```

### 책의 내 리뷰

```
GET {{API_URL}}/v1/books/{bookUniqueId}/review
```

### 책의 리뷰들

```
GET {{API_URL}}/v1/books/{bookUniqueId}/reviews
```

## 리뷰

### 새 책 별점 평가 생성

### 책 별점 평가 삭제

### 새 책 리뷰 생성

### 책 리뷰 목록

### 책 리뷰 수정

### 책 리뷰 삭제

## 사용자 책장

### 새 책장 생성

```
POST {{API_URL}}/v1/bookshelves
```

### 책장 리스트

```
GET {{API_URL}}/v1/bookshelves
```

### 책장 상세

```
GET {{API_URL}}/v1/bookshelves/{bookshelfId}
```

### 책장 이름 수정

```
PUT {{API_URL}}/v1/bookshelves/{bookshelfId}
```

### 책장 삭제

```
DELETE {{API_URL}}/v1/bookshelves/
```

### 책장에 책 추가

```
POST {{API_URL}}/v1/bookshelves/{bookshelfId}
```

### 책장에서 책 삭제

```
DELETE {{API_URL}}/v1/bookshelves/{bookshelfId}
```
