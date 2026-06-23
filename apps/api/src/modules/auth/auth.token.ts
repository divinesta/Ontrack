import { jwtVerify, SignJWT } from "jose";
import { env } from "../../config/env";


const secret = new TextEncoder().encode(env.JWT_SECRET);

export const signAccessToken = async (payload: { userId: string }) => {

   return new SignJWT(payload)
   .setProtectedHeader({ alg: "HS256" })
   .setIssuedAt()
   .setExpirationTime("7d")
   .sign(secret)
}

export const verifyAccessToken = async (token: string) => {
   const { payload } = await jwtVerify(token, secret);

   return {
      userId: String(payload.userId),
   }
}
