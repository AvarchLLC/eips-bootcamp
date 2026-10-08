import { auth } from "../../../lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import fs from "fs";
import path from "path";

const handler = toNextJsHandler(auth);

function logErrorToFile(prefix: string, error: any) {
  try {
    const filePath = "/Users/subhrajeetbhattacharjeee/Downloads/eips-bootcamp/auth-error.log";
    const msg = `${prefix}: ${error?.stack || error}\n`;
    fs.appendFileSync(filePath, msg);
    console.error(prefix, error);
  } catch(e) {}
}

export const GET = async (req: any) => {
  try {
    const res = await handler.GET(req);
    if (res && res.status >= 500) {
      logErrorToFile("Better Auth returned 500 error in GET handler", res.status);
    }
    return res;
  } catch (error) {
    logErrorToFile("CRITICAL AUTH ERROR (GET)", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const POST = async (req: any) => {
  try {
    const res = await handler.POST(req);
    if (res && res.status >= 500) {
      logErrorToFile("Better Auth returned 500 error in POST handler", res.status);
    }
    return res;
  } catch (error) {
    logErrorToFile("CRITICAL AUTH ERROR (POST)", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
