import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''

  // Redirect shop.vcelarstvi-bubenik.cz to www.vcelarstvi-bubenik.cz
  if (hostname === 'shop.vcelarstvi-bubenik.cz') {
    const url = request.nextUrl.clone()
    url.protocol = request.headers.get('x-forwarded-proto') || 'https'
    url.host = 'www.vcelarstvi-bubenik.cz'
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

// Run middleware on all paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
