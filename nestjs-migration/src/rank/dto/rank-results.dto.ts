export class TopPostsRes {
	title: string;
	nickname: string;
	likeCount: number;
}

export class TopCommentsRes {
	nickname: string;
	likeCount: number;
}

export class TopActivitiesRes {
	nickname: string;
	postCount: number;
	commentCount: number;
}
