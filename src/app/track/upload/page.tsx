import UploadTabs from "@/components/track/upload.tabs";
import { Container } from "@mui/material";
import type { Metadata } from 'next';



export const metadata: Metadata = {
    title: 'Upload track',
    description: 'Miêu tả của upload page',
}
const UploadPage = () => {
    return (
        <Container>
            <UploadTabs />
        </Container>
    )
}

export default UploadPage;