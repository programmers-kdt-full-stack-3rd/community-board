import { useEffect, useRef, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, ChartOptions } from 'chart.js';
import { BtnStyle, GraphContainer, GraphContainer2, GraphStyle, MainTitle, StatsBtn, StatsLine, StatsStyle, StatsTotal } from "./Stats.css";
import { FaBookOpen, FaUser } from "react-icons/fa";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { HiCursorClick } from "react-icons/hi";
import { StatsIcon } from "../UserLog/UserLog.css";
import { getKoreanDate, subtractDays } from "../../../utils/date-to-str";
import { IntervalStat, IStats, TInterval } from "shared";
import { fetchTotalStats } from "./Stats";
import { getChartData } from "./ChartData";
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    BarElement
);

export const AdminGraph = () => {
    const endDate = getKoreanDate(new Date());
    const [startDate, setStartDate] = useState<string>(getKoreanDate(subtractDays(endDate, 10)));
    const [interval, setInterval] = useState<TInterval>('daily');
    const [totalStats, setTotalStats] = useState<IStats>({ posts: 0, comments: 0, views: 0, users: 0 });
    const [intervalStats, setIntervalStats] = useState<IntervalStat[]>([]);
    const chartRef = useRef<any>(null);

    const fetchStats = async (startDate: string, endDate: string, interval: TInterval) => {
        try {
            const response = await fetchTotalStats(startDate, endDate, interval);
            console.log("Fetch Response:", response);
            setTotalStats(response.totalStats || { posts: 0, comments: 0, views: 0, users: 0 });
            setIntervalStats(response.intervalStats || []);
        } catch (error) {
            console.error("데이터를 가져오는 중 오류가 발생했습니다:", error);
        }
    };

    useEffect(() => {
        fetchStats(startDate, endDate, interval);
    }, [startDate, endDate, interval]);

    useEffect(() => {
        const handleResize = () => {
            if (chartRef.current) {
                chartRef.current.chartInstance.resize();
            }
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleIntervalChange = (newInterval: TInterval) => {
        setInterval(newInterval);
        if (newInterval === 'daily') {
            setStartDate(getKoreanDate(subtractDays(endDate, 10)));
        } else if (newInterval === 'monthly') {
            setStartDate(getKoreanDate(subtractDays(endDate, 365)));
        } else if (newInterval === 'yearly') {
            setStartDate(getKoreanDate(subtractDays(endDate, 1825)));
            // 임시로 5년 전 데이터까지
        }
    };

    const chartData = getChartData(interval, startDate, endDate, intervalStats)
    const chartOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const label = context.dataset.label || '';
                        return `${label}: ${context.parsed.y}`;
                    }
                }
            },
        },
        scales: {
            x: {
                type: 'category',
                labels: chartData.labels,
                title: {
                    display: true,
                    text: interval === 'daily' ? '일별 그래프' :
                        interval === 'monthly' ? '월별 그래프' :
                            '연도별 그래프'
                },
                ticks: {
                    autoSkip: true,
                    maxRotation: 45,
                    minRotation: 45
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Values'
                }
            }
        }
    };
    const barChartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const label = context.dataset.label || '';
                        return `${label}: ${context.parsed.y}`;
                    }
                }
            },
        },
        scales: {
            x: {
                type: 'category',
                labels: chartData.barData.labels,
                title: {
                    display: true,
                    text: interval === 'daily' ? '일별 그래프' :
                        interval === 'monthly' ? '월별 그래프' :
                            '연도별 그래프'
                },
                ticks: {
                    autoSkip: true,
                    maxRotation: 45,
                    minRotation: 45
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Values'
                }
            }
        }
    };

    return (
        <div>
            <div className={StatsStyle}>
                <div>
                    <h3 className={MainTitle}>Total Stats {endDate}</h3>
                    <div className={StatsTotal}>
                        <div>
                            <HiCursorClick className={StatsIcon} />
                            <h2>{totalStats.views}</h2>
                            조회수
                        </div>
                        <hr className={StatsLine} />
                        <div>
                            <FaBookOpen className={StatsIcon} />
                            <h2>{totalStats.posts}</h2>
                            게시글 수
                        </div>
                        <hr className={StatsLine} />
                        <div>
                            <IoChatbubbleEllipsesSharp className={StatsIcon} />
                            <h2>{totalStats.comments}</h2>
                            댓글 수
                        </div>
                        <hr className={StatsLine} />
                        <div>
                            <FaUser className={StatsIcon} />
                            <h2>{totalStats.users}</h2>
                            회원 수
                        </div>
                    </div>
                </div>

                <div className={GraphContainer}>
                    <h2>Statistics</h2>
                    <div className={BtnStyle}>
                        <button onClick={() => handleIntervalChange('daily')} className={StatsBtn}>Day</button>
                        <p />
                        <button onClick={() => handleIntervalChange('monthly')} className={StatsBtn}>Month</button>
                        <p />
                        <button onClick={() => handleIntervalChange('yearly')} className={StatsBtn}>Year</button>
                    </div>

                </div>

                <div className={GraphContainer2}>
                    <div className={GraphStyle}>
                        <h3>-Data Stats-</h3>
                        <Line data={chartData.lineData} options={chartOptions} />
                    </div>
                    <br></br>

                    <div className={GraphStyle}>
                        <h3>-User Stats-</h3>
                        <Bar data={chartData.barData2} options={barChartOptions} />
                    </div>

                    <div className={GraphStyle}>
                        <h3>-Total Stats-</h3>
                        <Bar data={chartData.barData} options={barChartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};
