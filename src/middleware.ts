import { NextResponse, type NextRequest } from 'next/server'
import { getUser } from './auth/server';
import { createClient } from './auth/server';
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const supabase = await createClient();

  // Routes that do not require authentication
  const PUBLIC_PATHS = ['/', '/login', '/auth', '/api', '/_next', '/sign-up', '/email-verify-done'];

  const isPublicPath = PUBLIC_PATHS.some((path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  });



  console.log('isPublicPath', isPublicPath);
  // Get current user
  const user = await getUser();

  // If user is not logged in and accessing a protected route → redirect
  if (!user && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is logged in and tries to access login page → redirect to dashboard/home
  if (user && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (user) {


    const { data: userDetails } = await supabase.from('UserDet').select('lastStep').eq('uid', user.id).single();
    console.log('userDetails', userDetails);
    const lastStep = userDetails?.lastStep;

    const isProfileIncomplete = lastStep !== 'bankVerification';


         if (!isProfileIncomplete && pathname.startsWith('/user-onboarding')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }


      // INTERNS WORK DONE TASK GIVE ON 31 JULY
      
    console.log(lastStep === 'sellerDetails');
    if (isProfileIncomplete && pathname !== "/user-onboarding") {
      if (lastStep === null) {
        return NextResponse.redirect(new URL("/user-onboarding", request.url));
      }
      else if (lastStep === 'sellerDetails') {
        return NextResponse.redirect(new URL("/user-onboarding?step=1", request.url));
      }
      else if (lastStep === 'document') {

        return NextResponse.redirect(new URL("/user-onboarding?step=2", request.url));
      } else if (lastStep === 'pickup') {

        return NextResponse.redirect(new URL("/user-onboarding?step=3", request.url));
      } else if (lastStep === 'bank') {

        return NextResponse.redirect(new URL("/user-onboarding?step=4", request.url));
      }


 


      // return NextResponse.redirect(new URL("/user-onboarding", request.url));
    }


  }



  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}




export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  //   const supabase = createServerClient(
  //     process.env.SUPABASE_URL!,
  //     process.env.SUPABASE_ANON_KEY!,
  //     {
  //       cookies: {
  //         getAll() {
  //           return request.cookies.getAll()
  //         },
  //         setAll(cookiesToSet) {
  //           cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
  //           supabaseResponse = NextResponse.next({
  //             request,
  //           })
  //           cookiesToSet.forEach(({ name, value, options }) =>
  //             supabaseResponse.cookies.set(name, value, options)
  //           )
  //         },
  //       },
  //     }
  //   )



  //   const {
  //     data: { user },
  //   } = await supabase.auth.getUser()


  return supabaseResponse
}