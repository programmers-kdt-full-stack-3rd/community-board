import { useEffect, useState } from "react";
import Confetti from "../../component/common/Confetti/Confetti";
import { FaCrown } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";

export const Rank = () => {
	const [active, setActive] = useState(0);
	const [visible, setVisible] = useState(false);
	const buttons = ["Rank", "Top Writer", "Top Visitor"];
	const users = [
		{ name: "User1", score: 100 },
		{ name: "User2", score: 90 },
		{ name: "User3", score: 80 },
	];

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 50) {
				setVisible(true);
			} else {
				setVisible(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div className="mx-auto mt-2 w-full max-w-7xl px-4 lg:mt-[18px] lg:px-0">
			<Confetti fire={true} />
			<div
				className={`flex flex-col items-center ${visible ? "animate-slide-up" : ""}`}
			>
				<div className="dark:bg-customGray relative flex h-16 w-96 items-center justify-between rounded-3xl bg-blue-800">
					<div className="relative mx-2 flex h-12 w-full flex-row items-center justify-between gap-3 rounded-2xl">
						<div
							className={`absolute h-full w-1/3 rounded-2xl bg-blue-200 bg-opacity-15 transition-transform duration-300`}
							style={{
								transform: `translateX(${active * 100}%)`,
							}}
						/>

						{buttons.map((button, index) => (
							<div
								key={index}
								className={`flex-1 cursor-pointer text-center ${active === index ? "font-bold text-white" : "text-gray-300"}`}
								onClick={() => setActive(index)}
							>
								{button}
							</div>
						))}
					</div>
				</div>

				<div className="mx-20 mt-8 flex w-full flex-row justify-center gap-24">
					<div className="relative mt-28 flex flex-col items-center">
						<FaCrown className="mb-1 size-12 text-gray-400" />
						<span className="text-lg text-black dark:text-white">
							2nd
						</span>
						<FaUserCircle className="size-16" />
						<span className="text-lg font-bold text-black dark:text-white">
							User2
						</span>
						<span className="text-sm text-gray-700 dark:text-gray-300">
							{users[1].score}
						</span>
					</div>

					<div className="flex flex-col items-center">
						<FaCrown className="mb-1 size-12 text-yellow-500" />
						<span className="text-xl font-bold text-black dark:text-white">
							1st
						</span>
						<FaUserCircle className="size-24" />
						<span className="text-lg font-bold text-black dark:text-white">
							User1
						</span>
						<span className="text-sm text-gray-700 dark:text-gray-300">
							{users[0].score}
						</span>
					</div>

					<div className="relative mt-32 flex flex-col items-center">
						<FaCrown className="mb-1 size-12 text-amber-900" />
						<span className="text-lg text-black dark:text-white">
							3rd
						</span>
						<FaUserCircle className="size-12" />
						<span className="text-lg font-bold text-black dark:text-white">
							User3
						</span>
						<span className="text-sm text-gray-700 dark:text-gray-300">
							{users[2].score}
						</span>
					</div>
				</div>
			</div>

			<div className={`${visible ? "animate-slide-up" : ""}`}>
				<div className="mx-5 mt-10 flex">
					<div className="mx-4 flex w-full flex-col items-center justify-between gap-10">
						<div className="dark:bg-customGray flex w-full flex-row items-center justify-between rounded-xl bg-gray-50 p-6">
							<div className="flex items-center gap-3">
								<FaCrown className="mb-1 size-8 text-yellow-500" />
								<span className="text-2xl font-bold">1</span>
								<FaUserCircle className="size-12" />
								<span className="text-xl font-bold">User1</span>
							</div>
							<span className="ml-auto text-2xl font-bold">
								1000 Posts
							</span>
						</div>

						<div className="dark:bg-customGray flex w-full flex-row items-center justify-between rounded-xl bg-gray-50 p-6">
							<div className="flex items-center gap-3">
								<FaCrown className="mb-1 size-8 text-gray-400" />
								<span className="text-2xl font-bold">2</span>
								<FaUserCircle className="size-12" />
								<span className="text-xl font-bold">User2</span>
							</div>
							<span className="ml-auto text-2xl font-bold">
								900 Posts
							</span>
						</div>

						<div className="dark:bg-customGray flex w-full flex-row items-center justify-between rounded-xl bg-gray-50 p-6">
							<div className="flex items-center gap-3">
								<FaCrown className="mb-1 size-8 text-amber-900" />
								<span className="text-2xl font-bold">3</span>
								<FaUserCircle className="size-12" />
								<span className="text-xl font-bold">User3</span>
							</div>
							<span className="ml-auto text-2xl font-bold">
								800 Posts
							</span>
						</div>

						<div className="dark:bg-customGray flex w-full flex-row items-center justify-between rounded-xl bg-gray-50 p-6">
							<div className="flex items-center gap-3">
								<span className="text-2xl font-bold">4</span>
								<FaUserCircle className="size-12" />
								<span className="text-xl">User4</span>
							</div>
							<span className="ml-auto text-2xl font-bold">
								700 Posts
							</span>
						</div>

						<div className="dark:bg-customGray flex w-full flex-row items-center justify-between rounded-xl bg-gray-50 p-6">
							<div className="flex items-center gap-3">
								<span className="text-2xl font-bold">5</span>
								<FaUserCircle className="size-12" />
								<span className="text-xl">User5</span>
							</div>
							<span className="ml-auto text-2xl font-bold">
								600 Posts
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
