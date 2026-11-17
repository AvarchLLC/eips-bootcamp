import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { prisma } from "./prisma";
import { sendEmail } from "./email";

const getBaseURL = () => {
  let url = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL;

  // In production, always enforce the canonical domain https://www.ethshala.com
  // to avoid Vercel edge 308 redirects that drop OAuth authorization codes and state cookies.
  if (process.env.NODE_ENV === "production") {
    if (url && !url.includes("ethshala.com") && !url.includes("localhost")) {
      return url.replace(/\/$/, "");
    }
    return "https://www.ethshala.com";
  }

  // Preview or development environments
  if (url) {
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
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
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
      async sendVerificationOTP({ email, otp, type }) {
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
      enabled: process.env.NODE_ENV === "production" && !process.env.BETTER_AUTH_URL?.includes("localhost"),
      domain: ".ethshala.com",
    },
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production" && !process.env.BETTER_AUTH_URL?.includes("localhost"),
    },
  },
  onAPIError: {
    errorURL: "/sign-in",
    onError: (error) => {
      console.error("[Better Auth API Error]:", error);
    }
  },
  logger: {
    level: "debug",
    disabled: false,
  }
});
