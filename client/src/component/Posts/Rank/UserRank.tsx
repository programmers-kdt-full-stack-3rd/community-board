import { FaCrown } from "react-icons/fa6";
import { Link } from "react-router-dom";

export const UserRank = () => {
	return (
		<div className="hidden w-[180px] shrink-0 lg:block">
			<div className="sticky top-20 mb-8">
				<Link to="/rank">
					<div className="my-4 space-y-8 text-blue-950 first:mt-0 dark:text-white">
						<div className="hidden space-y-2 divide-y divide-gray-500/30 lg:block">
							<div className="flex items-center">
								<FaCrown className="mr-1 text-blue-900 dark:text-white"></FaCrown>
								<div className="text-lg font-bold text-blue-900 dark:text-white">
									Rank
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
								<FaCrown className="mr-1 text-blue-900 dark:text-white"></FaCrown>
								<div className="text-lg font-bold text-blue-900 dark:text-white">
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
								<FaCrown className="mr-1 text-blue-900 dark:text-white"></FaCrown>
								<div className="text-lg font-bold text-blue-900 dark:text-white">
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
				</Link>
			</div>
		</div>
	);
};
