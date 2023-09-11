import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useUser } from './contexts/UserContext';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import Main from './pages/Main';
import News from './pages/News';
import Schedule from './pages/Schedule';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import MyPage from './pages/MyPage';
import Notification from './pages/Notification';
import Winner from './pages/Winner';
import Prediction from './pages/Prediction';
import Quiz from './pages/Quiz';
import Event from './pages/Event';
import PointHistory from './pages/PointHistory';
import PointExchange from './pages/PointExchange';
import EditUserInfo from './pages/EditUserInfo';
import Admin from './pages/Admin';
import PrivateRoutes from './components/PrivateRoutes';
import './App.css';

function App() {
    const { user, setUser } = useUser();
    const location = useLocation();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (accessToken && refreshToken) {
            setUser({ accessToken, refreshToken });
        }
    }, [setUser]);

    const isAdminRoute = location.pathname === '/admin';

    return (
        <div className="Container">
            {!isAdminRoute ? (
                <div className="App">
                    <AppHeader />
                    <div className="Main">
                        <Routes>
                            <Route path="/" element={<Main />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/news" element={<News />} />
                            <Route path="/schedule" element={<Schedule />} />
                            <Route path="/prediction" element={<Prediction />} />
                            <Route path="/quiz" element={<Quiz />} />
                            <Route path="/event" element={<Event />} />

                            <Route element={<PrivateRoutes user={user} />}>
                                <Route path="/mypage" element={<MyPage />} />
                                <Route path="/admin" element={<Admin />} />
                                <Route path="/pointhistory" element={<PointHistory />} />
                                <Route path="/pointexchange" element={<PointExchange />} />
                                <Route path="/notification" element={<Notification />} />
                                <Route path="/edituserinfo" element={<EditUserInfo />} />
                                <Route path="/winner" element={<Winner />} />
                            </Route>
                        </Routes>
                    </div>
                    <AppFooter />
                </div>
            ) : (
                <div className="AppAdmin">
                    <Routes>
                        <Route element={<PrivateRoutes user={user} />}>
                            <Route path="/admin" element={<Admin />} />
                        </Route>
                    </Routes>
                </div>
            )}
        </div>
    );
}

export default App;
