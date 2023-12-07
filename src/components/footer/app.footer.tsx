
'use client'

import { useHasMounted } from '@/ultis/customHook';
import { Container } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const AppFooter = () => {

    const hasMounted = useHasMounted();

    if (!hasMounted) return (<></>)

    return (
        <AppBar
            position='fixed' sx={{ top: 'auto', bottom: 0, marginTop: 8, backgroundColor: '#f2f2f2' }}
        >
            <Container sx={{ display: 'flex', gap: 10 }}>
                <AudioPlayer
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/hoidanit.mp3`}
                    volume={0.5}
                    style={{ boxShadow: 'none', height: 80, backgroundColor: '#f2f2f2' }}

                // other props here
                />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'start',
                        justifyContent: 'center',
                        minWidth: 150
                    }}>
                    <div style={{ color: '#ccc' }}>Author: VanQuoc</div>
                    <div style={{ color: '#333' }}>Song: Never Give Up</div>
                </div>
            </Container>
        </AppBar >
    )
}

export default AppFooter