
'use client'

import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { useTheme } from '@mui/material/styles';
import { Box, Card, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import { useTrackContext } from '@/lib/track.wrapper';
import Link from 'next/link';


const ProfileListTracks = (props: any | ITrackTop) => {

    const { data } = props;

    const theme = useTheme();

    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

    return (
        <Card sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Link
                        style={{
                            textDecoration: 'none',
                            color: 'unset'
                        }}
                        href={`/track/${data._id}?audio=${data.trackUrl}&id=${data._id}`}
                    >
                        <Typography component="div" variant="h5">
                            {data.title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            {data.description}
                        </Typography>
                    </Link>

                </CardContent>

                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>

                    <IconButton aria-label="previous">
                        {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
                    </IconButton>

                    {
                        (data._id !== currentTrack._id ||
                            data._id === currentTrack._id && currentTrack.isPlaying === false)
                        &&
                        <IconButton aria-label="play/pause"
                            onClick={() => setCurrentTrack({ ...data, isPlaying: true })}
                        >
                            <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                        </IconButton>
                    }

                    {
                        data._id === currentTrack._id && currentTrack.isPlaying === true
                        &&
                        <IconButton aria-label="play/pause"
                            onClick={() => setCurrentTrack({ ...data, isPlaying: false })}
                        >
                            <PauseIcon sx={{ height: 38, width: 38 }} />
                        </IconButton>
                    }

                    <IconButton aria-label="next">
                        {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
                    </IconButton>

                </Box>

            </Box>
            <CardMedia
                component="img"
                sx={{ width: 151 }}
                image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${data.imgUrl}`}
            />
        </Card>
    )

}

export default ProfileListTracks;