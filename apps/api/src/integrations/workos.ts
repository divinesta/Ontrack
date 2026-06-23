import { WorkOS } from "@workos-inc/node";
import { workosConfig } from "./integration.config";

const workos = new WorkOS(workosConfig.apiKey, {
   clientId: workosConfig.clientId,
});

export const getAuthUrl = () => {
   return workos.userManagement.getAuthorizationUrl({
      provider: "authkit",
      clientId: workosConfig.clientId,
      redirectUri: workosConfig.redirectUri,
   });
};

export const authenticateWithCode = (code: string) => {
   return workos.userManagement.authenticateWithCode({
      code,
      clientId: workosConfig.clientId,
   })
};
