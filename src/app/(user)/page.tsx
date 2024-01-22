
// page: định nghĩa giao diện cho page, hình thù của component (màn hình)

import Container from "@mui/material/Container"
import MainSlider from "@/components/main/main.slider";
import { sendRequest } from "@/ultis/api";

// import AppHeader from "@/components/header/app.header";


export default async function HomePage() {

  // Chỉ mình NextJS 13 với Server Component mới viết đc 'async await' tại chính đầu Component đó luôn (k cs khái niệm 'async await' Component với CSR)
  const chills = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: "http://localhost:8000/api/v1/tracks/top",
    method: "POST",
    body: { category: "CHILL", limit: 10 },
  })

  const workouts = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: "http://localhost:8000/api/v1/tracks/top",
    method: "POST",
    body: { category: "WORKOUT", limit: 10 },
  })

  const parties = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: "http://localhost:8000/api/v1/tracks/top",
    method: "POST",
    body: { category: "PARTY", limit: 10 },
  })



  return (

    <div style={{ marginBottom: 70 }}>
      <Container>
        <MainSlider title={'Top Chills'} data={chills?.data ?? []} />
        <MainSlider title={'Top Workouts'} data={workouts?.data ?? []} />
        <MainSlider title={'Top Parties'} data={parties?.data ?? []} />
      </Container>
    </div>

  );
}
