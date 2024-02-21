
import { Container } from "@mui/material"
import type { Metadata } from 'next';
import ClientSearch from "./components/client.search";

export const metadata: Metadata = {
    title: 'Search your track',
    description: 'Miêu tả thôi mà',
}


const SearchPage = () => {
    return (
        <Container sx={{ mt: 3 }}>
            <ClientSearch />
        </Container>
    )
}

export default SearchPage;