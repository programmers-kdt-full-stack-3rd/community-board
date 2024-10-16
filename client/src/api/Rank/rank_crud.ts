const VITE_SERVER_ADDRESS = import.meta.env.VITE_SERVER_ADDRESS;

export const fetchPostRank = async () => {
	const response = await fetch(`${VITE_SERVER_ADDRESS}/api/rank/posts`);
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}

	const data = await response.json();
	return data;
};

export const fetchCommentRank = async () => {
	const response = await fetch(`${VITE_SERVER_ADDRESS}/api/rank/comments`);
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}

	const data = await response.json();
	return data;
};

export const fetchActivitiesRank = async () => {
	const response = await fetch(`${VITE_SERVER_ADDRESS}/api/rank/activities`);
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}

	const data = await response.json();
	return data;
};
