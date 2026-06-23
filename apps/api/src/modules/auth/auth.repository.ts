import prisma from "../../config/database";
import type { WorkosUser } from "./auth.service";


const getDisplayName = (user: WorkosUser): string | null => {
   const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();

   return name.length > 0 ? name : null;
};

export const findOrCreateUserFromIdentity = async (workosUser: WorkosUser) => {
   return prisma.$transaction(async (tx) => {
      const existingAcount = await tx.auth_accounts.findUnique({
         where: {
            provider_provider_account_id: {
               provider: "google",
               provider_account_id: workosUser.id,
            },
         },
         include: {
            user: true,
         },
      });

      if (existingAcount) {
         return existingAcount.user;
      }

      const user = await tx.users.upsert({
         where: {
            email: workosUser.email,
         },
         update: {
            display_name: getDisplayName(workosUser),
            photo_url: workosUser.profilePictureUrl ?? null,
         },
         create: {
            email: workosUser.email,
            display_name: getDisplayName(workosUser),
            photo_url: workosUser.profilePictureUrl ?? null,
            created_at: new Date(),
         },
      });

      await tx.auth_accounts.create({
         data: {
            user_id: user.id,
            provider: "google",
            provider_account_id: workosUser.id,
            email: workosUser.email,
         },
      });

      return user;
   });
};
