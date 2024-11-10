export class TopPostsRes {
	title: string;
	postId: number;
	nickname: string;
	likeCount: number;
}

export class TopCommentsRes {
	nickname: string;
	commentId: number;
	postId: number;
	likeCount: number;
}

export class TopActivitiesRes {
	nickname: string;
	postCount: number;
	commentCount: number;
}
