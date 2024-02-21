
'use client'

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import Step1 from './steps/step1';
import Step2 from './steps/step2';


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}



function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}


const UploadTabs = () => {

    const [value, setValue] = React.useState(0);
    const [trackUpload, setTrackUpload] = React.useState({
        fileName: '', // Tên file ban đầu upload
        percent: 0,
        fileNameUploaded: '' // Tên file lưu ở DB (BE sẽ tự rename để tránh bị trùng tên dẫn đến ghi đè làm mất dữ liệu cũ)
    })

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };


    return (
        <Box sx={{ width: '100%', margin: '10px 0 15px 0', border: '1px solid #333' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Track File" disabled={value !== 0} />
                    <Tab label="Track Information" disabled={value !== 1} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <Step1
                    setValue={setValue}
                    setTrackUpload={setTrackUpload}
                    trackUpload={trackUpload}
                />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Step2
                    trackUpload={trackUpload}
                    setValue={setValue}
                />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                Item Three
            </CustomTabPanel>
        </Box>
    );
}

export default UploadTabs;