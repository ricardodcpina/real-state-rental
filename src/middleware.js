import { NextResponse } from 'next/server';

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get('user_token')?.value;

  if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/estate'))) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|logo|$|login|estate).*)',
    '/estate/:estate_id*/reserve(.*)',
  ],
};
