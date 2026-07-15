import arcjet, { detectBot, shield } from "@arcjet/next";
import {
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/*
 * Pages that require a signed-in Clerk user.
 *
 * Role-specific access is still handled by:
 * components/redirect.jsx
 *
 * This file only checks whether someone is authenticated.
 */
const isProtectedRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/explore(.*)",
  "/interviewers(.*)",
  "/appointments(.*)",
  "/dashboard(.*)",
  "/call(.*)",
]);

/*
 * External services must be able to reach webhook endpoints without
 * Clerk sign-in or Arcjet bot protection blocking them.
 */
const isWebhookRoute = createRouteMatcher([
  "/api/webhooks/clerk(.*)",
  "/api/webhooks/stream(.*)",
]);

const aj = arcjet({
  key: process.env.ARCJET_KEY,

  rules: [
    shield({
      mode: "LIVE",
    }),

    detectBot({
      mode: "LIVE",

      /*
       * Search engines and link-preview services may access the public
       * landing page, but ordinary automated traffic is blocked.
       */
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:PREVIEW",
      ],
    }),
  ],
});

export default clerkMiddleware(async (auth, req) => {
  /*
   * Skip Arcjet for trusted webhook endpoints.
   * Stream and Clerk send server-to-server webhook requests that may
   * otherwise look like automated traffic.
   */
  if (!isWebhookRoute(req)) {
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: "This request was blocked.",
        },
        {
          status: 403,
        }
      );
    }
  }

  /*
   * Webhooks do not require a signed-in browser user.
   */
  if (isWebhookRoute(req)) {
    return NextResponse.next();
  }

  const { userId, redirectToSignIn } = await auth();

  /*
   * Send signed-out users to Clerk sign-in when they try to access
   * protected AceIt pages.
   */
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Run the proxy on application pages while skipping static assets,
     * Next.js internals, images, fonts, and downloadable files.
     */
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    /*
     * Always run for API and tRPC routes.
     */
    "/(api|trpc)(.*)",
  ],
};