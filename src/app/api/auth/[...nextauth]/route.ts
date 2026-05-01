import NextAuth from "next-auth";
import { authOptions } from "./options";
import { NextRequest } from "next/server";

const handler = async (req: NextRequest, ctx: any) => {
    if (process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_URL) {
        const proto = req.headers.get("x-forwarded-proto") || "https";
        const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
        if (host) {
            process.env.NEXTAUTH_URL = `${proto}://${host}`;
        }
    }

    return NextAuth(req, ctx, authOptions);
};

export { handler as GET, handler as POST };