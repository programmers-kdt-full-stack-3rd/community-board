
export class ReadPostsQueryDto {
    index?: number = 0
    perPage?: number = 10
    keyword?: string
    sortBy?: SortBy
}

export enum SortBy {
	VIEWS = 1,
	LIKES = 2,
}

