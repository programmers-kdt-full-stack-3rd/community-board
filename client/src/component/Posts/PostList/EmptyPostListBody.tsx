import React from "react";

interface IEmptyPostListBody {
	isFetchFailed: boolean;
	keyword?: string;
}

const EmptyPostListBody: React.FC<IEmptyPostListBody> = ({
	isFetchFailed,
	keyword,
}) => {
	return (
		<div className="my-30 flex min-h-48 items-center justify-center text-center text-lg text-gray-600 dark:text-gray-500">
			<p>
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
		</div>
	);
};

export default EmptyPostListBody;
