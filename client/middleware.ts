import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/login',
  '/api/webhook(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  console.log(`[Auth Middleware] Procesando ruta: ${req.nextUrl.pathname}`)
  
  if (!isPublicRoute(req)) {
    console.log(`[Auth Middleware] Ruta protegida detectada: ${req.nextUrl.pathname}`)
    await auth.protect()
  } else {
    console.log(`[Auth Middleware] Ruta pública: ${req.nextUrl.pathname}`)
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}