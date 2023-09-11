import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIos';
const BackButton = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    return (
        <Button onClick={goBack} sx={{ color: 'black', padding: 0, minWidth: '24px', marginLeft: '4px' }}>
            <ArrowBackIosNew />
        </Button>
    );
};

export default BackButton;
