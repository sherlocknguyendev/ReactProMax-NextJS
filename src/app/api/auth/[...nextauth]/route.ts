
import { sendRequest } from "@/ultis/api";
import NextAuth, { NextAuthOptions } from "next-auth"
import { JWT } from "next-auth/jwt";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions: NextAuthOptions = {

    // pages: {
    //     signIn: '/auth/signin' --> modify signin mặc định của next auth
    // },

    secret: process.env.NO_SECRET,
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
                    url: "http://localhost:8000/api/v1/auth/login",
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
    ],

    //callbacks: để handle sự kiện "sau khi login" thành công từ Provider
    callbacks: {

        // This callback (jwt) is called whenever a JSON Web Token is created (i.e. at sign in)
        // * or updated (i.e whenever a session is accessed in the client).
        // * Its content is forwarded to the `session` callback,
        async jwt({ token, account, trigger, user, profile }) {

            if (trigger === 'signIn' && account?.provider !== "credentials") {
                const res = await sendRequest<IBackendRes<JWT>>({
                    url: "http://localhost:8000/api/v1/auth/social-media",
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
                    token.user = res.data.user
                }
            }

            if (trigger === 'signIn' && account?.provider === "credentials") {
                //@ts-ignore
                token.access_token = user.access_token;
                //@ts-ignore
                token.refresh_token = user.refresh_token;
                //@ts-ignore
                token.user = user.user
            }

            return token; // token này là lưu vào cookies ở client
        },

        //callback sesstion: được gọi khi sử dụng session
        session({ session, token, user }) {
            if (token) {
                //token này sẽ được giải mã và gán vào session (mỗi khi đc client gọi để lấy thông tin)
                session.access_token = token.access_token;
                session.refresh_token = token.refresh_token;
                session.user = token.user
            }
            return session // session là thông tin đc lưu ở server
        }

    }

};

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }