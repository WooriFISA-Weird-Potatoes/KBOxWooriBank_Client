import React, { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';
import Title from './Title';
import Loading from './Loading';
import useFetch from '../hooks/useFetch';

export default function Chart() {
    const theme = useTheme();
    const { data: weeklyData, isLoading: isLoadingWeekly, error: errorWeekly, refetch: refetchWeeklyData } = useFetch('/admin/users/weekly');
    const { data: monthlyData, isLoading: isLoadingMonthly, error: errorMonthly, refetch: refetchMonthlyData } = useFetch('/admin/users/monthly');

    useEffect(() => {
        refetchWeeklyData(); // 주간 데이터 다시 불러오기
        refetchMonthlyData(); // 월간 데이터 다시 불러오기
    }, [window.location.pathname]);

    if (isLoadingWeekly || isLoadingMonthly) {
        return <div><Loading /></div>;
    }

    if (errorWeekly || errorMonthly) {
        return <div>Error: 데이터를 불러올 수 없습니다.</div>;
    }


    return (
        <React.Fragment>
            <Title>주간 회원 수</Title>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={weeklyData} // 포인트를 포함한 데이터로 변경
                    margin={{
                        top: 16,
                        right: 16,
                        bottom: 0,
                        left: 24,
                    }}
                >
                    <XAxis
                        dataKey="createdAt"
                        stroke={theme.palette.text.secondary}
                        style={theme.typography.body2}
                    />
                    <YAxis
                        dataKey="totalUsers"
                        stroke={theme.palette.text.secondary}
                        style={theme.typography.body2}
                    >
                        <Label
                            angle={270}
                            position="left"
                            style={{
                                textAnchor: 'middle',
                                fill: theme.palette.text.primary,
                                ...theme.typography.body1,
                            }}
                        >
                            총 회원수(명)
                        </Label>
                    </YAxis>
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <Line
                        isAnimationActive={true}
                        type="monotone"
                        dataKey="totalUsers"
                        stroke="#8884d8"
                        dot={false}
                    />
                    <Line // 포인트 라인 추가
                        isAnimationActive={true}
                        type="monotone"
                        dataKey="points"
                        stroke="#82ca9d"
                        dot={false}
                    />
                    <Tooltip
                        labelStyle={{ color: 'black' }} // X 축 레이블 텍스트 스타일
                        itemStyle={{ color: 'black' }} // 각 데이터 포인트의 스타일
                        formatter={(totalUsers, name) => [`${totalUsers}명`, '총 회원수']} // 포맷 함수
                        labelFormatter={(createdAt) => `일자: ${createdAt}`} // X 축 레이블 포맷 함수
                    />
                </LineChart>
            </ResponsiveContainer>

            <Title>월간 회원 수</Title>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={monthlyData}
                    margin={{
                        top: 16,
                        right: 16,
                        bottom: 0,
                        left: 24,
                    }}
                >
                    <XAxis
                        dataKey="createdAt"
                        stroke={theme.palette.text.secondary}
                        style={theme.typography.body2}
                    />
                    <YAxis
                        dataKey="totalUsers"
                        stroke={theme.palette.text.secondary}
                        style={theme.typography.body2}
                    >
                        <Label
                            angle={270}
                            position="left"
                            style={{
                                textAnchor: 'middle',
                                fill: theme.palette.text.primary,
                                ...theme.typography.body1,
                            }}
                        >
                            총 회원수(명)
                        </Label>
                    </YAxis>
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <Line
                        isAnimationActive={true}
                        type="monotone"
                        dataKey="totalUsers"
                        stroke="#8884d8"
                        dot={false}
                    />
                    <Line
                        isAnimationActive={true}
                        type="monotone"
                        dataKey="points"
                        stroke="#82ca9d"
                        dot={false}
                    />
                    <Tooltip
                        labelStyle={{ color: 'black' }} // X 축 레이블 텍스트 스타일
                        itemStyle={{ color: 'black' }} // 각 데이터 포인트의 스타일
                        formatter={(totalUsers, name) => [`${totalUsers}명`, '총 회원수']} // 포맷 함수
                        labelFormatter={(createdAt) => `일자: ${createdAt}`} // X 축 레이블 포맷 함수
                    />
                </LineChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
}