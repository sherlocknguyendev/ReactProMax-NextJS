
'use client'

import { useTrackContext } from '@/lib/track.wrapper';
import { useHasMounted } from '@/ultis/customHook';
import { Container } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import { useEffect, useRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const AppFooter = () => {
    const hasMounted = useHasMounted();

    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;
    const playerRef = useRef(null);


    useEffect(() => {
        if (playerRef?.current && currentTrack?.isPlaying === false) {
            //@ts-ignore
            playerRef?.current?.audio?.current?.pause();
        }
        if (playerRef?.current && currentTrack?.isPlaying === true) {
            //@ts-ignore
            playerRef?.current?.audio?.current?.play();
        }
    }, [currentTrack])


    if (!hasMounted) return (<></>)


    return (
        <div style={{ marginTop: 50 }}>
            <AppBar
                position='fixed' sx={{ top: 'auto', bottom: 0, marginTop: 8, backgroundColor: '#f2f2f2' }}
            >
                <Container sx={{
                    display: 'flex', gap: 10,
                    ".rhap_main": {
                        gap: '30px'
                    }
                }}>

                    <AudioPlayer
                        ref={playerRef}
                        layout='horizontal-reverse'
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${currentTrack.trackUrl}`}
                        volume={0.5}
                        style={{ boxShadow: 'none', height: 80, backgroundColor: '#f2f2f2' }}

                        onPause={() => {
                            setCurrentTrack({ ...currentTrack, isPlaying: false })
                        }}
                        onPlay={() => {
                            setCurrentTrack({ ...currentTrack, isPlaying: true })
                        }}
                    />

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'start',
                            justifyContent: 'center',
                            minWidth: 150
                        }}>
                        <div style={{ color: '#ccc' }}>{currentTrack.title}</div>
                        <div style={{ color: '#333' }}>{currentTrack.description}</div>
                    </div>
                </Container>
            </AppBar >
        </div>
    )
}

export default AppFooter