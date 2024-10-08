import {
	TopPostsRes,
	TopCommentsRes,
	TopActivitiesRes,
} from "../../../../nestjs-migration/dist/rank/dto/rank-results.dto";

export const fetchPostRank = async () => {
	const response = await fetch("http://localhost:3000/api/rank/posts");
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}

	const data: TopPostsRes[] = await response.json();
	return data;
};

export const fetchCommentRank = async () => {
	const response = await fetch("http://localhost:3000/api/rank/comments");
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}

	const data: TopCommentsRes[] = await response.json();
	return data;
};

export const fetchActivitiesRank = async () => {
	const response = await fetch("http://localhost:3000/api/rank/activities");
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}

	const data: TopActivitiesRes[] = await response.json();
	return data;
};
