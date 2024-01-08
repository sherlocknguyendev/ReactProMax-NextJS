
'use client'

import { Box, Button, Grid, MenuItem, Typography } from '@mui/material';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { sendRequest } from '@/ultis/api';
import { useToast } from '@/ultis/toast';


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


interface IProps {
    trackUpload: {
        fileName: string;
        percent: number;
        fileNameUploaded: string
    },
    setValue: (v: number) => void;
}



const Step2 = (props: IProps) => {
    const { data: session } = useSession()
    const { trackUpload, setValue } = props;
    const toast = useToast();

    const [info, setInfo] = useState<INewTrack>({
        title: '',
        description: '',
        trackUrl: '',
        imgUrl: '',
        category: ''
    })

    useEffect(() => {
        if (trackUpload && trackUpload.fileNameUploaded) {
            setInfo({
                ...info,
                trackUrl: trackUpload.fileNameUploaded
            })
        }
    }, [trackUpload])

    const categories = [
        {
            value: 'chill',
            label: 'CHILL',
        },
        {
            value: 'workout',
            label: 'WORKOUT',
        },
        {
            value: 'party',
            label: 'PARTY',
        },
    ];


    function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress variant="determinate" {...props} />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">{`${Math.round(
                        props.value,
                    )}%`}</Typography>
                </Box>
            </Box>
        );
    }

    function LinearWithValueLabel(props: IProps) {

        return (
            <Box sx={{ width: '100%' }}>
                <LinearProgressWithLabel value={props.trackUpload.percent} />
            </Box>
        );

    }

    function InputFileUpload(props: any) {
        const { info, setInfo } = props
        const { data: session } = useSession()

        const handleUploadImage = async (image: any) => {
            const formData = new FormData();
            formData.append('fileUpload', image); //fileUpload: là key ở phần Body của Postman để cho BE hiểu 
            try {
                const res = await axios.post("http://localhost:8000/api/v1/files/upload", formData,
                    {
                        headers: {
                            Authorization: `Bearer ${session?.access_token}`,
                            'target_type': 'images',
                        },
                    }
                )

                setInfo({
                    ...info,
                    imgUrl: res.data.data.fileName
                })

            } catch (error) {
                //@ts-ignore
                console.log(error?.response?.data?.message);

            }
        }

        return (
            <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onChange={(e) => {
                    const event = e.target as HTMLInputElement;
                    if (event.files) {
                        handleUploadImage(event.files[0])
                    }
                }}
            >
                Upload file
                <VisuallyHiddenInput type="file" />
            </Button>
        );
    }



    const handleSubmit = async () => {
        const res = await sendRequest<IBackendRes<INewTrack[]>>({
            url: "http://localhost:8000/api/v1/tracks",
            method: "POST",
            headers: {
                'Authorization': `Bearer ${session?.access_token}`,
            },
            body: {
                title: info.title,
                description: info.description,
                trackUrl: info.trackUrl,
                imgUrl: info.imgUrl,
                category: info.category,
            },


        })
        if (res && res.data) {
            toast.success('Create trask successfully!');
            setValue(0);
        } else {
            toast.error(res.message);
        }

    }


    return (
        <Box sx={{ width: '100%' }}>
            <div>{trackUpload.fileName}</div>
            <LinearWithValueLabel
                trackUpload={trackUpload}
                setValue={setValue}
            />
            <Grid container spacing={2} >
                <Grid item xs={6} md={4}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'

                    }}>
                    <div style={{ height: 200, width: 200, backgroundColor: 'grey' }}>
                        <div>
                            {info.imgUrl &&
                                <img
                                    height={250}
                                    width={250}
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`}
                                    alt="image"
                                />
                            }
                        </div>
                    </div>
                    <InputFileUpload
                        info={info}
                        setInfo={setInfo}
                    />
                </Grid>
                <Grid item xs={6} md={8}>
                    <TextField
                        label="Title"
                        variant="standard"
                        fullWidth
                        margin='dense'
                        value={info?.title}
                        onChange={(e) => setInfo({
                            ...info,
                            title: e.target.value
                        })}
                    />
                    <TextField
                        label="Description"
                        variant="standard"
                        fullWidth
                        margin='dense'
                        value={info?.description}
                        onChange={(e) => setInfo({
                            ...info,
                            description: e.target.value
                        })}
                    />
                    <TextField
                        fullWidth
                        select
                        margin='dense'
                        label="Categories"
                        variant="standard"
                        helperText="Please select your category"
                        value={info?.category}
                        onChange={(e) => setInfo({
                            ...info,
                            category: e.target.value
                        })}
                    >
                        {categories && categories.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button onClick={() => handleSubmit()} sx={{ margin: 1 }} variant="outlined">Save</Button>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Step2;