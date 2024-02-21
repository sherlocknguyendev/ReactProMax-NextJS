
'use client'

import { useWavesurfer } from '@/ultis/customHook';
import { useRouter, useSearchParams } from 'next/navigation';
import { WaveSurferOptions } from 'wavesurfer.js';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { PauseCircleSharp, PlayArrowSharp } from '@mui/icons-material';

import './wave.track.scss'
import Tooltip from '@mui/material/Tooltip';
import { fetchDefaultImages, sendRequest } from '@/ultis/api';
import { useTrackContext } from '@/lib/track.wrapper';
import CommentTrack from './comment.track';
import LikeTrack from './like.track';
import Image from 'next/image';


interface IProps {
    track: ITrackTop | null,
    comments: ITrackComment[] | null
}

// Component
const WaveTrack = (props: IProps) => {


    const router = useRouter();
    const firstViewRef = useRef(true); // Dùng ref thay vì state để tránh re-render

    const { track, comments } = props;
    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [time, setTime] = useState<string>('00:00')
    const [duraion, setDuration] = useState<string>('00:00')


    const searchParams = useSearchParams()

    const audio = searchParams.get('audio') // lấy tham số truyền vào trên url 
    const id = searchParams.get('id')

    const containerRef = useRef<HTMLDivElement>(null)
    const hoverWaveRef = useRef<HTMLDivElement>(null)


    const optionsMemo = useMemo((): Omit<WaveSurferOptions, 'container'> => { // useMemo: Ghi nhớ và trả về giá trị (value) -> tránh render k cần thiết

        let gradient, progressGradient;
        if (typeof window !== 'undefined') {
            const canvas = document.createElement('canvas') // canvas: giống như 1 cái khung tranh, gradient: màu dải
            const ctx = canvas.getContext('2d')!;

            // Define the waveform gradient
            gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
            gradient.addColorStop(0, '#656666') // Top color
            gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666') // Top color
            gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1') // Bottom color
            gradient.addColorStop(1, '#B1B1B1') // Bottom color

            // Define the progress gradient
            progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
            progressGradient.addColorStop(0, '#EE772F') // Top color
            progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926') // Top color
            progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#F6B094') // Bottom color
            progressGradient.addColorStop(1, '#F6B094') // Bottom color
        }

        return (
            {
                height: 100,
                barWidth: 3,
                waveColor: gradient,
                progressColor: progressGradient,
                url: `/api?audio=${audio}`,  // client gọi tới server (client vs server cùng domain)
            }
        )
    }, []) // Chỉ render 1 lần

    const wavesurfer = useWavesurfer(containerRef, optionsMemo)


    // On play button click
    const onPlayClick = useCallback(() => {
        if (wavesurfer) {
            wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play()
        }
    }, [wavesurfer])


    // Initialize wavesurfer when the container mounts
    // or any of the props change
    useEffect(() => {
        if (!wavesurfer) return

        setIsPlaying(false)


        const hoverWave = hoverWaveRef.current!;

        const waveform = containerRef.current!; // ! đằng sau có nghĩa là element này chắc chắn sẽ có
        waveform.addEventListener('pointermove', (e) => (hoverWave.style.width = `${e.offsetX}px`))

        const subscriptions = [
            wavesurfer.on('play', () => setIsPlaying(true)), // Mỗi khi on play hoặc on pause thực thi xog thì mới set state
            wavesurfer.on('pause', () => setIsPlaying(false)),
            wavesurfer.on('decode', (duration) => {
                setDuration(formatTime(duration))
            }),
            wavesurfer.on('timeupdate', (currentTime) => {
                setTime(formatTime(currentTime))
            }),
            wavesurfer.on('interaction', () => {
                wavesurfer.play()
            })

        ]

        return () => {
            subscriptions.forEach((unsub) => unsub())
        }

    }, [wavesurfer])



    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secondsRemainder = Math.round(seconds) % 60
        const paddedSeconds = `0${secondsRemainder}`.slice(-2)
        return `${minutes}:${paddedSeconds}`
    }


    const calcLeft = (moment: number) => {
        const trackDuration = wavesurfer?.getDuration() ?? 0;
        const percent = (moment / trackDuration) * 100;
        return `${percent}%`
    }

    useEffect(() => {
        if (wavesurfer && currentTrack.isPlaying) {
            wavesurfer.pause()
        }
    }, [currentTrack])

    useEffect(() => {
        if (track?._id && !currentTrack?._id) {
            setCurrentTrack({ ...track, isPlaying: false })
        }
    }, [track])


    const handleIncreaseView = async () => {
        if (firstViewRef.current) {
            await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
                url: `http://localhost:8000/api/v1/tracks/increase-view`,
                method: "POST",
                body: {
                    trackId: track?._id
                },

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


            router.refresh();
            firstViewRef.current = false;
        }

    }

    return (
        <div style={{ marginTop: 20 }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                height: 350,
                gap: 20,
                padding: 30,
                background: 'linear-gradient(135deg, rgb(106,112,67) 0%, rgb(11, 15, 20) 100%)'
            }}
            >
                <div className='left-content' style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div className='top-left' style={{ display: 'flex', gap: 20 }}>
                        <div
                            onClick={() => {
                                onPlayClick()
                                handleIncreaseView()
                                if (track && wavesurfer) {
                                    setCurrentTrack({ ...track, isPlaying: false })
                                }

                            }}
                            style={{
                                borderRadius: '50%',
                                cursor: 'pointer',
                                background: '#f50',
                                height: '50px',
                                width: '50px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            {isPlaying === true ?
                                <PauseCircleSharp
                                    sx={{ fontSize: 30, color: 'white' }}
                                />
                                :
                                <PlayArrowSharp
                                    sx={{ fontSize: 30, color: 'white' }}
                                />

                            }
                        </div>

                        <div>
                            <div style={{ backdropFilter: 'brightness(0.5)', fontSize: 30, color: 'white', padding: '4px' }}>
                                {track?.title}
                            </div>
                            <div style={{ backdropFilter: 'brightness(0.5)', fontSize: 20, color: 'white', marginTop: 8, padding: '4px', width: 'fit-content' }}>
                                {track?.description}
                            </div>
                        </div>
                    </div>

                    <div ref={containerRef} className='wave-form-container bottom-left' >
                        <div className='time'>{time}</div>
                        <div className='duration'>{duraion}</div>
                        <div ref={hoverWaveRef} className="hover-wave"></div>
                        <div className="overlay"
                            style={{
                                position: "absolute",
                                height: "30px",
                                width: "100%",
                                bottom: "0",
                                backdropFilter: 'brightness(0.5)'
                            }}
                        ></div>
                        <div className='comments' style={{ position: 'relative' }}>
                            {comments?.map((item: ITrackComment) => {
                                return (
                                    <Tooltip arrow title={item.content} key={item._id}>
                                        <Image
                                            onPointerMove={(e) => {
                                                const hoverWave = hoverWaveRef.current!;
                                                hoverWave.style.width = calcLeft(item.moment)
                                            }}
                                            key={item._id}
                                            width={20}
                                            height={20}
                                            style={{
                                                zIndex: 20,
                                                position: 'absolute',
                                                top: 70,
                                                left: calcLeft(item.moment)
                                            }}
                                            src={fetchDefaultImages(item?.user?.type)}
                                            alt='avatar-comment'
                                        />
                                    </Tooltip>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className='right-content' style={{ alignSelf: 'center', width: 250, height: 250 }}>
                    {
                        track?.imgUrl ?
                            <Image
                                alt='image-track'
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl}`}
                                width={250}
                                height={250}
                            />

                            :
                            <div
                                style={{
                                    alignSelf: 'center',
                                    width: 250,
                                    height: 250,
                                    backgroundColor: 'grey'
                                }}></div>
                    }
                </div>
            </div>

            <div>
                <LikeTrack
                    track={track}
                />
            </div>

            <div>
                <CommentTrack
                    track={track}
                    comments={comments}
                    wavesurfer={wavesurfer}
                />
            </div>

        </div>
    )

}


export default WaveTrack;