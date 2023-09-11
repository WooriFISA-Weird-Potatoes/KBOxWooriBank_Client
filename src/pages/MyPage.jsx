import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, IconButton } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../styles/mypage.module.css';
import DeepLink from '../components/DeepLink';
import Loading from "../components/Loading";
import useFetch from '../hooks/useFetch';

const Progress = ({ done, onClick }) => {
    return (
        <div className={ProgressBar.progressBody} onClick={onClick}>
            {done === 0 ? (
                <div className={ProgressBar.progress}>
                    <div className={ProgressBar.progressDone} style={{ opacity: 1, width: '100%', cursor: 'pointer' }}>
                        승부예측에 지금 참가해 보세요!
                    </div>
                </div>
            ) : (
                <div className={ProgressBar.progress}>
                    <div className={ProgressBar.progressDone} style={{ opacity: 1, width: `${done}%` }}>
                        {done}%
                    </div>
                </div>
            )}
        </div>
    );
};

export default function MyPage() {
    const navigate = useNavigate();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [points, setPoints] = useState(0);
    const [predictedResult, setPredictedResult] = useState(0);
    const [clubName, setClubName] = useState('');
    const [name, setName] = useState('');
    const { data, isLoading } = useFetch('/users/mypage');

    const openModal = () => {
        setIsOpenModal(true);
    };

    const closeModal = () => {
        setIsOpenModal(false);
    };

    const handlePrediction = () => {
        navigate('/prediction');
    };

    const handlePointHistory = () => {
        navigate('/pointhistory');
    };

    const handleEditUserInfo = () => {
        navigate('/edituserinfo');
    };

    useEffect(() => {
        if (data) {
            setPoints(data.point);
            setPredictedResult(data.predictedResult);
            setClubName(data.clubName);
            setName(data.name);
        };
    }, [data]);

    return (
        <> {isLoading ? (
            <Loading />
        ) : (
            <Container sx={{ my: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: 'KBO-Dia-Gothic_medium', textAlign: 'left' }}>
                    안녕하세요. <br /> {clubName}팬 <br /> {name}님!
                </Typography>

                <Box sx={{ my: 4, backgroundColor: '#0b6bcb', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '12px' }}>
                    <Typography variant="h6" sx={{ color: 'white', fontFamily: 'KBO-Dia-Gothic_medium' }}>
                        나의 포인트
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ color: 'white', fontFamily: 'KBO-Dia-Gothic_medium' }}>
                            {points}
                        </Typography>
                        <Typography variant="h6" sx={{ ml: 1, mr: 1, color: 'white', fontFamily: 'KBO-Dia-Gothic_medium' }}>
                            P
                        </Typography>
                        <IconButton onClick={handlePointHistory} sx={{ color: 'white' }}>
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Box sx={{ my: 4, backgroundColor: '#f4f4f4', p: 2, display: 'flex', flexDirection: 'column', borderRadius: '12px' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontFamily: 'KBO-Dia-Gothic_medium', mb: 2, textAlign: 'left' }}>
                        나의 예측결과
                    </Typography>
                    <Progress done={predictedResult} onClick={handlePrediction} />
                </Box>
                <Box
                    sx={{ my: 4, backgroundColor: '#f4f4f4', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '12px', fontFamily: 'KBO-Dia-Gothic_medium' }}
                >
                    <Typography variant="h6" sx={{ color: 'black', fontFamily: 'KBO-Dia-Gothic_medium' }}>
                        개인 정보 수정
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={handleEditUserInfo} sx={{ color: 'black' }}>
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Box
                    sx={{ my: 4, backgroundColor: '#f4f4f4', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '12px', fontFamily: 'KBO-Dia-Gothic_medium' }}
                >
                    <Typography variant="h6" sx={{ color: 'black', fontFamily: 'KBO-Dia-Gothic_medium' }}>
                        우리은행 계정 연동
                    </Typography>
                    <IconButton onClick={openModal} sx={{ color: 'black' }}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                    <DeepLink isOpen={isOpenModal} closeModal={closeModal} />
                </Box>
            </Container>
        )}
        </>
    );
}
