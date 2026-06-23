import type { RequestHandler } from "express";
import { success } from "../../common/utils/response";
import { authService } from "./auth.service";

export const getAuthHealth: RequestHandler = (_req, res) => {
   return success(res, { module: "auth" }, "Auth module is ready");
};

export const startLogin: RequestHandler = (_req, res) => {
	const url = authService.getLoginUrl();

	return res.redirect(url);
};

export const handleCallback: RequestHandler = async (req, res) => {
	const { code } = req.validated.query as { code: string };

	const result = await authService.handleCallback(code);

	return success(res, result, "Signed in successfully");
}