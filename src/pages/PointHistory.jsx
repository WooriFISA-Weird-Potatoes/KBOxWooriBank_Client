import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, List, ListItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeepLink from '../components/DeepLink';
import Loading from '../components/Loading';
import BackButton from '../components/BackButton';
import useFetch from '../hooks/useFetch';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { faAnglesDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from 'moment';
import 'moment/locale/ko';

moment.locale('ko');


export default function PointHistory() {
    const navigate = useNavigate();
    const [points, setPoints] = useState(0);
    const [pointHistory, setPointHistory] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [visibleItems, setVisibleItems] = useState(5);
    const { data, isLoading } = useFetch('/point');

    const openModal = () => {
        setIsOpenModal(true);
    };

    const closeModal = () => {
        setIsOpenModal(false);
    };

    const loadMoreItems = () => {
        setVisibleItems(prevVisibleItems => prevVisibleItems + 5);
    };

    const handlePointExchange = () => {
        navigate('/pointexchange');
    };

    useEffect(() => {
        if (data) {
            setPoints(data.point);
            setPointHistory(data.pointList);
        }
    }, [data]);


    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <Container>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <BackButton />
                        <Typography variant="h5" sx={{ margin: 'auto', fontFamily: 'KBO-Dia-Gothic_medium' }}>
                            나의 포인트
                        </Typography>
                        <div style={{ minWidth: '28px' }}></div>
                    </Box>
                    <Box sx={{ backgroundColor: '#f4f4f4', p: 3, borderRadius: '12px', textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography variant="h6">{points}</Typography>
                            <Typography variant="h6" sx={{ ml: 0.5 }}>P</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handlePointExchange}
                                sx={{ fontFamily: 'KBO-Dia-Gothic_light', mr: 1, width: '40%' }}
                            >
                                꿀머니 전환
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={openModal}
                                sx={{ fontFamily: 'KBO-Dia-Gothic_light', ml: 1, width: '40%' }}
                            >
                                사용하러 가기
                            </Button>
                            <DeepLink isOpen={isOpenModal} closeModal={closeModal} />
                        </Box>
                    </Box>
                    {pointHistory.length === 0 ? (
                        <Box sx={{ mt: 3}}>
                            <ErrorOutlineIcon sx={{ fontSize: '40px', color: '#ccc' }} />
                            <Typography sx={{ margin: '8px 0', fontFamily: 'KBO-Dia-Gothic_medium'}} >적립 내역이 없습니다</Typography>
                            <Typography sx={{ fontFamily: 'KBO-Dia-Gothic_light' }}>새로운 이벤트에 참여해보세요!</Typography>
                        </Box>
                    ) : (
                        <Container>
                            <List>
                                <ListItem sx={{ borderTop: '2px solid rgb(223 228 235)', padding: '0px' }} />
                                {pointHistory.slice(0, visibleItems).map((item, index) => (
                                    <ListItem key={index} sx={{ borderBottom: '1px solid rgb(223 228 235)' }}>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="body1" sx={{ mt: 1, mb: 1, fontFamily: 'KBO-Dia-Gothic_light', fontSize: '1.1rem' }}>
                                                {item.statusCode === 'SAVE' ? '포인트 적립' : '포인트 사용'}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" sx={{ fontFamily: 'KBO-Dia-Gothic_light', fontSize: '0.75rem' }}>
                                                {moment(item.createdAt).format('YY년 M월 D일 A h시 m분')}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body1" sx={{ fontFamily: 'KBO-Dia-Gothic_medium', color: '#1976d2', fontSize: '1.1rem' }}>
                                                {item.statusCode === 'SAVE' ? `+${item.point}` : `-${item.point}`}
                                            </Typography>
                                        </Box>
                                    </ListItem>
                                ))}
                                {pointHistory.length > visibleItems && (
                                    <Button onClick={loadMoreItems}>
                                        <FontAwesomeIcon icon={faAnglesDown} size="2xl" style={{ color: "#1976d2", }} />
                                    </Button>
                                )}
                                <ListItem sx={{ borderTop: '2px solid rgb(223 228 235)', padding: '0px' }} />
                            </List>
                        </Container>
                    )}
                </Container>
            )}
        </>
    );
}
