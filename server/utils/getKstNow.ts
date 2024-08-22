export const getKstNow = () => {
	const KR_TIME_DIFF = 9 * 60 * 60 * 1000; // 9시간

	return new Date(Date.now() + KR_TIME_DIFF)
		.toISOString()
		.replace("Z", "+09:00"); // 한국 시간임을 나타내기위한 표준 시간대 지정자 변경
};
