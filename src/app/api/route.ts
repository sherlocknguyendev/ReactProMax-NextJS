
// Đây được coi là Next phía server

export async function GET(request: Request) {

    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const trackName = searchParams.get('audio')

    return await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${trackName}`) // server gọi tới database để lấy data

} 