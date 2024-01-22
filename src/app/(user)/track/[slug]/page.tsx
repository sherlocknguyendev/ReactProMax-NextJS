

import WaveTrack from '@/components/track/wave.track';
import { sendRequest } from '@/ultis/api';
import Container from '@mui/material/Container';

import type { Metadata } from 'next'

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


const DetailTrackPage = async (props: any) => {

    const { params } = props;

    const str1 = params?.slug?.split('.html');
    const str2 = str1[0]?.split('-');
    const id = str2[str2?.length - 1];


    const track = await sendRequest<IBackendRes<ITrackTop>>({
        url: `http://localhost:8000/api/v1/tracks/${id}`,
        method: "GET",
        nextOption: { cache: 'no-store' } // K dùng cơ chế caching data của Next nữa
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