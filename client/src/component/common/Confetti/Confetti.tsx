import { useEffect, useRef, useCallback, FC } from "react";
import canvasConfetti, {
	CreateTypes,
	Options,
	GlobalOptions,
} from "canvas-confetti";

interface ConfettiProps extends Options, GlobalOptions {
	fire?: boolean;
	reset?: boolean;
	onDecay?: () => void;
	onFire?: () => void;
	onReset?: () => void;
}

const Confetti: FC<ConfettiProps> = ({
	fire,
	reset,
	onFire,
	onReset,
	resize = true,
	useWorker = true,
}) => {
	const refCanvas = useRef<HTMLCanvasElement>(null);
	const animationInstance = useRef<CreateTypes | null>(null);

	const makeShot = useCallback(
		(
			particleRatio: number,
			opts: object,
			origin: { x: number; y: number }
		) => {
			if (animationInstance.current) {
				animationInstance.current({
					...opts,
					origin,
					particleCount: Math.floor(200 * particleRatio),
				});
			}
		},
		[]
	);

	const fireConfetti = useCallback(() => {
		if (!animationInstance.current) return;
		makeShot(
			0.6,
			{
				spread: 60,
				startVelocity: 60,
			},
			{ x: 0.2, y: 1 }
		);
		makeShot(
			0.6,
			{
				spread: 80,
				startVelocity: 100,
			},
			{ x: 0.2, y: 1 }
		);
		makeShot(
			1,
			{
				spread: 120,
				decay: 0.91,
				scalar: 1,
				startVelocity: 100,
			},
			{ x: 0.2, y: 1 }
		);

		makeShot(
			0.6,
			{
				spread: 60,
				startVelocity: 60,
			},
			{ x: 0.8, y: 1 }
		);
		makeShot(
			0.6,
			{
				spread: 80,
				startVelocity: 100,
			},
			{ x: 0.8, y: 1 }
		);
		makeShot(
			1,
			{
				spread: 120,
				decay: 0.91,
				scalar: 1,
				startVelocity: 100,
			},
			{ x: 0.8, y: 1 }
		);
	}, [makeShot]);

	useEffect(() => {
		if (!refCanvas.current) return;

		animationInstance.current = canvasConfetti.create(refCanvas.current, {
			resize,
			useWorker,
		});

		if (fire) {
			fireConfetti();
			onFire && onFire();
		}

		return () => {
			animationInstance.current?.reset();
			onReset && onReset();
		};
	}, [fire, fireConfetti, onFire, onReset, resize, useWorker]);

	useEffect(() => {
		if (reset && animationInstance.current) {
			animationInstance.current.reset();
			onReset && onReset();
		}
	}, [reset, onReset]);

	return (
		<canvas
			ref={refCanvas}
			className="pointer-events-none fixed inset-0 h-full w-full"
		/>
	);
};

export default Confetti;
