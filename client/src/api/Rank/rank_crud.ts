import { HttpMethod, httpRequest } from "../api";

export const fetchPostRank = async () => {
	const url = `rank/posts`;
	return await httpRequest(url, HttpMethod.GET);
};

export const fetchCommentRank = async () => {
	const url = `rank/comments`;
	return await httpRequest(url, HttpMethod.GET);
};

export const fetchActivitiesRank = async () => {
	const url = `rank/activities`;
	return await httpRequest(url, HttpMethod.GET);
};
