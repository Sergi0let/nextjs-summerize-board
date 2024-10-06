import { getUserMeLoader } from "@/data/services/get-user-me-loader";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const user = await getUserMeLoader();
  const currentPath = request.nextUrl.pathname;

  console.log("##################### middleware ##############");
  console.log(user);
  console.log(currentPath);
  console.log("##################### middleware ##############");

  if (currentPath.startsWith("/dashboard") && user.ok === false) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}
