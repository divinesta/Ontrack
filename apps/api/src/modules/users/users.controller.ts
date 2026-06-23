import type { RequestHandler } from "express";
import { success } from "../../common/utils/response";
import { usersService } from "./users.service";
import { ErrorCodes } from "../../common/errors/errorCodes";
import { NotFoundError, UnauthorizedError } from "../../common/errors/AppError";

export const getUsersHealth: RequestHandler = (_req, res) => {
   return success(res, { module: "users" }, "Users module is ready");
};

export const getCurrentuser: RequestHandler = async (req, res) => {

	const userId = req.user!.id;

	if (!req.user) {
      throw new UnauthorizedError("Authentication required", ErrorCodes.AUTH_UNAUTHORIZED);
   }

	const user = await usersService.getCurrentUser(userId);

	if (!user) {
      throw new NotFoundError("User not found", ErrorCodes.RESOURCE_NOT_FOUND);
   }

	return success(res, user, "Current user retrieved successfully");
};
