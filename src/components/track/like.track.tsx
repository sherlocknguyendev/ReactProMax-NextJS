
'use client'

import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { sendRequest } from "@/ultis/api";

interface IProps {
    track: ITrackTop | null,
}

const LikeTrack = (props: IProps) => {

    const { data: session } = useSession();

    const router = useRouter();

    const { track } = props;

    const [trackLikes, setTrackLikes] = useState<ITrackLike[] | null>(null)

    const fetchData = async () => {
        if (session?.access_token) {
            const res = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
                url: `http://localhost:8000/api/v1/likes`,
                method: "GET",
                queryParams: {
                    current: 1,
                    pageSize: 100,
                    sort: '-createdAt'
                },
                headers: {
                    Authorization: `Bearer ${session?.access_token}`,
                }
            })
            if (res.data?.result) {
                setTrackLikes(res.data.result)
            }
        }

    }

    useEffect(() => {
        fetchData()
    }, [session])


    const handleLikeTrack = async () => {
        await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
            url: `http://localhost:8000/api/v1/likes`,
            method: "POST",
            body: {
                track: track?._id,
                quantity: trackLikes?.some(t => t._id === track?._id) ? -1 : 1
            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            }
        })

        await sendRequest<IBackendRes<any>>({
            url: `/api/revalidate`,
            method: 'POST',
            queryParams: {
                tag: 'track-by-id',
                secret: 'sherlockNguyenDev'
            }
        })
        //--> Để clear data cache và lấy data mới 

        fetchData();
        router.refresh();

    }


    return (
        <Box
            sx={{
                margin: '10px 0 34px 0',
                display: 'flex',
                justifyContent: 'space-between'
            }}
        >
            <div>
                <Chip
                    icon={trackLikes?.some(t => t._id === track?._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    label="Like"
                    variant="outlined"
                    onClick={() => handleLikeTrack()}
                    color={trackLikes?.some(t => t._id === track?._id) ? 'error' : 'default'}
                />
            </div>
            <div style={{
                display: 'flex',
                gap: 5
            }}>
                <Chip icon={<PlayArrowIcon />} label={`${track?.countPlay} Plays`} />
                <Chip icon={<FavoriteIcon />} label={`${track?.countLike} Likes`} />
            </div>
        </Box>
    )
}

export default LikeTrack;