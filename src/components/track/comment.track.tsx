
'use client'

import { fetchDefaultImages, sendRequest } from "@/ultis/api";
import { Box, TextField } from "@mui/material";
import { useSession } from "next-auth/react";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from "react";
import { useRouter } from "next/navigation";
import WaveSurfer from "wavesurfer.js";
import { useHasMounted } from "@/ultis/customHook";
dayjs.extend(relativeTime)

interface IProps {
    track: ITrackTop | null,
    comments: ITrackComment[] | null,
    wavesurfer: WaveSurfer | null
}

const CommentTrack = (props: IProps) => {

    const hasMounted = useHasMounted();


    const router = useRouter();

    const { data: session } = useSession();

    const { track, comments, wavesurfer } = props;
    const [yourComment, setYourComment] = useState<string>('');

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secondsRemainder = Math.round(seconds) % 60
        const paddedSeconds = `0${secondsRemainder}`.slice(-2)
        return `${minutes}:${paddedSeconds}`
    }

    const handleSubmit = async () => {
        const res = await sendRequest<IBackendRes<ITrackComment>>({
            url: `http://localhost:8000/api/v1/comments`,
            method: "POST",
            body: {
                content: yourComment,
                moment: Math.round(wavesurfer?.getCurrentTime() ?? 0),
                track: track?._id

            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            }

        })

        if (res.data) {
            setYourComment('')
            router.refresh() // Giúp fetch lại data ở server component mà k thay đổi trang or refresh trang hiện tại
        }

    }

    const handleJumpTrack = (moment: number) => {
        if (wavesurfer) {
            const duration = wavesurfer.getDuration();
            wavesurfer.seekTo(moment / duration);
            wavesurfer.play();
        }
    }

    return (
        <div style={{ marginTop: '20px' }}>
            <div>
                {
                    session?.user &&
                    <TextField
                        fullWidth
                        label="Comment"
                        variant="standard"
                        value={yourComment}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSubmit()
                            }
                        }}
                        onChange={(e) => setYourComment(e.target.value)}
                    />

                }
            </div>
            <Box sx={{
                display: 'flex',
                marginTop: '18px',
                gap: 10,
            }}>
                <div className="left-content"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: 'center',
                        alignItems: 'center',
                        width: '190px'

                    }}>
                    <img
                        style={{
                            width: 120,
                            height: 120
                        }}
                        src={fetchDefaultImages(session?.user?.type!)} />
                    <div>
                        {session?.user?.email}
                    </div>
                </div>

                <div className="right-content" style={{ width: '100%' }}>
                    {comments?.map(item => {
                        return (
                            <Box key={item._id} sx={{ display: 'flex', justifyContent: 'space-between', margin: '24px 0', alignItems: 'center', }}>
                                <div className="title" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                    <img
                                        style={{
                                            width: 40,
                                            height: 40
                                        }}
                                        src={fetchDefaultImages(item?.user?.type)} />

                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <div
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleJumpTrack(item?.moment)}
                                        >
                                            {item?.user?.email} - at {formatTime(item?.moment)}
                                        </div>
                                        <div>{item?.content}</div>
                                    </div>
                                </div>

                                <div style={{ fontSize: '12px', color: '#999', textAlign: 'right' }} >
                                    {hasMounted && dayjs(item.createdAt).fromNow()}
                                </div>
                            </Box>
                        )
                    })}
                </div>

            </Box >

        </div >
    )
}

export default CommentTrack;