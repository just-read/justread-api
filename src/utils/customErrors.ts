class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

class AlreadyExistsError extends CustomError {
  constructor(message: string, status = 409) {
    super(message, status);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AlreadyExistsError);
    }
  }
}

class NotFoundError extends CustomError {
  constructor(message = '일치하는 정보를 찾을 수 없습니다.', status = 404) {
    super(message, status);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
  }
}

class InvalidParamError extends CustomError {
  constructor(message: string, status = 400) {
    super(message, status);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidParamError);
    }
  }
}

class IncorrectLoginRequestError extends CustomError {
  constructor(message = '입력하신 정보가 올바르지 않습니다.', status = 401) {
    super(message, status);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidParamError);
    }
  }
}

class UnauthorizedError extends CustomError {
  constructor(message = '인증 정보가 존재하지 않습니다.', status = 401) {
    super(message, status);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidParamError);
    }
  }
}

export {
  AlreadyExistsError,
  NotFoundError,
  InvalidParamError,
  IncorrectLoginRequestError,
  UnauthorizedError
};
