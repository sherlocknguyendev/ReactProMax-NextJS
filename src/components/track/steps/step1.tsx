
'use client'
import { FileWithPath, useDropzone } from 'react-dropzone';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useCallback } from 'react';
import { sendRequestFile } from '@/ultis/api';
import { useSession } from 'next-auth/react';

import './theme.css';
import axios from 'axios';

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

function InputFileUpload() {
    return (
        <Button onClick={(event) => event.preventDefault()} component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            Upload file
            <VisuallyHiddenInput type="file" />
        </Button>
    );
}


interface IProps {
    setValue: (v: number) => void;
    setTrackUpload: React.Dispatch<React.SetStateAction<{
        fileName: string;
        percent: number;
        fileNameUploaded: string
    }>>
    trackUpload: {
        fileName: string;
        percent: number;
        fileNameUploaded: string;
    }
}

const Step1 = (props: IProps) => {
    const { trackUpload } = props;
    const { data: session } = useSession()
    const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {

        if (acceptedFiles && acceptedFiles[0]) {
            props.setValue(1)
            const audio = acceptedFiles[0];
            const formData = new FormData();
            formData.append('fileUpload', audio); //fileUpload: là key ở phần Body của Postman để cho BE hiểu 

            // --> Call API with Fetch
            // const file = await sendRequestFile<IBackendRes<ITrackTop[]>>({
            //     url: "http://localhost:8000/api/v1/files/upload",
            //     method: "POST",
            //     headers: {
            //         'Authorization': `Bearer ${session?.access_token}`,
            //         'target_type': 'tracks'
            //     },
            //     body: formData,
            // })


            // --> Call API with Axios
            try {
                const res = await axios.post("http://localhost:8000/api/v1/files/upload", formData,
                    {
                        headers: {
                            Authorization: `Bearer ${session?.access_token}`,
                            'target_type': 'tracks',
                        },

                        onUploadProgress: progressEvent => {

                            let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total!);

                            props.setTrackUpload({
                                ...trackUpload,
                                fileName: acceptedFiles[0].name,
                                percent: percentCompleted
                            })
                        }
                    }
                )
                // prevState ở đây là đợi phần setTrackUpload ở trên chạy xog thì ms chạy phần bên dưới
                props.setTrackUpload((prevState) => ({
                    ...prevState,
                    fileNameUploaded: res.data.data.fileName
                }))

            } catch (error) {
                //@ts-ignore
                console.log(error?.response?.data?.message);

            }


        }

    }, [session])

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'audio': [".mp3"]
        }
    });

    const files = acceptedFiles.map((file: FileWithPath) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <section className="container">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <InputFileUpload />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <aside>
                <h4>Files</h4>
                <ul>{files}</ul>
            </aside>
        </section>
    );
}

export default Step1;