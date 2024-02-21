
'use client'

import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import Container from '@mui/material/Container';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { fetchDefaultImages } from '@/ultis/api';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import ActiveLink from './active.link';


// Search này là ví dụ cho styled-component
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            // width: '20ch',
            width: '440px',
        },
    },
}));

export default function AppHeader() {

    // Lấy session phía client (hook)
    //session hiểu đơn giản là dữ liệu của ng dùng đã đc mã hóa
    const { data: session } = useSession(); // dùng useSession để lấy ra session đã lưu
    // console.log('check session: ', session);


    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);


    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);


    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem>
                <Link href={`/profile/${session?.user._id}`} style={{ textDecoration: 'unset', color: 'unset' }}>
                    {/* Dùng style thay vì sx vì Component Link thuộc về NextJS (sx thuộc về MUI) */}
                    Profile
                </Link>
            </MenuItem>
            <MenuItem onClick={() => {
                handleMenuClose();
                signOut();
            }}>Logout</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    const router = useRouter();

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: '#4c5c6c' }}>
                {/* MUI dùng props sx thay vì style để css inline (và sx cung cấp theme để chuyển dark/light theme) */}
                <Container>
                    <Toolbar>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{
                                display: { xs: 'none', sm: 'block' },
                                "> a": {
                                    color: 'unset',
                                    textDecoration: 'unset',


                                }
                            }}


                        >
                            <Link href={'/'}>SoundCloud</Link>
                        </Typography>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                                onKeyDown={(e: any) => {
                                    if (e.key === "Enter") {
                                        if (e?.target?.value)
                                            router.push(`/search?q=${e?.target?.value}`)
                                    }
                                }}
                            />
                        </Search>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{
                            display: { xs: 'none', md: 'flex' },
                            alignItems: 'center',
                            gap: '20px',
                            cursor: 'pointer',

                            "> a": {
                                color: 'unset',
                                textDecoration: 'unset',
                                "&.active": {
                                    background: '#3b4a59',
                                    color: '#cefaff',
                                    borderRadius: '5px',
                                    padding: '3px'
                                }

                            }
                        }}>
                            {session ?
                                <>
                                    <ActiveLink href={'/playlist'}>
                                        Playlists
                                    </ActiveLink>
                                    <ActiveLink href={'/like'}>
                                        Likes
                                    </ActiveLink>
                                    <ActiveLink href={'/track/upload'}>
                                        Upload
                                    </ActiveLink>

                                    <Image
                                        onClick={handleProfileMenuOpen}
                                        width={45}
                                        height={45}
                                        src={fetchDefaultImages(session.user.type)}
                                        alt='avatar-header'
                                    />
                                    {/* <Avatar onClick={handleProfileMenuOpen}>VQ</Avatar> */}
                                </>
                                :
                                <>
                                    <Link href={'/auth/signin'} >
                                        Login
                                    </Link>
                                </>
                            }

                        </Box>
                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="show more"
                                aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                onClick={handleMobileMenuOpen}
                                color="inherit"
                            >
                                <MoreIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </Box>
    );
}