import { create } from "zustand";

export type TToastVariant = "error" | "warning" | "success" | "info";
export type TToastItemPhase = "in" | "alive" | "out";

export interface IToastItem {
	id: number;
	message: string;
	variant: TToastVariant;
	phase: TToastItemPhase;
	elementHeight: number | null;
	elementOffsetY: number | null;
}

interface IToastState {
	items: {
		/**
		 * @prop 데이터 복사 없이 참조만 변경하기 위해 객체로 래핑했습니다.
		 * `deps` 배열에는 `items.map`을 넣으면 안 되고, `items` 자체를 넣거나
		 * `items.map(id)` 내의 개별 항목을 넣어야 합니다.
		 */
		map: Map<number, IToastItem>;
	};
}

interface IAddActionParam {
	message: string;
	variant?: TToastVariant;
}

interface IToastItemUpdate {
	phase?: TToastItemPhase;
	elementHeight?: number | null;
	elementOffsetY?: number | null;
}

interface IToastActions {
	/** @prop 토스트 목록에 새 항목을 추가합니다. */
	add: (item: IAddActionParam) => void;

	/** @prop 토스트 항목의 수정 가능한 필드를 변경합니다. */
	updateItem: (id: number, modification: IToastItemUpdate) => void;

	/** @prop `id`가 일치하는 토스트를 `out` 상태로 전이합니다. */
	dismiss: (id: number) => void;

	/** @prop 상태를 무시하고 `id`가 일치하는 토스트를 삭제합니다. */
	forceRemove: (id: number) => void;
}

type TGlobalErrorModalStore = IToastState & IToastActions;

let nextId = 1;

export const useToast = create<TGlobalErrorModalStore>((set, get) => ({
	items: { map: new Map() },

	add: ({ message, variant = "info" }: IAddActionParam) => {
		if (!message) {
			console.error("Toast에 표시할 메시지 없음");
			return;
		}

		const { map } = get().items;
		map.set(nextId, {
			id: nextId,
			message,
			variant,
			phase: "in",
			elementHeight: null,
			elementOffsetY: null,
		});

		nextId += 1;
		set({
			items: { map },
		});
	},

	updateItem: (id: number, modification: IToastItemUpdate) => {
		const { map } = get().items;
		const prevItem: IToastItem | undefined = map.get(id);

		if (!prevItem) {
			return;
		}

		const nextItem: IToastItem = {
			...prevItem,
			...modification,
		};
		map.set(id, nextItem);

		set({
			items: { map },
		});
	},

	dismiss: (id: number) => {
		get().updateItem(id, { phase: "out" });
	},

	forceRemove: (id: number) => {
		const { map } = get().items;

		if (map.delete(id)) {
			set({
				items: { map },
			});
		}
	},
}));
