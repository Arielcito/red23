import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/api/webhook(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  console.log(`[Auth Middleware] Procesando ruta: ${req.nextUrl.pathname}`)
  const session = await auth()

  if (!session.userId && !isPublicRoute(req)) {
    console.log('[Auth Middleware] Usuario no autenticado, redirigiendo a /login')
    const loginUrl = new URL('/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  if (!isPublicRoute(req)) {
    console.log(`[Auth Middleware] Ruta protegida detectada: ${req.nextUrl.pathname}`)
    await auth.protect()
  } else {
    console.log(`[Auth Middleware] Ruta pública: ${req.nextUrl.pathname}`)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
