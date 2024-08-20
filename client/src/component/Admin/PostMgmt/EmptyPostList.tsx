interface EmptyPostListrops {
    isFetchFailed: boolean;
    keyword?: string;
}

export const EmptyPostList = ({
    isFetchFailed,
    keyword,
}: EmptyPostListrops) => {
    return (
        <div>
            {isFetchFailed ? (
                <p>게시글 목록을 불러오는 데 실패했습니다.</p>
            ) : keyword ? (
                <p>"{keyword}"에 대한 검색 결과가 없습니다.</p>
            ) : (
                <p>빈 게시판입니다.</p>
            )}
        </div>
    )
}