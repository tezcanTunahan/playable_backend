class CustomError extends Error {
  code: number;
  timestamp?: EpochTimeStamp;
  path?: string;
  exception?: string;
  subCode?: string;

  constructor(
    code: number,
    message?: string,
    timestamp?: EpochTimeStamp,
    path?: string,
    exception?: string,
    subCode?: string
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.code = code;
    this.timestamp = timestamp;
    this.path = path;
    this.exception = exception;
    this.subCode = subCode;
  }
}

export default CustomError;
