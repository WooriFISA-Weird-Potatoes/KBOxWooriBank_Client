import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import Logo from '../assets/favicon.png';
import styles from '../styles/appheader.module.css';
import api from '../util/api';

export default function AppHeader() {
    const { user, setUser } = useUser();
    const isLoggedIn = Boolean(user);
    const navigate = useNavigate();

    const handleSignUp = () => {
        navigate('/signup');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleMypage = () => {
        navigate('/mypage');
    };

    const handleNotification = () => {
        navigate('/notification');
    };

    const handleLogout = async () => {
        try {
            const response = await api.post('/users/logout');
            if (response.data.success) {
                localStorage.clear();
                sessionStorage.clear();
                setUser(null);
                navigate('/login');
            } else {
                console.log(`Logout failed: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <header className={styles.AppHeader}>
            <div className={styles.LogoContainer}>
                <Link to="/" className={styles.Logo}>
                    <img src={Logo} alt="로고" className={styles.LogoImage} />
                </Link>
            </div>
            <div className={styles.NavText}>
                {isLoggedIn ? (
                    <>
                        <div onClick={handleMypage} className={styles.NavLinks}> 마이페이지</div>
                        <div onClick={handleNotification} className={styles.NavLinks}> 알림 </div>
                        <div onClick={handleLogout} className={styles.NavLinks}>로그아웃</div>
                    </>
                ) : (
                    <>
                        <div onClick={handleSignUp} className={styles.NavLinks}>회원가입</div>
                        <div onClick={handleLogin} className={styles.NavLinks}>로그인</div>
                    </>
                )}
            </div>
        </header>
    );
}
