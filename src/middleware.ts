import { auth } from '@/auth'

/**
 * @link https://authjs.dev/getting-started/session-management/protecting?framework=express#nextjs-middleware
 */
export default auth((req) => {
  const isAuthenticated = !!req.auth
  const isPrivatePage =
    req.nextUrl.pathname === '/my-account' ||
    req.nextUrl.pathname === '/change-password'
  const isLoginPage =
    req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register'

  if (!isAuthenticated && isPrivatePage) {
    const newUrl = new URL('/login', req.nextUrl.origin)
    return Response.redirect(newUrl)
  }

  if (isAuthenticated && isLoginPage) {
    const newUrl = new URL('/my-account', req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
