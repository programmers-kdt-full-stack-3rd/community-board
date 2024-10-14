import { useMemo } from "react";

export type TCategory = {
	/** @property DB상의 카테고리 ID. */
	id: number;

	/** @property DB상의 카테고리 이름. */
	name: string;

	/**
	 * @property
	 * - URL 공통 라우팅 이하의 경로.
	 * - 예를 들어, `/category` 이하에 공통으로 라우팅하기로 했을 때
	 * 이 필드를 `community`로 세팅했다면 `/category/community`로 라우팅됨.
	 */
	subPath: string;

	/** @property 헤더 노출 순서. 정의하지 않으면 노출하지 않음. */
	headerOrder?: number;

	/** @property 카테고리 소개/설명 문구. 정의하지 않으면 카테고리 이름만 노출. */
	description?: string;
};

const categories: TCategory[] = [
	{
		id: 1,
		name: "자유게시판",
		subPath: "community",
		headerOrder: 1,
		description: "자유롭게 글을 작성해 보세요.",
	},
	{
		id: 2,
		name: "공지",
		subPath: "notice",
		headerOrder: 5,
	},
	{
		id: 3,
		name: "QnA",
		subPath: "qna",
		headerOrder: 2,
		description: "질문을 작성하고 다른 사람의 질문에 답변해 보세요.",
	},
	{
		id: 4,
		name: "팀원모집",
		subPath: "crew",
		headerOrder: 3,
	},
	{
		id: 5,
		name: "[버그/이슈] 게시판",
		subPath: "achievement",
		headerOrder: 4,
		description:
			"발생한 버그나 이슈를 기록하고 다른 사용자와 공유해 보세요.",
	},
];

const headerCategories = (
	categories.filter(
		item => typeof item.headerOrder === "number"
	) as Required<TCategory>[]
).sort((a, b) => a.headerOrder - b.headerOrder);

const getCategoryById = (id: number): TCategory | null =>
	categories.find(category => category.id === id) ?? null;

const getCategoryByName = (name: string): TCategory | null =>
	categories.find(category => category.name === name) ?? null;

const getCategoryBySubPath = (subpath: string): TCategory | null =>
	categories.find(category => category.subPath === subpath) ?? null;

const useCategory = (categoryIdOrName?: number | string) => {
	const currentCategory: TCategory | null = useMemo(() => {
		if (typeof categoryIdOrName === "number") {
			return getCategoryById(categoryIdOrName);
		}

		if (typeof categoryIdOrName === "string") {
			return getCategoryByName(categoryIdOrName);
		}

		return null;
	}, [categoryIdOrName]);

	return {
		currentCategory,

		categories,
		headerCategories,
		getCategoryById,
		getCategoryByName,
		getCategoryBySubPath,
	};
};

export default useCategory;
