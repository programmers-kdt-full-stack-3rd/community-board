import { beautiful} from './constants';

// 단어 사이에 아무 문자나 들어가도 OK

export const getRegex = (badWords : string[]) => {
    return new RegExp(badWords.join("|"),"g");
};

export const changeBadWords = (text : string, regex : RegExp) => {
    const time = new Date().getTime();
    let index = time % beautiful.length;

    return text.replace(regex, () => {
        if(index >= beautiful.length){
            index = 0;
        } else {
            index += 1;
        }

        return beautiful[index];
    });
};