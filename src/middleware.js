import { NextResponse } from 'next/server';
import { getSession } from './app/lib/sessionActions';

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  const session = await getSession();

  if (!session && (pathname.startsWith('/dashboard') || pathname.startsWith('/estate'))) {
    const url = new URL('/login', req.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|logo|$|login|estate).*)',
    '/estate/:estate_id*/reserve(.*)',
  ],
};
