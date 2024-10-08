import { IntervalStat } from "shared";
import { addDays, getKoreanDate } from "../../../utils/date-to-str";
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

	if (interval === "daily") {
		let currentDate = new Date(startDate);
		const endDateLimit = new Date(endDate);

		while (currentDate <= endDateLimit) {
			const formattedDate = getKoreanDate(currentDate);
			labels.push(formattedDate);

			let dailyData = {
				comments: 0,
				views: 0,
				users: 0,
				posts: 0,
			};

			intervalStats.forEach(
				(stat: {
					date: string;
					comments: any;
					views: any;
					users: any;
					posts: any;
				}) => {
					if (stat.date === formattedDate) {
						dailyData.comments = Number(stat.comments);
						dailyData.views = Number(stat.views);
						dailyData.users = Number(stat.users);
						dailyData.posts = Number(stat.posts);
					}
				}
			);

			data.comments.push(dailyData.comments);
			data.views.push(dailyData.views);
			data.users.push(dailyData.users);
			data.posts.push(dailyData.posts);
			currentDate = addDays(currentDate, 1);
		}
	} else if (interval === "monthly") {
		// monthly 데이터
		let currentMonth = new Date(startDate);
		const endDateLimit = new Date(endDate);

		while (
			currentMonth.getFullYear() < endDateLimit.getFullYear() ||
			(currentMonth.getFullYear() === endDateLimit.getFullYear() &&
				currentMonth.getMonth() <= endDateLimit.getMonth())
		) {
			const formattedDate = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`; // 'YYYY-MM' 형식
			labels.push(formattedDate);

			let accumulatedData = {
				comments: 0,
				views: 0,
				users: 0,
				posts: 0,
			};

			intervalStats.forEach(
				(stat: {
					date: string;
					comments: any;
					views: any;
					users: any;
					posts: any;
				}) => {
					const statMonth = stat.date.slice(0, 7);
					if (statMonth === formattedDate) {
						accumulatedData.comments += Number(stat.comments);
						accumulatedData.views += Number(stat.views);
						accumulatedData.users += Number(stat.users);
						accumulatedData.posts += Number(stat.posts);
					}
				}
			);

			data.comments.push(accumulatedData.comments);
			data.views.push(accumulatedData.views);
			data.users.push(accumulatedData.users);
			data.posts.push(accumulatedData.posts);

			currentMonth.setMonth(currentMonth.getMonth() + 1);
		}
	} else if (interval === "yearly") {
		// yearly 데이터
		let currentYear = new Date(startDate);
		const endDateLimit = new Date(endDate);

		while (currentYear.getFullYear() <= endDateLimit.getFullYear()) {
			const formattedDate = `${currentYear.getFullYear()}`;
			labels.push(formattedDate);

			let accumulatedData = {
				comments: 0,
				views: 0,
				users: 0,
				posts: 0,
			};

			intervalStats.forEach(
				(stat: {
					date: string;
					comments: any;
					views: any;
					users: any;
					posts: any;
				}) => {
					const statYear = stat.date.slice(0, 4);
					if (statYear === formattedDate) {
						accumulatedData.comments += Number(stat.comments);
						accumulatedData.views += Number(stat.views); // Ensure views are converted to number
						accumulatedData.users += Number(stat.users);
						accumulatedData.posts += Number(stat.posts);
					}
				}
			);

			data.comments.push(accumulatedData.comments);
			data.views.push(accumulatedData.views);
			data.users.push(accumulatedData.users);
			data.posts.push(accumulatedData.posts);

			currentYear.setFullYear(currentYear.getFullYear() + 1);
		}
	}

	return {
		labels,
		// 데이터 통계
		lineData: {
			datasets: [
				{
					label: "Posts",
					data: data.posts,
					borderColor: "rgba(255, 99, 132, 1)",
					backgroundColor: "rgba(255, 99, 132, 0.2)",
					fill: false,
				},
				{
					label: "Views",
					data: data.views,
					borderColor: "rgba(75, 192, 192, 1)",
					backgroundColor: "rgba(75, 192, 192, 0.2)",
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
		// 전체 통계
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
				{
					label: "Views",
					data: data.views,
					backgroundColor: "rgba(75, 192, 192, 0.5)",
					borderColor: "rgba(75, 192, 192, 1)",
					stack: "stack1",
				},
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
		// 유저 통계
		barData2: {
			labels,
			datasets: [
				{
					label: "Users",
					data: data.users,
					backgroundColor: "rgba(0, 0, 0, 0)",
					borderColor: "rgba(153, 102, 255, 1)",
					borderWidth: 2,
				},
			],
		},
	};
};
