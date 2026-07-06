export const formatResponse = <T>(data: T) => {
  return {
    success: true,
    data
  }
}

export const formatPaginationResponse = <T>(
  data: T[],
  pageInfo: {
    pageNum: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
) => {
  return {
    success: true,
    data,
    pageInfo
  }
}

export const toPageInfo = (meta: { page: number; limit: number; total: number; totalPages: number }) => {
  return {
    pageNum: meta.page,
    pageSize: meta.limit,
    totalItems: meta.total,
    totalPages: meta.totalPages
  }
}
