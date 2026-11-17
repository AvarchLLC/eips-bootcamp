import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { prisma } from "./prisma";
import { sendEmail } from "./email";

// Hard-code the canonical production URL here so Better-Auth's internal
// BETTER_AUTH_URL env reader never picks up the apex domain or a preview URL
// that would be 308-redirected by Vercel's edge before Google's callback lands.
const PRODUCTION_URL = "https://www.ethshala.com";

const getBaseURL = (): string => {
  // In production always use the www canonical domain
  if ((process.env.NODE_ENV as string) === "production") {
    return PRODUCTION_URL;
  }
  // Local or preview environments
  const url = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (url && typeof url === "string") {
    return url.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};

export const auth = betterAuth({
  baseURL: getBaseURL(),
  secret: process.env.BETTER_AUTH_SECRET || "zas2ch3BUrXV5XTQ64BVhXc2bctAKers",
  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://192.168.1.3:3000',
    'http://192.168.1.5:3000',
    'http://192.168.0.104:3000',
    'https://www.ethshala.com',
    'https://ethshala.com',
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`] : []),
  ],

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "STUDENT",
      },
    }
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
      requireLocalEmailVerified: false,
    },
    storeStateStrategy: "cookie",
    skipStateCookieCheck: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await sendEmail({
          to: email,
          subject: "Your verification code",
          html: `<p>Your verification code is: <strong>${otp}</strong></p>`,
        });
      },
    }),
  ],
  advanced: {
    crossSubDomainCookies: {
      // In production share cookies across ethshala.com and www.ethshala.com
      enabled: (process.env.NODE_ENV as string) === "production",
      domain: "ethshala.com",
    },
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: (process.env.NODE_ENV as string) === "production",
    },
  },
  onAPIError: {
    errorURL: "/sign-in",
    onError: (error) => {
      console.error("[Better Auth API Error]:", (error as any)?.message || error);
    }
  },
  logger: {
    level: "debug",
    disabled: false,
  }
});
