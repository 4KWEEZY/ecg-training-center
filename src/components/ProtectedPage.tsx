import React, { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldOff } from "lucide-react";

function AccessDeniedView() {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthProtected(props: P) {
    return (
      <ProtectedPage>
        <Component {...(props as any)} />
      </ProtectedPage>
    );
  };
}

export function ProtectedPage({ children }: { children: React.ReactNode }) {
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      setDenied(true);
    }
  }, []);

  if (denied) return <AccessDeniedView />;
  return <>{children}</>;
}
