import React, { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, CartesianGrid } from 'recharts';
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
            <ResponsiveContainer>
                <LineChart
                    data={weeklyData}
                    width={500}
                    height={300}
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
                </LineChart>
            </ResponsiveContainer>

            <Title>월간 회원 수</Title>
            <ResponsiveContainer>
                <LineChart
                    data={monthlyData}
                    width={500}
                    height={300}
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
                        stroke={theme.palette.primary.main}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
}