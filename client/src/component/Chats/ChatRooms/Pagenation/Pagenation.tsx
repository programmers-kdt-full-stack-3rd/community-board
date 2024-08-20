import { Dispatch, FC, SetStateAction, useLayoutEffect, useState } from "react";

import { activePage, container, page } from "./pagenation.css";
import clsx from "clsx";

interface IPagenationProps {
	total: number;
	curPage: number;
	setCurPage: Dispatch<SetStateAction<number>>;
	onPageClick: (index: number) => void;
}

const Pagenation: FC<IPagenationProps> = ({
	total,
	curPage,
	setCurPage,
	onPageClick,
}) => {
	const [pageIndexs, setPageIndexs] = useState<number[][]>([[]]);
	const [curPageListIndex, setCurPageListIndex] = useState<number>(0);

	useLayoutEffect(() => {
		// 페이지 리스트 만들기
		const result = [];

		let temp = [];
		for (let i = 1; i <= total / 2; i++) {
			temp.push(i);

			// 각 페이지는 5개가 default
			if (temp.length === 5) {
				result.push(temp);
				temp = [];
			}
		}

		// 남은 페이지 push
		if (temp.length > 0) result.push(temp);

		setPageIndexs(result);
		setCurPageListIndex(0);
		setCurPage(1);
	}, []);

	// pre or next Click
	const onPageListClick = (isNext: boolean) => () => {
		if (isNext) {
			const nextPageListIndex = curPageListIndex + 1;
			setCurPage(pageIndexs[nextPageListIndex][0]);
			setCurPageListIndex(nextPageListIndex);
		} else {
			const prePageListIndex = curPageListIndex - 1;
			setCurPage(pageIndexs[prePageListIndex][0]);
			setCurPageListIndex(prePageListIndex);
		}
	};

	return (
		<div className={container}>
			{curPageListIndex > 0 ? (
				<span
					className={page}
					onClick={onPageListClick(false)}
				>
					{"<"}
				</span>
			) : null}
			{pageIndexs![curPageListIndex!].map((pageIndex, index) => (
				<span
					key={index}
					className={clsx(page, {
						[activePage]: pageIndex === curPage,
					})}
					onClick={() => onPageClick(pageIndex)}
				>
					{pageIndex}
				</span>
			))}
			{curPageListIndex < pageIndexs.length - 1 ? (
				<span
					className={page}
					onClick={onPageListClick(true)}
				>
					{">"}
				</span>
			) : null}
		</div>
	);
};

export default Pagenation;
