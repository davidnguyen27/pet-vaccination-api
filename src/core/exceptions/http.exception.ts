export class HttpException extends Error {
  public status: number
  public errors?: unknown

  constructor(status: number, message: string, errors?: unknown) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

export default HttpException
