interface IEmptyPostListBody {
	className?: string;
	isFetchFailed: boolean;
	keyword?: string;
}

const EmptyPostListBody = ({
	className,
	isFetchFailed,
	keyword,
}: IEmptyPostListBody) => {
	return (
		<p className={className}>
			{isFetchFailed ? (
				"게시글을 불러오지 못했습니다."
			) : keyword ? (
				<>“{keyword}”에 대한 검색 결과가 없습니다.</>
			) : (
				<>
					아직 게시글이 없습니다.
					<br />첫 게시글을 작성해 보세요.
				</>
			)}
		</p>
	);
};

export default EmptyPostListBody;
