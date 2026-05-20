export type PaginationInput = {
   page?: number;
   limit?: number;
};

export type PaginationMeta = {
   page: number;
   limit: number;
   total: number;
   totalPages: number;
   hasNextPage: boolean;
   hasPrevPage: boolean;
};

export const getPagination = ({ page = 1, limit = 20 }: PaginationInput) => {
   const safePage = Math.max(1, page);
   const safeLimit = Math.min(Math.max(1, limit), 100);

   return {
      page: safePage,
      limit: safeLimit,
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
   };
};

export const getPaginationMeta = (total: number, page: number, limit: number): PaginationMeta => {
   const totalPages = Math.ceil(total / limit);

   return {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
   };
};
