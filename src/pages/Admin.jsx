import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import MainListItems from '../components/ListItems';
import UserStatistics from '../components/UserStatistics';
import PredictionParticipants from '../components/PredictionParticipants';
import QuizPaticipants from '../components/QuizPaticipants';
import QuizFileUpload from '../components/QuizFileUpload';
import EventFileUpload from '../components/EventFileUpload';
import useFetch from '../hooks/useFetch';
import Loading from '../components/Loading';


const drawerWidth = 200;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const defaultTheme = createTheme();

export default function Dashboard() {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState('전체 회원 수');
    const [isLoading, setIsLoading] = useState(true);
    const { data, refetch } = useFetch('/users/role');

    const handleListItemClick = (itemText) => {
        setSelectedItem(itemText);
    };

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handelBackToMain = () => {
        navigate('/');
    }

    useEffect(() => {
        async function fetchUserRole() {
            await refetch('/users/role');

            const role = data.role;
            if (role === 'ROLE_ADMIN') {
                setIsLoading(false);
            } else if (role === 'ROLE_USER') {
                navigate('/');
            }
        }
        fetchUserRole();
    }, [data.role]);

    return (
        <>{isLoading ? (
            <Loading />
        ) : (
            <ThemeProvider theme={defaultTheme}>
                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    <AppBar position="absolute" open={open}>
                        <Toolbar
                            sx={{
                                pr: '24px',
                            }}
                        >
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                onClick={toggleDrawer}
                                sx={{
                                    marginRight: '36px',
                                    ...(open && { display: 'none' }),
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography
                                component="h1"
                                variant="h6"
                                color="inherit"
                                noWrap
                                sx={{ flexGrow: 1 }}
                            >
                                관리자페이지
                            </Typography>
                            <Typography
                                component="h1"
                                variant="h6"
                                color="inherit"
                                typeof='button'
                                onClick={handelBackToMain}
                                sx={{ cursor: 'pointer' }}
                            >
                                메인으로 이동
                            </Typography>
                            <IconButton color="inherit" onClick={handelBackToMain}>
                                <HomeIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <Drawer variant="permanent" open={open}>
                        <Toolbar
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                px: [1],
                            }}
                        >
                            <IconButton onClick={toggleDrawer}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </Toolbar>
                        <Divider />
                        <List component="nav">
                            <MainListItems handleListItemClick={handleListItemClick} />
                        </List>
                    </Drawer>
                    <Box
                        component="main"
                        sx={{
                            backgroundColor: (theme) =>
                                theme.palette.mode === 'light'
                                    ? theme.palette.grey[100]
                                    : theme.palette.grey[900],
                            flexGrow: 1,
                            height: '100vh',
                            overflow: 'auto',
                        }}
                    >
                        <Toolbar />
                        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                            <Grid>
                                <Grid item xs={12} md={8} lg={9}>
                                    {selectedItem === '전체 회원 수' && (
                                        <Grid item xs={12} md={8} lg={9}>
                                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', width: 700, height: 1000 }}>
                                                <UserStatistics />
                                            </Paper>
                                        </Grid>
                                    )}
                                    {selectedItem === '퀴즈' && (
                                        <Grid item xs={12} md={8} lg={9}>
                                            <Paper sx={{ p: 2, mb: 2, display: 'flex', flexDirection: 'column', width: 700, height: 1000 }}>
                                                <QuizPaticipants />
                                            </Paper>
                                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 700, height: 200 }}>
                                                <Box >
                                                    <Typography component="h1" variant="h6" color="primary" noWrap sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', alignItems: 'center' }}>
                                                        퀴즈 목록 업데이트
                                                        <InfoIcon />
                                                    </Typography>
                                                    <Typography my={1} component="h1" variant="body2" color="initial" noWrap sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'left' }}>
                                                        파일을 .csv 양식으로 파일을 업로드 해주세요<br />
                                                        아래 예시에서 괄호 안에 실제 퀴즈 내용을 넣어주세요. 각 항목은 꼭 쉼표(,)로 나눠줘야 합니다.

                                                    </Typography>
                                                    <Typography variant="body2" sx={{ display: 'flex' }}>
                                                        <div style={{ marginRight: 4 }} >예시) </div>
                                                        질문(동물인것은?),정답번호(1),<br />
                                                        보기1(사자),보기2(노트북),보기3(텀블러),보기4(과자),날짜형식(2023-09-11)
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'right' }}>
                                                    <QuizFileUpload />
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    )}
                                    {selectedItem === '승부예측' && (
                                        <Grid item xs={12} md={8} lg={9}>
                                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', width: 700, height: 1000 }}>
                                                <PredictionParticipants />
                                            </Paper>
                                        </Grid>
                                    )}
                                    {selectedItem === '선착순 이벤트' && (
                                        <Grid item xs={12} md={8} lg={9}>
                                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 700, height: 200 }}>
                                                <Box >
                                                    <Typography component="h1" variant="h6" color="primary" noWrap sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', alignItems: 'center' }}>
                                                        선착순 이벤트 정보 업데이트
                                                        <InfoIcon />
                                                    </Typography>
                                                    <Typography my={1} component="h1" variant="body2" color="initial" noWrap sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'left' }}>
                                                        파일을 .csv 양식으로 파일을 업로드 해주세요<br />
                                                        아래 예시에서 괄호 안에 실제 정보를 넣어주세요. 각 항목은 꼭 쉼표(,)로 나눠줘야 합니다.

                                                    </Typography>
                                                    <Typography variant="body2" sx={{ display: 'flex' }}>
                                                        <div style={{ marginRight: 4 }} >예시) </div>
                                                        상품(아이패드),총 당첨자(30),이벤트 시작시간(2023-09-19T14:00:00),<br />이벤트 종료시간(2023-09-19T14:10:00),이벤트 종료여부(FALSE)
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'right' }}>
                                                    <EventFileUpload />
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                        </Container>
                    </Box>
                </Box>
            </ThemeProvider>
        )}
        </>
    );
}