import { env } from '../config/env';

export const workosConfig = {
   apiKey: env.WORKOS_API_KEY,
   clientId: env.WORKOS_CLIENT_ID,
   redirectUri: env.WORKOS_REDIRECT_URI,
   cookiePassword: env.WORKOS_COOKIE_PASSWORD,
}

export const infobipConfig = {
   baseUrl: env.INFOBIP_BASE_URL,
   apiKey: env.INFOBIP_API_KEY,
   fromEmail: env.INFOBIP_FROM_EMAIL
}

export const onesignalConfig = {
   appId: env.ONESIGNAL_APP_ID,
   restApiKey: env.ONESIGNAL_REST_API_KEY
}
