export class AccessDeniedError extends Error {
  constructor() {
    super("Access Denied");
    this.name = "AccessDeniedError";
  }
}

export function requireAuth() {
  if (typeof window === "undefined") return; // SSR — skip, client will enforce
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new AccessDeniedError();
  }
}
