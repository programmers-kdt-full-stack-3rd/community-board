export const dateToStr = (date: Date, willShorten?: boolean): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");

	if (!willShorten) {
		return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
	}

	const current = new Date();

	const currentYear = current.getFullYear();
	const currentMonth = String(current.getMonth() + 1).padStart(2, "0");
	const currentDay = String(current.getDate()).padStart(2, "0");

	if (currentYear === year) {
		if (currentMonth === month && currentDay === day) {
			return `${hours}:${minutes}:${seconds}`;
		} else {
			return `${month}.${day} ${hours}:${minutes}`;
		}
	} else {
		return `${year}.${month}.${day}`;
	}
};

export const getKoreanDate = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

export const subtractDays = (date: string, days: number): Date => {
	const result = new Date(date);
	result.setDate(result.getDate() - days);
	return result;
};

export const addDays = (date: Date, days: number): Date => {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
};

export const addMonths = (date: Date, months: number) => {
	const newDate = new Date(date);
	newDate.setMonth(newDate.getMonth() + months);
	return newDate;
};

export const addYears = (date: Date, years: number) => {
	const newDate = new Date(date);
	newDate.setFullYear(newDate.getFullYear() + years);
	return newDate;
};