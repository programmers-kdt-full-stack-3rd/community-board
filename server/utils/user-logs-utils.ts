import { truncateFirstLine } from "./text-formatter";

const LOG_TITLE_LENGTH = 50;

export const makeLogTitle = (text: string): string =>
	truncateFirstLine(text, LOG_TITLE_LENGTH);
