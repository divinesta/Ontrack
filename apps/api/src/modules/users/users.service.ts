import prisma from "../../config/database";


export const usersService = {
   getCurrentUser: (userId: string) => {
      return prisma.users.findUnique({
         where: { id: userId },
      });
   },
};
