export function parsePagination(input: { page?: number; pageSize?: number }) {
  const page = input.page && input.page > 0 ? input.page : 1;
  const pageSize = input.pageSize && input.pageSize > 0 ? input.pageSize : 20;
  const skip = (page - 1) * pageSize;

  return { page, pageSize, skip };
}
