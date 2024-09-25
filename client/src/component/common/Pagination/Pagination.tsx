import clsx from "clsx";
import {
	FiChevronLeft,
	FiChevronRight,
	FiChevronsLeft,
	FiChevronsRight,
} from "react-icons/fi";
import { clamp } from "../../../utils/clamp";
import { pageButton, paginationStyle } from "./Pagination.css";
import Button from "../Button";

interface IPaginationProps {
	currentPage: number;
	totalPosts: number;
	perPage: number;
	onChange: (page: number) => void;
}

const Pagination = ({
	currentPage,
	totalPosts,
	perPage,
	onChange,
}: IPaginationProps) => {
	const actualTotalPosts = Math.max(1, totalPosts);
	const actualPerPage = Math.max(1, perPage);
	const totalPages = Math.ceil(actualTotalPosts / actualPerPage);

	const actualCurrentPage = clamp(1, currentPage, totalPages);
	const currentGroupIndex = Math.floor((actualCurrentPage - 1) / 10);
	const currentGroupFirstPage = currentGroupIndex * 10 + 1;
	const currentGroupSize = Math.min(
		10,
		totalPages - currentGroupFirstPage + 1
	);

	const prevGroupLastPage = Math.max(1, currentGroupFirstPage - 1);
	const nextGroupFirstPage = Math.min(totalPages, currentGroupFirstPage + 10);

	const handlePageClickWith = (page: number) => () => {
		onChange(page);
	};

	return (
		<div className={paginationStyle}>
			<Button
				variant="text"
				size="medium"
				color="neutral"
				onClick={handlePageClickWith(1)}
			>
				<FiChevronsLeft />
			</Button>

			<Button
				variant="text"
				size="medium"
				color="neutral"
				onClick={handlePageClickWith(prevGroupLastPage)}
			>
				<FiChevronLeft />
			</Button>

			{Array.from({ length: currentGroupSize }, (_, index) => (
				<Button
					variant="text"
					key={currentGroupFirstPage + index}
					className={clsx(pageButton, {
						"text-white":
							currentGroupFirstPage + index === actualCurrentPage,
					})}
					onClick={handlePageClickWith(currentGroupFirstPage + index)}
				>
					{currentGroupFirstPage + index}
				</Button>
			))}

			<Button
				variant="text"
				size="medium"
				color="neutral"
				onClick={handlePageClickWith(nextGroupFirstPage)}
			>
				<FiChevronRight />
			</Button>

			<Button
				variant="text"
				size="medium"
				color="neutral"
				onClick={handlePageClickWith(totalPages)}
			>
				<FiChevronsRight />
			</Button>
		</div>
	);
};

export default Pagination;
