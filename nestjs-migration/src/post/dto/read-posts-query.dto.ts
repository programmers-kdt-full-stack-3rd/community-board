
export class ReadPostsQueryDto {
    index?: number = this.index -1 | 0
    perPage?: number = 10
    keyword?: string
    sortBy?: SortBy
}

export enum SortBy {
	VIEWS = 1,
	LIKES = 2,
}

