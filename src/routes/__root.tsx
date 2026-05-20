import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

import appCss from "../styles.css?url";

// ── Custom Branded 404 Component ──
function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-dark px-6 text-white selection:bg-yellow selection:text-brand-dark">
      <div className="max-w-md text-center border border-white/10 bg-brand-deep/30 rounded-xl p-8 backdrop-blur-sm shadow-xl">
        <h1 className="text-7xl font-display font-light text-yellow">404</h1>
        <h2 className="mt-4 text-xl font-semibold tracking-wide uppercase text-white">Resource Not Found</h2>
        <p className="mt-2 text-sm text-white/60 leading-relaxed">
          The requested LMS course route, dashboard workspace, or training asset page does not exist or has been relocated.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded bg-yellow px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-brand-dark transition hover:bg-yellow/90 shadow-md"
          >
            <Home className="h-3.5 w-3.5" /> Return to Landing
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Custom Branded Crash/Error Boundary Exception Component ──
function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-dark px-6 text-white selection:bg-yellow selection:text-brand-dark">
      <div className="max-w-md text-center border border-red-cta/20 bg-brand-deep/30 rounded-xl p-8 backdrop-blur-sm shadow-xl">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-red-cta/10 text-red-cta">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-semibold tracking-wide uppercase text-white">
          System Execution Interrupted
        </h1>
        <p className="mt-2 text-sm text-white/60 leading-relaxed">
          An error occurred while loading this platform node. This may be due to an active network sync fallback period.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center gap-2 rounded bg-yellow px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-brand-dark transition hover:bg-yellow/90 shadow-md"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Re-verify Route
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded border border-white/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:border-yellow hover:text-yellow"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Extended Meta Shell Registration ──
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ECG Training Center — Learning Management System" },
      { name: "description", content: "The official Electricity Company of Ghana Training Center LMS Portal v2.0." },
      { name: "author", content: "ECG Technical Services Team" },
      { property: "og:title", content: "ECG Training Center — Learning Management System" },
      { property: "og:description", content: "Centralized industrial e-learning, interactive evaluations, and automated credential verification." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}