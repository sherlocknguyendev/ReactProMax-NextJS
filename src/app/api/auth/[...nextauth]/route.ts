
import { sendRequest } from "@/ultis/api";
import NextAuth, { NextAuthOptions } from "next-auth"
import { JWT } from "next-auth/jwt";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import dayjs from "dayjs";


async function refreshAccessToken(token: JWT) {

    const res = await sendRequest<IBackendRes<JWT>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/refresh`,
        method: "POST",
        body: { refresh_token: token?.refresh_token }
    })

    if (res.data) {
        console.log(">>> check old token: ", token.access_token);
        console.log(">>> check new token: ", res.data?.access_token)

        return {
            ...token,
            access_token: res.data?.access_token ?? "",
            refresh_token: res.data?.refresh_token ?? "",
            access_expire: dayjs(new Date()).add(
                +(process.env.TOKEN_EXPIRE_NUMBER as string), (process.env.TOKEN_EXPIRE_UNIT as any)
            ).unix(),
            error: ""
        }
    } else {
        //failed to refresh token => do nothing
        return {
            ...token,
            error: "RefreshAccessTokenError", // This is used in the front-end, and if present, we can force a re-login, or similar
        }
    }

}

export const authOptions: NextAuthOptions = {

    // pages: {
    //     signIn: '/auth/signin' --> modify signin mặc định của next auth
    // },

    secret: process.env.NEXTAUTH_SECRET,

    //Khi ng dùng vào trùng các đường link url bên middleware thì sẽ bị đá về trang signin
    pages: {
        signIn: "/auth/signin"
    },

    // https://next-auth.js.org/configuration/providers/oauth

    providers: [
        CredentialsProvider({
            name: "Credentials",

            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                const res = await sendRequest<IBackendRes<JWT>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
                    method: "POST",
                    body: {
                        username: credentials?.username,
                        password: credentials?.password
                    },
                })

                if (res && res.data) {
                    // Any object returned will be saved in `user` property of the JWT
                    return res.data as any;
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    throw new Error(res?.message as string)

                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            }
        }),

        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        })
    ],

    //callbacks: để handle sự kiện "sau khi login" thành công từ Provider
    callbacks: {

        // This callback (jwt) is called whenever a JSON Web Token is created (i.e. at sign in)
        // * or updated (i.e whenever a session is accessed in the client).
        // * Its content is forwarded to the `session` callback,
        async jwt({ token, account, trigger, user, profile }) {

            if (trigger === 'signIn' && account?.provider !== "credentials") {
                const res = await sendRequest<IBackendRes<JWT>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/social-media`,
                    method: "POST",
                    body: {
                        type: account?.provider?.toLocaleUpperCase(),
                        username: user.email
                    },
                })

                if (res.data) {
                    //gán thêm thông tin vào token
                    token.access_token = res.data.access_token;
                    token.refresh_token = res.data.refresh_token;
                    token.user = res.data.user;
                    token.access_expire = dayjs(new Date()).add(
                        +(process.env.TOKEN_EXPIRE_NUMBER as string), (process.env.TOKEN_EXPIRE_UNIT as any)
                    ).unix();
                }
            }

            if (trigger === 'signIn' && account?.provider === "credentials") {
                //@ts-ignore
                token.access_token = user.access_token;
                //@ts-ignore
                token.refresh_token = user.refresh_token;
                //@ts-ignore
                token.user = user.user
                //@ts-ignore
                token.access_expire = dayjs(new Date()).add(
                    +(process.env.TOKEN_EXPIRE_NUMBER as string), (process.env.TOKEN_EXPIRE_UNIT as any)

                ).unix();
            }

            // Kiểm tra xem access_token cũ hết hạn so với thời gian hiện tại hay chưa
            const isTimeAfter = dayjs(dayjs(new Date())).isAfter(dayjs.unix((token?.access_expire as number ?? 0)));

            if (isTimeAfter) {
                return refreshAccessToken(token)
            }

            return token; // token này là lưu vào cookies ở client
        },

        //callback sesstion: được gọi khi sử dụng session
        session({ session, token, user }) {
            if (token) {
                //token này sẽ được giải mã và gán vào session (mỗi khi đc client gọi để lấy thông tin)
                session.access_token = token.access_token;
                session.refresh_token = token.refresh_token;
                session.user = token.user;
                session.access_expire = token.access_expire;
                session.error = token.error
            }
            return session // session là thông tin đc lưu ở server
        }

    }

};

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }