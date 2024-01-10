

import WaveTrack from '@/components/track/wave.track';
import { sendRequest } from '@/ultis/api';
import { Container } from '@mui/material';

const DetailTrackPage = async (props: any) => {

    const { params } = props;

    const track = await sendRequest<IBackendRes<ITrackTop>>({
        url: `http://localhost:8000/api/v1/tracks/${params.slug}`,
        method: "GET",
        nextOption: { cache: 'no-store' } // K dùng cơ chết caching data của Next nữa
    })

    const comments = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
        url: `http://localhost:8000/api/v1/tracks/comments`,
        method: "POST",
        queryParams: {
            current: 1,
            pageSize: 10,
            trackId: params.slug,
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