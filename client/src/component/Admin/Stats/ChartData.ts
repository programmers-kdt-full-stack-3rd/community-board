import { IntervalStat } from "shared";
import { addDays, getKoreanDate } from "../../../utils/date-to-str";

const accumulateStats = (
	intervalStats: IntervalStat[],
	dateKey: string,
	formattedDate: string
) => {
	let accumulatedData = {
		comments: 0,
		views: 0,
		users: 0,
		posts: 0,
	};

	intervalStats.forEach(
		(stat: {
			date: string;
			comments: number;
			views: number;
			users: number;
			posts: number;
		}) => {
			const statDate = stat.date.slice(0, dateKey.length);
			if (statDate === formattedDate) {
				accumulatedData.comments += stat.comments;
				accumulatedData.views += stat.views;
				accumulatedData.users += stat.users;
				accumulatedData.posts += stat.posts;
			}
		}
	);

	return accumulatedData;
};

export const getChartData = (
	interval: string,
	startDate: string,
	endDate: string,
	intervalStats: IntervalStat[]
) => {
	const labels: string[] = [];
	const data = {
		comments: [] as number[],
		views: [] as number[],
		users: [] as number[],
		posts: [] as number[],
	};

	// 일별 데이터를 처리하는 함수
	const processDailyData = () => {
		let currentDate = new Date(startDate);
		const endDateLimit = new Date(endDate);

		while (currentDate <= endDateLimit) {
			const formattedDate = getKoreanDate(currentDate);
			labels.push(formattedDate);

			const dailyData = accumulateStats(
				intervalStats,
				"YYYY-MM-DD",
				formattedDate
			);

			data.comments.push(dailyData.comments);
			data.views.push(dailyData.views);
			data.users.push(dailyData.users);
			data.posts.push(dailyData.posts);

			currentDate = addDays(currentDate, 1);
		}
	};

	// 월별 데이터를 처리하는 함수
	const processMonthlyData = () => {
		let currentMonth = new Date(startDate);
		const endDateLimit = new Date(endDate);

		while (
			currentMonth.getFullYear() < endDateLimit.getFullYear() ||
			(currentMonth.getFullYear() === endDateLimit.getFullYear() &&
				currentMonth.getMonth() <= endDateLimit.getMonth())
		) {
			const formattedDate = `${currentMonth.getFullYear()}-${String(
				currentMonth.getMonth() + 1
			).padStart(2, "0")}`;
			labels.push(formattedDate);

			const monthlyData = accumulateStats(
				intervalStats,
				"YYYY-MM",
				formattedDate
			);

			data.comments.push(monthlyData.comments);
			data.views.push(monthlyData.views);
			data.users.push(monthlyData.users);
			data.posts.push(monthlyData.posts);

			currentMonth.setMonth(currentMonth.getMonth() + 1);
		}
	};

	// 연별 데이터를 처리하는 함수
	const processYearlyData = () => {
		let currentYear = new Date(startDate);
		const endDateLimit = new Date(endDate);

		while (currentYear.getFullYear() <= endDateLimit.getFullYear()) {
			const formattedDate = `${currentYear.getFullYear()}`;
			labels.push(formattedDate);

			const yearlyData = accumulateStats(
				intervalStats,
				"YYYY",
				formattedDate
			);

			data.comments.push(yearlyData.comments);
			data.views.push(yearlyData.views);
			data.users.push(yearlyData.users);
			data.posts.push(yearlyData.posts);

			currentYear.setFullYear(currentYear.getFullYear() + 1);
		}
	};

	if (interval === "daily") {
		processDailyData();
	} else if (interval === "monthly") {
		processMonthlyData();
	} else if (interval === "yearly") {
		processYearlyData();
	}

	return {
		labels,
		lineData: {
			datasets: [
				{
					label: "Posts",
					data: data.posts,
					borderColor: "rgba(255, 99, 132, 1)",
					backgroundColor: "rgba(255, 99, 132, 0.2)",
					fill: false,
				},
				// {
				// 	label: "Views",
				// 	data: data.views,
				// 	borderColor: "rgba(75, 192, 192, 1)",
				// 	backgroundColor: "rgba(75, 192, 192, 0.2)",
				// 	fill: false,
				// },
				{
					label: "Users",
					data: data.users,
					backgroundColor: "rgba(0, 0, 0, 0)",
					borderColor: "rgba(153, 102, 255, 1)",
					fill: false,
				},
				{
					label: "Comments",
					data: data.comments,
					backgroundColor: "rgba(255, 159, 64, 0.5)",
					borderColor: "rgba(255, 159, 64, 1)",
					fill: false,
				},
			],
		},
		barData: {
			labels,
			datasets: [
				{
					label: "Posts",
					data: data.posts,
					backgroundColor: "rgba(255, 99, 132, 0.5)",
					borderColor: "rgba(255, 99, 132, 1)",
					stack: "stack1",
				},
				// {
				// 	label: "Views",
				// 	data: data.views,
				// 	backgroundColor: "rgba(75, 192, 192, 0.5)",
				// 	borderColor: "rgba(75, 192, 192, 1)",
				// 	stack: "stack1",
				// },
				{
					label: "Comments",
					data: data.comments,
					backgroundColor: "rgba(255, 159, 64, 0.5)",
					borderColor: "rgba(255, 159, 64, 1)",
					stack: "stack1",
				},
				{
					label: "Users",
					data: data.users,
					backgroundColor: "rgba(153, 102, 255, 0.5)",
					borderColor: "rgba(153, 102, 255, 1)",
					stack: "stack1",
				},
			],
		},
	};
};
