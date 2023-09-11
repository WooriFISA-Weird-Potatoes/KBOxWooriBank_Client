import React, { useState, useEffect } from 'react';
import styles from '../styles/appfooter.module.css';

export default function AppFooter() {
    const [bottomBarHeight, setBottomBarHeight] = useState(0);

    useEffect(() => {
        const actualHeight = window.innerHeight;
        const viewportHeight = document.documentElement.clientHeight;
        const calculatedBottomBarHeight = actualHeight - viewportHeight;
        setBottomBarHeight(calculatedBottomBarHeight);
    }, []);

    const footerStyle = {
        bottom: `${bottomBarHeight}px`
    };

    return (
        <footer className={styles.AppFooter} style={footerStyle}>
            <div>
                <a target="_blank" rel='noopener noreferrer' href='https://github.com/WooriFISA-Weird-Potatoes' >
                    <img src="https://cdn-icons-png.flaticon.com/512/536/536452.png" alt="" className={styles.gitImg} />
                </a>
            </div>
            <div>
                <p>© 2023 이상한감자들 🥔 </p>
            </div>
        </footer>
    );
}
