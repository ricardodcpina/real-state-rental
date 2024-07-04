import { NextResponse } from 'next/server';

export async function middleware(req) {
    const pathname = req.nextUrl.pathname;
    const token = req.cookies.get('user_token')?.value;

    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    if (!token && pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

const publicRoutes = ['/', '/login'];

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
