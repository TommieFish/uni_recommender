import { NextRequest, NextResponse } from "next/server";
import { CookieMethodsServer, createServerClient } from "@supabase/ssr";

export async function updateSession(request: NextRequest)
{
  let supabaseResponse = NextResponse.next({request,});

  function nextMiddlewareCookies(req: NextRequest, res: NextResponse) : CookieMethodsServer
  {
    return {
      getAll()
      {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet)
      {
        cookiesToSet.forEach((cookie) => {
          req.cookies.set(cookie.name, cookie.value);
          res.cookies.set(cookie.name, cookie.value, cookie.options);
        })
      },
    }
  }

  //create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: nextMiddlewareCookies(request, supabaseResponse),
    }
  )

  async function getUserRole(userId: string) : Promise<string | null>
  {
    const { data, error } = await supabase
      .from('students')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error || !data) return null;
    return data.role;
  }


  //get current user:
  const {data: {user}} = await supabase.auth.getUser();

  //redirects for unauthed user (to sign in)
  if(!user && !request.nextUrl.pathname.startsWith("/auth/signin") && !request.nextUrl.pathname.startsWith("/auth"))
  {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/signin"
    url.searchParams.set("next", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }
 
  //redirects for authed user (attempting to access sign in)
  if(!user && !request.nextUrl.pathname.startsWith("/signin"))
  {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  const role = await getUserRole(user!.id);

  // Redirect non-admin users trying to access admin pages to the home page
  if(user && role !== "admin" && request.nextUrl.pathname.startsWith("/admin"))
  {
    const url = request.nextUrl.clone();
    url.pathname="/";
    console.log("Non-admin user attempted to access admin page:", user.id, role)
    return NextResponse.redirect(url);
  }
 
  return supabaseResponse;
}