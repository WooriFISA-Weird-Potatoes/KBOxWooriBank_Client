import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MyCarousel from '../components/MyCarousel';
import TodaySchedule from '../components/TodaySchedule';
import Loading from "../components/Loading";
import styles from '../styles/main.module.css';
import useFetch from '../hooks/useFetch';

export default function Main() {
    const navigate = useNavigate();
    const { data: newsData, isLoading: isLoadingNews } = useFetch('/crawling/news');
    const { data: rankings, isLoading: isLoadingRankings } = useFetch('/crawling/main/rankings');
    const { data: games, isLoading: isLoadingGames } = useFetch('/crawling/main/schedules');

    const isLoading = isLoadingNews || isLoadingRankings || isLoadingGames;

    const handleNewsViewMore = () => {
        navigate('/news');
    };

    const handleScheduleViewMore = () => {
        navigate('/schedule');
    };

    const lastItemIndex = 3;
    const firstItemIndex = 0;
    const currentItems = newsData ? newsData.slice(firstItemIndex, lastItemIndex) : [];

    return (
        <> {isLoading ? (
            <Loading />
        ) : (
            <>
                <div className={styles.BannerContainer}>
                    <MyCarousel />
                </div>

                <main className={styles.AppMain}>
                    <div className={styles.buttonContainer}>
                        <Link to="/prediction" className={styles.customButton}>
                            승 부 예 측
                        </Link>
                        <Link to="/quiz" className={styles.customButton}>
                            퀴  즈
                        </Link>
                        <Link to="/event" className={styles.customButton}>
                            선 착 순
                        </Link>
                    </div>

                    <div className={styles.infoSection}>
                        <div className={styles.infoHeader} onClick={handleNewsViewMore}>
                            <h2>최신뉴스</h2>
                            <h2 className={styles.viewMore}>
                                <span className="material-symbols-outlined">arrow_forward_ios</span>
                            </h2>
                        </div>
                        {currentItems.map((item, index) => (
                            <a href={item.articleLink} target="_blank" rel="noopener noreferrer" key={index}>
                                <div className={styles.newsItem}>
                                    <img src={item.imgLink} alt={item.headline} className={styles.newsImage} />
                                    <div className={styles.newsText}>
                                        <p>{item.headline}</p>
                                        <small>{item.date}</small>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                    <div className={styles.infoSection}>
                        <div className={styles.infoHeader} onClick={handleScheduleViewMore}>
                            <h2>경기 일정</h2>
                            <h2 className={styles.viewMore}>
                                <span className="material-symbols-outlined" alt=">">arrow_forward_ios</span>
                            </h2>
                        </div>
                        <div>
                            {games.map((game) => (
                                <TodaySchedule key={game.id} game={game} />
                            ))}
                        </div>
                    </div>
                    <div className={styles.infoSection}>
                        <div className={styles.infoHeaderRankings}>
                            <h2>구단 순위</h2>
                        </div>
                        <table>
                            <colgroup>
                                <col width="10%" />
                                <col width="19.5%" />
                                <col width="15%" />
                                <col width="8.5%" />
                                <col width="8.5%" />
                                <col width="8.5%" />
                                <col width="15%" />
                                <col width="15%" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>순위</th>
                                    <th>구단</th>
                                    <th>경기수</th>
                                    <th>승</th>
                                    <th>패</th>
                                    <th>무</th>
                                    <th>승률</th>
                                    <th>게임차</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rankings.map((ranking, index) => (
                                    <tr key={index}>
                                        <td>{ranking.rank}</td>
                                        <td className={styles.tdTeam}>
                                            <img src={ranking.teamLogo} alt={`${ranking.teamName} 로고`} />
                                            {ranking.teamName}
                                        </td>
                                        <td>{ranking.gamesPlayed}</td>
                                        <td>{ranking.wins}</td>
                                        <td>{ranking.losses}</td>
                                        <td>{ranking.draws}</td>
                                        <td>{ranking.winningPercentage}</td>
                                        <td>{ranking.gameBehind}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </>
        )
        }
        </>
    );
}
