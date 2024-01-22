
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
import Link from "next/link";
import { convertSlugUrl } from "@/ultis/api";
import Image from "next/image";

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
        slidesToScroll: 2,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]

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
                            <div
                                style={{
                                    width: '100%',
                                    height: '150px',
                                    position: 'relative'
                                }}
                            >
                                {/* Image Component remote (data ở back-end) */}
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${item.imgUrl}`}
                                    alt="image from back-end"
                                    fill // thay cho width vs height
                                    style={{
                                        objectFit: 'contain'
                                    }}
                                />
                            </div>
                            <Link href={`/track/${convertSlugUrl(item.title)}-${item._id}.html?audio=${item.trackUrl}`}>
                                <h4>{item.title}</h4>
                            </Link>
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