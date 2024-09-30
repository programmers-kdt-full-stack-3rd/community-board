import { FaCrown } from "react-icons/fa6";

export const UserRank = () => {
	return (
		<div className="hidden w-[180px] shrink-0 lg:block">
			<div className="sticky top-20 mb-8">
				<div className="my-4 space-y-8 first:mt-0">
					<div className="hidden space-y-2 divide-y divide-gray-500/30 lg:block">
						<div className="flex items-center">
							<FaCrown className="mr-1"></FaCrown>
							<div className="text-base font-bold">Rank</div>
						</div>
						<div>
							<ul className="text-left">
								<li>1. user1</li>
								<li>2. user2</li>
								<li>3. user3</li>
								<li>4. user4</li>
								<li>5. user5</li>
							</ul>
						</div>
					</div>

					<div className="hidden space-y-2 divide-y divide-gray-500/30 lg:block">
						<div className="flex items-center">
							<FaCrown className="mr-1"></FaCrown>
							<div className="text-base font-bold">
								Top Writers
							</div>
						</div>
						<div>
							<ul className="text-left">
								<li>1. user1</li>
								<li>2. user2</li>
								<li>3. user3</li>
								<li>4. user4</li>
								<li>5. user5</li>
							</ul>
						</div>
					</div>

					<div className="hidden space-y-2 divide-y divide-gray-500/30 lg:block">
						<div className="flex items-center">
							<FaCrown className="mr-1"></FaCrown>
							<div className="text-base font-bold">
								Top Visitors
							</div>
						</div>
						<div>
							<ul className="text-left">
								<li>1. user1</li>
								<li>2. user2</li>
								<li>3. user3</li>
								<li>4. user4</li>
								<li>5. user5</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
