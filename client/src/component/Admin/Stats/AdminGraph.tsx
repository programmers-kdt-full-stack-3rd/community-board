import { useEffect, useRef, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	ChartOptions,
} from "chart.js";

import { getKoreanDate, subtractDays } from "../../../utils/date-to-str";
import { IntervalStat, TInterval } from "shared";
import { getChartData } from "./ChartData";
import { fetchTotalStats } from "../../../api/admin/user_crud";
import { ApiCall } from "../../../api/api";
import { ClientError } from "../../../api/errors";
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
	const [startDate, setStartDate] = useState<string>(
		getKoreanDate(subtractDays(endDate, 10))
	);
	const [interval, setInterval] = useState<TInterval>("daily");

	const [intervalStats, setIntervalStats] = useState<IntervalStat[]>([]);
	const chartRef = useRef<any>(null);

	const fetchStats = async (
		startDate: string,
		endDate: string,
		interval: TInterval
	) => {
		ApiCall(
			() => fetchTotalStats(startDate, endDate, interval),
			() => {
				setIntervalStats([]);
			}
		).then(res => {
			if (res instanceof ClientError) {
				return;
			}
		});
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
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const handleIntervalChange = (newInterval: TInterval) => {
		setInterval(newInterval);
		if (newInterval === "daily") {
			setStartDate(getKoreanDate(subtractDays(endDate, 10)));
		} else if (newInterval === "monthly") {
			setStartDate(getKoreanDate(subtractDays(endDate, 365)));
		} else if (newInterval === "yearly") {
			setStartDate(getKoreanDate(subtractDays(endDate, 1825)));
			// 임시로 5년 전 데이터까지
		}
	};

	const chartData = getChartData(interval, startDate, endDate, intervalStats);
	const chartOptions: ChartOptions<"line"> = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top",
			},
			tooltip: {
				callbacks: {
					label: function (context: any) {
						const label = context.dataset.label || "";
						return `${label}: ${context.parsed.y}`;
					},
				},
			},
		},
		scales: {
			x: {
				type: "category",
				labels: chartData.labels,
				title: {
					display: true,
					text:
						interval === "daily"
							? "일별 그래프"
							: interval === "monthly"
								? "월별 그래프"
								: "연도별 그래프",
				},
				ticks: {
					autoSkip: true,
					maxRotation: 45,
					minRotation: 45,
				},
			},
			y: {
				title: {
					display: true,
					text: "Values",
				},
			},
		},
	};
	const barChartOptions: ChartOptions<"bar"> = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top",
			},
			tooltip: {
				callbacks: {
					label: function (context: any) {
						const label = context.dataset.label || "";
						return `${label}: ${context.parsed.y}`;
					},
				},
			},
		},
		scales: {
			x: {
				type: "category",
				labels: chartData.barData.labels,
				title: {
					display: true,
					text:
						interval === "daily"
							? "일별 그래프"
							: interval === "monthly"
								? "월별 그래프"
								: "연도별 그래프",
				},
				ticks: {
					autoSkip: true,
					maxRotation: 45,
					minRotation: 45,
				},
			},
			y: {
				title: {
					display: true,
					text: "Values",
				},
			},
		},
	};

	return (
		<div>
			<div className="m-4 flex w-full flex-col items-center">
				<div className="mt-12 flex h-auto w-full flex-col items-center justify-center">
					<h2 className="mb-4 text-2xl font-bold">Graph</h2>
					<div className="mb-8 grid grid-cols-[3fr_1fr_3fr_1fr_3fr]">
						<button
							onClick={() => handleIntervalChange("daily")}
							className="cursor-pointer border-0 bg-transparent px-5 py-2 text-lg shadow-md outline-none transition-colors duration-300 ease-in-out hover:bg-black hover:bg-opacity-10 hover:shadow-lg focus:outline-none active:bg-black active:bg-opacity-20 active:shadow-md"
						>
							Day
						</button>
						<p />
						<button
							onClick={() => handleIntervalChange("monthly")}
							className="cursor-pointer border-0 bg-transparent px-5 py-2 text-lg shadow-md outline-none transition-colors duration-300 ease-in-out hover:bg-black hover:bg-opacity-10 hover:shadow-lg focus:outline-none active:bg-black active:bg-opacity-20 active:shadow-md"
						>
							Month
						</button>
						<p />
						<button
							onClick={() => handleIntervalChange("yearly")}
							className="cursor-pointer border-0 bg-transparent px-5 py-2 text-lg shadow-md outline-none transition-colors duration-300 ease-in-out hover:bg-black hover:bg-opacity-10 hover:shadow-lg focus:outline-none active:bg-black active:bg-opacity-20 active:shadow-md"
						>
							Year
						</button>
					</div>
				</div>

				<div className="mx-10 flex flex-col items-center md:flex-row">
					<div className="mx-4 flex w-full flex-col items-start justify-center md:flex-row">
						<div className="mb-4 md:mb-0 md:mr-4">
							<Line
								className="h-[400px] w-[800px] md:w-[500px]"
								data={chartData.lineData}
								options={chartOptions}
							/>
						</div>
						<div>
							<Bar
								className="h-[400px] w-[800px] md:w-[500px]"
								data={chartData.barData}
								options={barChartOptions}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
