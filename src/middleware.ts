import {type NextRequest } from "next/server";
import {updateSession} from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest)
{
  return await updateSession(request);
}

export const config = 
{
  matcher : ["/editprofile:path*", "/profile", "/recommendationlists:path*", "/signin", "/admin/:path*", "/createprofile:path*"] //paths that require the user to be authed
}