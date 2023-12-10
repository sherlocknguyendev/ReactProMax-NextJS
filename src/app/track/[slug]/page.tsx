
'use client'

import WaveTrack from '@/components/track/wave.track';
import { Container } from '@mui/material';
import { useSearchParams } from 'next/navigation' // tương tự như query-string

const DetailTrackPage = (props: any) => {

    const { params } = props;
    const searchParams = useSearchParams()
    const audio = searchParams.get('audio') // lấy tham số truyền vào trên url 

    return (
        <Container>
            <WaveTrack />
        </Container>
    )
}

export default DetailTrackPage;