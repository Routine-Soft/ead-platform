import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const res = NextResponse.next();

    // headers extras de segurança
    res.headers.set('x-powered-by', 'Next.js');

    return res;
}

export const config = {
    matcher: ['/api/:path*'],
};