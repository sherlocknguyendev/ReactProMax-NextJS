

'use client'

import { Alert, Avatar, Box, Button, Divider, Grid, IconButton, InputAdornment, Snackbar, TextField } from "@mui/material";
import LockPersonIcon from '@mui/icons-material/LockPerson';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import { useState } from "react";
import { ArrowBack, Visibility, VisibilityOff } from "@mui/icons-material";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";


const AuthSignIn = () => {

    const router = useRouter();

    const [name, setName] = useState<string>('');
    const [pass, setPass] = useState<string>('');

    const [showPass, setShowPass] = useState<boolean>(false);

    const [isErrName, setIsErrName] = useState<boolean>(false);
    const [isErrPass, setIsErrPass] = useState<boolean>(false);

    const [errName, setErrName] = useState<string>('');
    const [errPass, setErrPass] = useState<string>('');

    const [isOpenSnackBar, setIsOpenSnackBar] = useState<boolean>(false);
    const [resMessage, setResMessage] = useState<string>('');


    const handleSubmit = async () => {
        setIsErrName(false);
        setIsErrPass(false);
        setErrName('');
        setErrPass('')

        if (!name) {
            setIsErrName(true);
            setErrName('Username is not be empty');
            return;
        }
        if (!pass) {
            setIsErrPass(true);
            setErrPass('Password is not be empty');
            return;
        }

        const res = await signIn('credentials', {
            username: name,
            password: pass,
            redirect: false
        })

        if (!res?.error) {
            router.push('/')
        } else {
            setIsOpenSnackBar(true)
            setResMessage(res.error)
        }


    }

    return (

        <Box sx={{
            marginTop: '80px',
            backgroundImage: 'linear-gradient(to bottom, #ff9aef, #fedac1, #d5e1cf, #b7e6d9',
            backgroundColor: '#b7e6d9',
            backgroundRepeat: 'no-repeat'
        }} >

            <Grid
                container
                sx={{ height: '100%' }}
                justifyContent='center'
                alignItems='center'
                columns={{ xs: 4, md: 12 }}
                direction='row'
            >

                <Grid
                    item
                    sx={{ height: '100%', padding: 2 }}
                    xs={12} sm={8} md={4} lg={4}
                    boxShadow='rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
                >
                    <Link href={'/'}>
                        <ArrowBack sx={{ color: 'black' }} />
                    </Link>

                    <Avatar sx={{ margin: '0 auto' }}>
                        <LockPersonIcon sx={{
                            fontSize: '32px'
                        }} />
                    </Avatar>


                    <div style={{ textAlign: 'center', margin: '10px 0px', fontSize: '30px' }}>Sign In</div>


                    <TextField
                        sx={{ width: '100%', margin: '10px 0px' }}
                        id="username"
                        label="Username"
                        name='username'
                        variant="outlined"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        helperText={errName}
                        error={isErrName}
                    />


                    <TextField
                        sx={{ width: '100%', margin: '10px 0px' }}
                        id="password"
                        label="Password"
                        name='password'
                        type={showPass ? 'text' : 'password'}
                        variant="outlined"
                        required
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        helperText={errPass}
                        error={isErrPass}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSubmit()
                            }
                        }}

                        InputProps={{
                            endAdornment:
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPass(!showPass)}>
                                        {showPass ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                        }}

                    />

                    <Button
                        sx={{ width: '100%', margin: '10px 0px' }}
                        variant="contained"
                        onClick={() => handleSubmit()}
                        type='submit'
                    >
                        Submit
                    </Button>

                    <Divider>Or</Divider>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 20,
                        margin: '10px 0px'
                    }}>
                        <GitHubIcon
                            titleAccess="Login with GitHub"
                            sx={{ fontSize: 34, cursor: 'pointer' }}
                            onClick={() => {
                                signIn('github')
                            }}
                        />
                        <GoogleIcon titleAccess="Login with Google" sx={{ fontSize: 34, cursor: 'pointer' }} />
                    </div>
                </Grid>
            </Grid>

            <Snackbar
                open={isOpenSnackBar}
                autoHideDuration={3000}
                onClose={() => setIsOpenSnackBar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setIsOpenSnackBar(false)} severity="error" sx={{ width: '100%' }}>
                    {resMessage}
                </Alert>
            </Snackbar>

        </Box>

    )

}

export default AuthSignIn;