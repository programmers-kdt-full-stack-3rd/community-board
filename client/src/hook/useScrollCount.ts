import { useEffect, useRef, useState } from "react";

const useScrollCount = (targetValue: number, duration: number) => {
	const [count, setCount] = useState(0);
	const ref = useRef(null);
	const hasAnimated = useRef(false);

	useEffect(() => {
		if (targetValue > 0 && ref.current && !hasAnimated.current) {
			hasAnimated.current = true;

			const totalFrames = 60;
			const frameRate = duration / totalFrames;
			const increment = targetValue / totalFrames;

			const interval = setInterval(() => {
				setCount(prevCount => {
					const newCount = Math.min(
						prevCount + increment,
						targetValue
					);
					if (newCount === targetValue) clearInterval(interval);
					return newCount;
				});
			}, frameRate);

			return () => {
				clearInterval(interval);
			};
		}
	}, [ref, targetValue, duration]);

	useEffect(() => {
		if (targetValue !== count) {
			hasAnimated.current = false;
			setCount(0);
		}
	}, [targetValue]);

	return { ref, count: Math.max(0, Math.floor(count)) };
};

export default useScrollCount;
