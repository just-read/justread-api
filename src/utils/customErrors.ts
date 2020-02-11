class AlreadyExistsError extends Error {
  status: number;

  constructor(message: string, status = 409) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AlreadyExistsError);
    }
    this.status = status;
  }
}

class NotFoundError extends Error {
  status: number;

  constructor(message: string, status = 404) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
    this.status = status;
  }
}

export { AlreadyExistsError, NotFoundError };
