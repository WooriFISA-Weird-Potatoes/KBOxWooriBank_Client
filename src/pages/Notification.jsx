import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, List, ListItem, Divider, Button } from '@mui/material';
import useFetch from '../hooks/useFetch';
import Loading from '../components/Loading';
import BackButton from '../components/BackButton';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { faGift, faBaseballBatBall, faLightbulb, faAnglesDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from 'moment';

export default function Notification() {
    const navigate = useNavigate();
    const { data, isLoading, refetch } = useFetch('/notifications');
    const [groupedNotifications, setGroupedNotifications] = useState({});
    const [readNotifications, setReadNotifications] = useState(new Set());
    const [visibleDates, setVisibleDates] = useState([]);

    useEffect(() => {
        const today = moment();
        const dates = Array.from({ length: 7 }, (_, i) => today.clone().subtract(i, 'days').format('YYYY-MM-DD'));
        setVisibleDates(dates);
    }, []);

    useEffect(() => {
        if (data && Array.isArray(data)) {
            const grouped = data.reduce((acc, notification) => {
                const dateKey = moment(notification.createdAt).format('YYYY-MM-DD');
                if (!acc[dateKey]) {
                    acc[dateKey] = [];
                }
                acc[dateKey].push(notification);
                return acc;
            }, {});
            setGroupedNotifications(grouped);

            const readSet = new Set();
            data.forEach(notification => {
                if (notification.isChecked) {
                    readSet.add(notification.id);
                }
            });
            setReadNotifications(readSet);
        }
    }, [data]);

    const handleRead = async (id) => {
        try {
            await refetch(`/notifications/read/${id}`, {}, 'POST', null, false);
            setReadNotifications(prevState => new Set([...prevState, id]));
            const updatedGroupedNotifications = { ...groupedNotifications };
            Object.keys(updatedGroupedNotifications).forEach((date) => {
                updatedGroupedNotifications[date] = updatedGroupedNotifications[date].map((notification) => {
                    if (notification.id === id) {
                        return { ...notification, isChecked: true };
                    }
                    return notification;
                });
            });
            setGroupedNotifications(updatedGroupedNotifications);
        } catch (error) {}
    };


    const formatDate = (date) => {
        const today = moment().format('YYYY-MM-DD');
        const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');

        if (date === today) return '오늘';
        if (date === yesterday) return '어제';

        return moment(date).format('YY년 M월 D일');
    };

    const getMessageByType = (type, metadata) => {
        switch (type) {
            case 'P':
                return `승부예측 성공! ${metadata} P 적립 되었어요`;
            case 'Q':
                return `오늘의 퀴즈 정답! ${metadata} P 적립 되었어요`;
            case 'E':
                return (
                    <span>
                        선착순 이벤트 당첨!{' '}
                        <span
                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => navigate('/winner', { state: { eventId: metadata } })}
                        >
                            경품을 확인하고 배송지를 입력해주세요
                        </span>
                    </span>
                );
            default:
                return '';
        }
    };

    const getIconByType = (type, isChecked) => {
        const commonStyle = { fontSize: '35px' };
        if (isChecked) {
            return type === 'P' ? (<FontAwesomeIcon icon={faBaseballBatBall} style={{ ...commonStyle, color: "#4783c2" }} />)
                : type === 'Q' ? (<FontAwesomeIcon icon={faLightbulb} style={{ ...commonStyle, color: "#ffd43b" }} />)
                    : type === 'E' ? (<FontAwesomeIcon icon={faGift} style={{ ...commonStyle, color: "#52c33c" }} />)
                        : '';
        } else {
            return type === 'P' ? (<FontAwesomeIcon icon={faBaseballBatBall} shake style={{ ...commonStyle, color: "#4783c2" }} />)
                : type === 'Q' ? (<FontAwesomeIcon icon={faLightbulb} shake style={{ ...commonStyle, color: "#ffd43b" }} />)
                    : type === 'E' ? (<FontAwesomeIcon icon={faGift} shake style={{ ...commonStyle, color: "#52c33c" }} />)
                        : '';
        }
    };

    const showMoreDays = () => {
        const lastDate = visibleDates[visibleDates.length - 1];
        const newDates = Array.from({ length: 7 }, (_, i) => moment(lastDate).subtract(i + 1, 'days').format('YYYY-MM-DD'));
        setVisibleDates([...visibleDates, ...newDates]);
    };

    const totalNotificationDays = Object.keys(groupedNotifications).length;

    return (
        <>
            <Container>
                <Box sx={{ mt: 1, borderRadius: '12px', textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <BackButton />
                        <Typography component="h1" variant="h5" sx={{ margin: 'auto', fontFamily: 'KBO-Dia-Gothic_medium' }}>
                            알림
                        </Typography>
                        <div style={{ minWidth: '28px' }}></div>
                    </Box>
                </Box>
                {isLoading ? (
                    <Loading />
                ) : (
                    <>
                        {Object.keys(groupedNotifications).length === 0 ? (
                            <Box sx={{ mt: 3 }}>
                                <ErrorOutlineIcon sx={{ fontSize: '40px', color: '#ccc' }} />
                                <Typography sx={{ margin: '8px 0', fontFamily: 'KBO-Dia-Gothic_medium' }}>알림 메시지가 없습니다</Typography>
                                <Typography sx={{ fontFamily: 'KBO-Dia-Gothic_light' }}>새로운 이벤트에 참여해보세요!</Typography>
                            </Box>
                        ) : (
                            <List>
                                {visibleDates.map((date) => {
                                    if (groupedNotifications[date]) {
                                        return (
                                            <Box my={2} key={date}>
                                                <Divider sx={{ borderColor: 'rgb(223 228 235)', margin: '8px' }} />
                                                <Typography sx={{ ml: 1, textAlign: 'left', fontWeight: 'bold', fontFamily: 'KBO-Dia-Gothic_light' }}>
                                                    {formatDate(date)}
                                                </Typography>
                                                {groupedNotifications[date].map((notification) => (
                                                    <ListItem
                                                        my={5}
                                                        key={notification.id}
                                                        sx={{ border: '1px solid #fff', borderRadius: '12px', backgroundColor: notification.isChecked ? 'transparent' : '#f4f4f4' }}
                                                    >
                                                        <Box sx={{ mr: 2, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '40px', height: '40px' }}>
                                                            {getIconByType(notification.type, notification.isChecked)}
                                                        </Box>
                                                        <Box sx={{ flexGrow: 1 }}>
                                                            <Typography variant="body1" sx={{ fontFamily: 'KBO-Dia-Gothic_light', fontSize: '16px' }}>
                                                                {getMessageByType(notification.type, notification.metadata)}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
                                                                <Typography variant="body2" sx={{ fontFamily: 'KBO-Dia-Gothic_light', fontSize: '12px' }}>
                                                                    {moment(notification.createdAt).format('A h시 m분')}
                                                                </Typography>
                                                                <Box sx={{
                                                                    cursor: readNotifications.has(notification.id) ? 'default' : 'pointer',
                                                                    fontSize: '12px'
                                                                }}
                                                                    onClick={() => !readNotifications.has(notification.id) && handleRead(notification.id)}
                                                                >
                                                                    {readNotifications.has(notification.id) ? '읽음' : '읽음 표시'}
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    </ListItem>
                                                ))}
                                            </Box>
                                        );
                                    }
                                    return null;
                                })}
                            </List>
                        )}
                    </>)}
                {visibleDates.length < totalNotificationDays && (
                    <Button onClick={showMoreDays}>
                        <FontAwesomeIcon icon={faAnglesDown} size="2xl" style={{ color: "#1976d2", }} />
                    </Button>
                )}
            </Container >
        </>
    );
}
