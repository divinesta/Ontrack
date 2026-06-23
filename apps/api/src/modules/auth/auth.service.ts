import { authenticateWithCode, getAuthUrl } from "../../integrations/workos";
import { findOrCreateUserFromIdentity } from "./auth.repository";
import { signAccessToken } from "./auth.token";

export type WorkosUser = {
	id: string;
	email: string;
	firstName?: string | null;
	lastName?: string | null;
	profilePictureUrl?: string | null;
};

export const authService = {
   getLoginUrl: () => getAuthUrl(),

   handleCallback: async (code: string) => {
      const authResult = await authenticateWithCode(code);
		const workosUser = authResult.user as WorkosUser;

      const user = await findOrCreateUserFromIdentity(workosUser);

      const accessToken = await signAccessToken({ userId: user.id });

      return { user, accessToken };
   },
};
