
export { default } from "next-auth/middleware"

// Nếu người dùng chưa signin mà vào các đường url bên dưới thì sẽ bị đá về trang signin
// -> config tại 'pages' trong file route.ts ở [...nextauth]
export const config = { matcher: ["/playlist", "/track/upload", "/like"] }