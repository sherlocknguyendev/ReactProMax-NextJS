
'use client'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from "react-slick";
import { Box } from "@mui/material";
import Button from "@mui/material/Button/Button";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';

interface IProps {
    data: ITrackTop[],
    title: string
}

const MainSlider = (props: IProps) => {
    const { data, title } = props
    const NextArrow = (props: any) => {
        return (
            <Button variant="contained" color='inherit'
                onClick={props.onClick}
                sx={{
                    position: "absolute",
                    right: 0,
                    top: "25%",
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
                }}
            >
                <ChevronRightIcon />
            </Button>
        )
    }

    const PrevArrow = (props: any) => {
        return (
            <Button variant="contained" onClick={props.onClick} color='inherit'
                sx={{
                    position: "absolute",
                    top: "25%",
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
                }}
            >
                <ChevronLeftIcon />
            </Button>
        )
    }

    const settings: Settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };
    // Box === div: Box cs 1 props là component -> component = 'tag' gì thì sẽ render ra 'tag' đấy

    return (

        <Box
            sx={{
                margin: "0 50px",
                ".track": {
                    padding: "0 10px",

                    "img": {
                        width: 150,
                        height: 150
                    },


                },

            }}
        >
            <h2>{title}</h2>
            <Slider {...settings}>
                {data.map((item) => {
                    return (
                        <div className="track" key={item._id}>
                            <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${item.imgUrl}`} alt="" />
                            <h4>{item.title}</h4>
                            <h5>{item.description}</h5>
                        </div>
                    )
                })}
            </Slider>
            <Divider />
        </Box>

    );
}

export default MainSlider;