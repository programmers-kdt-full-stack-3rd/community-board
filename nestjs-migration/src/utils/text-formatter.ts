export const truncateFirstLine = (text: string, maxLength: number): string => {
	const firstLine = text.split("\n")[0];
	return firstLine.length > maxLength
		? firstLine.slice(0, maxLength) + "..."
		: firstLine;
};
