import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { AlertTriangle, Home, RefreshCw, ShieldOff } from "lucide-react";
import { AccessDeniedError } from "../lib/auth";
import appCss from "../styles.css?url";

// ── Custom Branded 404 Component ──
function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-indigo-950">
      <div className="max-w-md text-center border border-slate-200 bg-white rounded-xl p-8 shadow-sm">
        <h1 className="text-7xl font-light text-indigo-700">404</h1>
        <h2 className="mt-4 text-xl font-semibold uppercase tracking-wide">Resource Not Found</h2>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          The requested page does not exist or has been relocated.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded bg-indigo-700 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-indigo-800 shadow-md"
          >
            <Home className="h-3.5 w-3.5" /> Return to Landing
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Custom Branded Error Component ──
function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  if (error instanceof AccessDeniedError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f2fb] px-6">
        <div className="w-full max-w-sm rounded-2xl border border-[#DDDDF0] bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE2E2]">
            <ShieldOff className="h-7 w-7 text-[#E8534A]" />
          </div>
          <h1 className="text-[20px] font-bold text-[#1A1C5C]">Access Denied</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-[#8B8DAE]">
            You must be logged in to view this page. Please sign in to continue.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#3B3DA6] px-5 py-3 text-[13px] font-bold text-white transition hover:bg-[#2D2F9A]"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-indigo-950">
      <div className="max-w-md text-center border border-red-200 bg-white rounded-xl p-8 shadow-sm">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-semibold uppercase tracking-wide">System Interrupted</h1>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          An error occurred while loading this platform node.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center gap-2 rounded bg-indigo-700 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-indigo-800 shadow-md"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Re-verify
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Route Definition ──
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ECG Training Center — Learning Management System" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
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
      {/* This div ensures your app has a global background and base font 
        consistent with your dashboard/landing page styles.
      */}
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Outlet />
      </div>
    </QueryClientProvider>
  );
}