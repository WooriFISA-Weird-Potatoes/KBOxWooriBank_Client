import React, { useRef } from 'react';
import { Button } from '@mui/material';
import useSnackbar from '../hooks/useSnackbar';

const QuizFileUpload = () => {
    const fileInputRef = useRef(null);
    const [showSnackbar, SnackbarComponent] = useSnackbar();

    const handleQuizFileUpload = async () => {
        fileInputRef.current.click();
    };

    const handleQuizFileChange = async (e) => {
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append('file', file);
        console.log(formData);
        try {
            const response = await fetch( process.env.REACT_APP_API_URL + '/admin/upload/quiz', {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'ngrok-skip-browser-warning': true,
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
                },
                body: formData,
            });

            if (response.ok) {
                await response.json();
                showSnackbar('파일 업로드에 성공했습니다', 'success');
            } else {
                showSnackbar('파일 형식을 확인해주세요', 'error');
            }
        } catch (error) {
            console.error('파일 업로드 중 오류 발생', error);
            showSnackbar('파일 업로드 중 오류가 발생했습니다', 'error');
        }
    };

    return (
        <div>
            <input type="file" style={{ display: 'none' }} onChange={handleQuizFileChange} ref={fileInputRef} />
            <Button variant="contained" color="primary" onClick={handleQuizFileUpload}>
                파일 업로드
            </Button>
            <SnackbarComponent />
        </div>
    );
};

export default QuizFileUpload;
