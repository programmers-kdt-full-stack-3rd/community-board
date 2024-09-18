import * as fs from "fs";
import { BETWEEN, badWordPart } from "./constants";

type Main = string[];
type Sub = string[][];

interface Words {
	main: Main;
	sub: Sub;
}

const getBadWordsRegex = (words: Words) => {
	const comMain = combineWords(words.main);
	const comSub = combineSubWords(words.sub);

	return combineWords([comMain, comSub] as Main);
};

const combineWords = (words: Main) => {
	return words.join(BETWEEN);
};

const combineSubWords = (sub: Sub) => {
	const comSubs: string[] = [];
	sub.forEach(items => {
		if (items.length > 1) {
			comSubs.push("(" + combineWords(items) + ")");
		} else {
			comSubs.push(items[0]);
		}
	});
	return "(" + comSubs.join("|") + ")?";
};

export const fillRegexs = () => {
	const regexs: string[] = [];

	// regexs 채우기
	// 3글자 이상
	const words_list = [
		{
			main: [badWordPart.SI, badWordPart.BAL],
			sub: [[badWordPart.NOM], [badWordPart.SAE, badWordPart.KI]],
		},
		{
			main: [badWordPart.SYANG],
			sub: [[badWordPart.NOM], [badWordPart.SAE, badWordPart.KI]],
		},
		{
			main: [badWordPart.BEUNG, badWordPart.SIN],
			sub: [[badWordPart.NOM], [badWordPart.SAE, badWordPart.KI]],
		},
	];
	words_list.map(words => {
		regexs.push(getBadWordsRegex(words));
	});

	// 2글자
	const two_word_list = [
		[badWordPart.SAE, badWordPart.KI],
		[badWordPart.EAE, badWordPart.MI],
		[badWordPart.NU, badWordPart.GEUM, badWordPart.MA + "?"],
	];
	two_word_list.map(words => {
		regexs.push(combineWords(words));
	});
	// 1글자
	const one_word_list = [badWordPart.JOT, badWordPart.SYANG, badWordPart.NOM];
	one_word_list.map(word => {
		regexs.push(word);
	});

	// 파일에 쓰기
	try {
		fs.writeFileSync("regexs.json", JSON.stringify(regexs, null, 2));
		console.log("success");
	} catch (err) {
		console.error("Error writing to file", err);
	}
};
