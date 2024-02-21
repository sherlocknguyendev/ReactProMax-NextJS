

import WaveTrack from '@/components/track/wave.track';
import { sendRequest } from '@/ultis/api';
import Container from '@mui/material/Container';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
    params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {

    const str1 = params?.slug?.split('.html');
    const str2 = str1[0]?.split('-');
    const id = str2[str2?.length - 1];

    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `http://localhost:8000/api/v1/tracks/${id}`,
        method: "GET",
    })

    return {
        title: res.data?.title,
        description: res.data?.description,
        openGraph: {
            title: 'Hỏi Dân IT',
            description: 'Beyond Your Coding Skills',
            type: 'website',
            images: [`https://raw.githubusercontent.com/hoidanit/images-hosting/master/eric.png`],
        }
    }
}


// --> SSG: only in build mode
// export function generateStaticParams() {
//     return [
//         // NextJS dựa vào các slug để tạo ra các file html tương ứng
//         { slug: 'song-cho-het-doi-thanh-xuan-65643d7431d18e99d0449141.html' },
//         { slug: 'sau-con-mua-65643d7431d18e99d044913e.html' },
//     ]
// }

const DetailTrackPage = async (props: any) => {

    const { params } = props;

    const str1 = params?.slug?.split('.html');
    const str2 = str1[0]?.split('-');
    const id = str2[str2?.length - 1];


    const track = await sendRequest<IBackendRes<ITrackTop>>({
        url: `http://localhost:8000/api/v1/tracks/${id}`,
        method: "GET",
        nextOption: {

            // 3 options:
            // cache: "no-store", // k lưu cache --> làm mới (re-build) dữ liệu liên tục
            // next: { revalidate: 10 } // set khoảng thời gian để làm mới (re-build) 
            // next: {tags: ['collection']} // làm mới (re-build) dữ liệu theo yêu cầu (tags tương tự id)

            next: { tags: ['track-by-id'] } // revalidateByTag
        }

    })

    const comments = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
        url: `http://localhost:8000/api/v1/tracks/comments`,
        method: "POST",
        queryParams: {
            current: 1,
            pageSize: 10,
            trackId: id,
            sort: '-createdAt'
        }
    })

    await new Promise(resolve => setTimeout(resolve, 3000)) // Chờ 3s để chạy file loading.tsx

    if (!track.data) {
        notFound()
    }


    return (
        <Container>
            <WaveTrack
                track={track?.data ?? null}
                comments={comments?.data?.result ?? null}
            />
        </Container>
    )
}

export default DetailTrackPage;