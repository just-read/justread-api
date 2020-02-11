class AlreadyExistsError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AlreadyExistsError);
    }
    this.status = status;
  }
}

export { AlreadyExistsError };
