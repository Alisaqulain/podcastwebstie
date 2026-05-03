import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const p = req.nextUrl.pathname;
      if (p === "/admin/login" || p.startsWith("/admin/login/")) {
        return true;
      }
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
