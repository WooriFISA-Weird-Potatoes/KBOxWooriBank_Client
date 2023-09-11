import React, { useState } from "react";
import useFetch from '../hooks/useFetch';
import { Typography, Box, Container } from "@mui/material";
import Loading from '../components/Loading';
import BackButton from "../components/BackButton";
import useSnackbar from '../hooks/useSnackbar';
import styles from '../styles/news.module.css';

export default function News() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSnackbar, SnackbarComponent] = useSnackbar();
    const itemsPerPage = 6;
    const { data: newsData, isLoading, refetch } = useFetch('/crawling/news');

    const handleSearch = () => {
        if (searchTerm.length < 2) {
            showSnackbar('최소 2글자 이상 검색어를 입력하세요.', 'error');
            return;
        }

        const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(searchTerm);

        if (hasSpecialChar) {
            showSnackbar('특수문자는 사용할 수 없습니다.', 'error');
            return;
        }

        const sanitizedTerm = searchTerm.replace(/[^a-zA-Z0-9가-힣\s]/g, '');

        if (sanitizedTerm.trim().length < 2) {
            showSnackbar('최소 2글자 이상 검색어를 입력하세요.', 'error');
            return;
        }

        refetch(`/crawling/news/${sanitizedTerm}`);
    };


    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const currentItems = newsData ? newsData.slice(firstItemIndex, lastItemIndex) : [];

    return (
        <>
            <Container>
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <BackButton />
                    <Typography component="h1" variant="h5" sx={{ margin: 'auto', fontFamily: 'KBO-Dia-Gothic_medium' }}>
                        최신 뉴스
                    </Typography>
                    <div style={{ minWidth: '28px' }}></div>
                </Box>
                <div className={styles.searchBar}>
                    <input
                        type="text"
                        placeholder="검색어 입력"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                    />
                    <button onClick={handleSearch}>
                        <img
                            src="https://s3.ap-northeast-2.amazonaws.com/cdn.wecode.co.kr/icon/search.png"
                            alt="검색"
                        />
                    </button>
                </div>
                <div className={styles.section}>
                    {isLoading ? (
                        <Loading />
                    ) : newsData.length === 0 ? (
                        <div className={styles.noSearch}>
                            <img
                                src="https://media.istockphoto.com/id/165695622/ko/%EB%B2%A1%ED%84%B0/%EA%B5%AC%EC%A1%B0-%ED%99%88%EB%9F%B0.jpg?s=170667a&w=0&k=20&c=a3QCID3_2MwvPv6trD7517r_rarakX_MTf4RJ0Zo41o="
                                alt=""
                            />
                            <p>검색된 결과가 없습니다.</p>
                            <p>검색어를 다시 입력해주세요.</p>
                        </div>
                    ) : (
                        currentItems.map((item, index) => (
                            <a
                                href={item.articleLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={index}
                            >
                                <div className={styles.newsItem}>
                                    <img
                                        src={item.imgLink}
                                        alt={item.headline}
                                        className={styles.newsImage}
                                    />
                                    <div className={styles.headline}>{item.headline}</div>
                                    <div className={styles.preview}>{item.contentPreview}</div>
                                    <small className={styles.date}>{item.date}</small>
                                </div>
                            </a>
                        ))
                    )}
                </div>

                <div className={styles.pagination}>
                    {Array.from(
                        { length: Math.ceil(newsData.length / itemsPerPage) },
                        (_, i) => (
                            <button
                                key={i}
                                className={`${styles.pageButton} ${currentPage === i + 1 ? styles.currentPage : ""
                                    }`}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        )
                    )}
                </div>
                <SnackbarComponent />
            </Container>
        </>
    );
}
