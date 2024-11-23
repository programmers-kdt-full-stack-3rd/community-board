/// <reference types="vite/client" />

// 스타일 객체의 key로 CSS 변수 허용
declare namespace React {
	interface CSSProperties {
		[key: `--${string}`]: string | number;
	}
}
