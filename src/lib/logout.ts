const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function logout(navigate: (opts: any) => void) {
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  if (accessToken && refreshToken) {
    try {
      await fetch(`${API_BASE_URL}/api/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
    } catch {
      // network error — still clear local state and redirect
    }
  }

  localStorage.removeItem("user");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  navigate({ to: "/login" });
}
