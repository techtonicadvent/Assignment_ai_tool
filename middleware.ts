import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {},
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Protect only these routes
export const config = {
  matcher: ["/chat/:path*", "/api/chats/:path*"],
};
