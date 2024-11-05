import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useRef,
} from "react";
import { twJoin, twMerge } from "tailwind-merge";
import Button from "./Button";

interface IDropdownContextValue {
	onToggle: (nextIsOpen: boolean) => void;
}

export interface IDropdownRootProps {
	children: React.ReactNode;
	isOpen: boolean;
	onToggle: (nextIsOpen: boolean) => void;
	toggleLabel: React.ReactNode;
	toggleClassName?: string;
	wrapperClassName?: string;
}

export interface IDropdownToggleProps {
	children: React.ReactNode;
}

export interface IDropdownItemProps {
	children: React.ReactNode;
	icon?: React.ReactNode;
	onClick: () => void;
}

type TDropdownComponent = React.FC<IDropdownRootProps> & {
	Item: React.FC<IDropdownItemProps>;
};

const DropdownContext = createContext<IDropdownContextValue>({
	onToggle: () => {},
});

const DropdownRoot: React.FC<IDropdownRootProps> = ({
	children,
	isOpen,
	onToggle,
	toggleLabel,
	toggleClassName,
	wrapperClassName,
}) => {
	const rootRef = useRef<HTMLDivElement>(null);

	const contextValue: IDropdownContextValue = useMemo(
		() => ({
			onToggle,
		}),
		[onToggle]
	);

	useEffect(() => {
		if (isOpen) {
			const handleOutsideClick = (event: MouseEvent) => {
				if (
					rootRef.current &&
					!rootRef.current.contains(event.target as Node)
				) {
					onToggle(false);
				}
			};

			document.addEventListener("mousedown", handleOutsideClick);

			return () => {
				document.removeEventListener("mousedown", handleOutsideClick);
			};
		}
	}, [isOpen, onToggle]);

	const handleToggle = () => {
		onToggle(!isOpen);
	};

	return (
		<DropdownContext.Provider value={contextValue}>
			<div
				ref={rootRef}
				className={twMerge("relative text-base", wrapperClassName)}
			>
				<Button
					className={twMerge(
						"flex w-fit flex-nowrap items-center rounded-none p-0",
						toggleClassName
					)}
					noInternalStyle
					onClick={handleToggle}
				>
					{toggleLabel}
				</Button>

				<div
					className={twJoin(
						"dark:bg-customGray absolute right-0 z-40 mt-2 flex w-max min-w-40 flex-col rounded-lg bg-white px-2 py-2 text-left shadow-md dark:border-l dark:border-t dark:border-white/5",
						!isOpen && "hidden"
					)}
				>
					{children}
				</div>
			</div>
		</DropdownContext.Provider>
	);
};

const DropdownItem: React.FC<IDropdownItemProps> = ({
	children,
	icon,
	onClick,
}) => {
	const { onToggle } = useContext(DropdownContext);

	const handleClick = () => {
		onClick();
		onToggle(false);
	};

	return (
		<Button
			className="flex min-h-10 items-center gap-2 rounded px-2 py-2 text-left text-base text-gray-700 dark:text-white"
			variant="text"
			onClick={handleClick}
		>
			<div>{icon}</div>
			<div>{children}</div>
		</Button>
	);
};

const Dropdown = DropdownRoot as TDropdownComponent;
Dropdown.Item = DropdownItem;

export default Dropdown;
