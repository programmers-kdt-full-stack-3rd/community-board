interface EmptyUserListProps {
    isFetchFailed: boolean;
    keyword?: string;
}

export const EmptyUserList = ({
    isFetchFailed,
    keyword,
}: EmptyUserListProps) => {
    return (
        <div>
            {isFetchFailed ? (
                <p>사용자 목록을 불러오는 데 실패했습니다.</p>
            ) : keyword ? (
                <p>"{keyword}"에 대한 검색 결과가 없습니다.</p>
            ) : (
                <p>사용자가 없습니다.</p>
            )}
        </div>
    )
}