// const { changeBadWords, getRegex } = require('./regex_getter');
// const fs = require('fs');

// const tests = [
//     "이거 어마무시한 시@발년이네?",
//     "애미@뒤진@새끼야!",
//     "ㅋㅋㅋ시발ㅋㅋㅋ병신ㅋㅋ",
//     "느ㅋ금ㅋ마ㅋ"
// ];

// const doTest = () => {
//     try {
//         const data = fs.readFileSync('regexs.json', 'utf8');
//         const regex = getRegex(JSON.parse(data));
//         console.log(regex);
//         // 파일을 읽은 후에 forEach 실행
//         tests.forEach((test) => {
//             const newText = changeBadWords(test, regex);
//             console.log("원본 : " + test);
//             console.log("바뀜 : " + newText);
//         });
//     } catch (err) {
//         console.error('Error reading file', err);
//     }
// };

// doTest();
