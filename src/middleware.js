// import { NextResponse } from 'next/server';
// import { getSession } from './app/lib/sessionActions';

// export async function middleware(req) {
//   const pathname = req.nextUrl.pathname;
//   const isProtectedRoute =
//     pathname.startsWith('/dashboard') || pathname.match(/\/estate\/.*\/reserve\/.*/);

//   console.log('middleware running on: ' + pathname);

//   const session = await getSession();

//   if (!session && isProtectedRoute) {
//     console.log('redirecting to login');
//     const url = new URL('/login', req.url);
//     url.searchParams.set('callbackUrl', pathname);
//     return NextResponse.redirect(url);
//   }

//   console.log('normal redirect');
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|logo|$|login).*)'],
// };

import { NextResponse } from 'next/server';
import { getSession } from './app/lib/sessionActions';

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  console.log('middleware running on: ' + pathname);

  const session = await getSession();

  if (!session && (pathname.startsWith('/dashboard') || pathname.startsWith('/estate'))) {
    console.log('redirecting to login');
    const url = new URL('/login', req.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  console.log('normal redirect');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|logo|$|login|estate).*)',
    '/estate/:estate_id*/reserve(.*)',
  ],
};

console.log('test')