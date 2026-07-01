declare global {
  namespace Express {
    interface ValidatedRequestData {
      body?: unknown
      params?: unknown
      query?: unknown
    }

    interface Request {
      validated?: ValidatedRequestData
    }
  }
}

export {}
