

import ProfileListTracks from "@/components/profile/profile.tracks";
import { sendRequest } from "@/ultis/api";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

const ProfilePage = async ({ params }: { params: { slug: string } }) => {

    const str1 = params?.slug?.split('.html');
    const str2 = str1[0]?.split('-');
    const id = str2[str2?.length - 1];


    const tracks = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: "http://localhost:8000/api/v1/tracks/users?current=1&pageSize=10",
        method: "POST",
        body: { id: id },
    })

    const data = tracks?.data?.result ?? [];

    return (
        <Container sx={{ my: 5 }}>
            <Grid container spacing={5}>
                {data.map((item: ITrackTop, index: number) => {
                    return (
                        <Grid item xs={12} md={6} key={index}>
                            <ProfileListTracks data={item} />
                        </Grid>
                    )
                })}
            </Grid>
        </Container>
    )
}

export default ProfilePage;