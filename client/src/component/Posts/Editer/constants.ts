export const quillFormats = [
	"font",
	"size",
	"bold",
	"underline",
	"color",
	"code-block",
	"image",
	"width",
	"height",
	"header",
	"horizontal-rule",
	"list",
	"bullet",
];

const toolbarColors = [
	// 1행: Primary color row
	false, // 기본 컬러
	"red3",
	"amber3",
	"emerald3",
	"blue3",
	"violet3",
	"pink3",

	// 2행
	"gray1",
	"red1",
	"amber1",
	"emerald1",
	"blue1",
	"violet1",
	"pink1",

	// 3행
	"gray2",
	"red2",
	"amber2",
	"emerald2",
	"blue2",
	"violet2",
	"pink2",

	// 4행
	"gray3",
	"red4",
	"amber4",
	"emerald4",
	"blue4",
	"violet4",
	"pink4",
];

export const toolbarContainer = [
	[{ font: [] }],
	[{ size: ["small", false, "large", "huge"] }],
	["bold", "underline", { color: toolbarColors }],
	["code-block"],
	["image"],
	["clean"],
];

export const template = `
<p><strong class="ql-size-large">📝 </strong><strong class="ql-size-large ql-color-red3">[버그/이슈] </strong><strong class="ql-size-large">설명</strong></p>
<p>&gt;<span class="ql-font-monospace"> 버그 또는 이슈의 간단한 설명을 적어주세요.</span></p>
<pre class="ql-syntax" spellcheck="false">👉 (ex. 로그인 시 오류 메시지가 표시되며, 사용자가 로그인할 수 없습니다.)</pre>
<p><br/></p><p><br/></p>
<p><strong class="ql-size-large">🔍 해결 단계</strong></p>
<p>&gt;<span class="ql-font-monospace"> 이 곳에 내용을 입력해주세요.</span></p>
<pre class="ql-syntax" spellcheck="false">👉 (ex. 로그를 보면서 사용자 인증 부분 수정)</pre>
<p><br/></p><p><br/></p>
<p><strong class="ql-size-large">💡 예상 결과</strong></p>
<p>&gt;<span class="ql-font-monospace"> 예상했던 결과를 적어주세요.</span></p>
<pre class="ql-syntax" spellcheck="false">👉 (ex. 사용자가 정상적으로 로그인)</pre>
<p><br/></p><p><br/></p>
<p><strong class="ql-size-large">💡 실제 결과</strong></p>
<p>&gt;<span class="ql-font-monospace"> 실제로 발생한 결과를 적어주세요.</span></p>
<pre class="ql-syntax" spellcheck="false">👉 (ex. 사용자가 정상적으로 로그인 가능)</pre>
<p><br/></p><p><br/></p>
<p><strong class="ql-size-large">🔗 추가 정보(참고 사항)</strong></p>
<p>&gt;<span class="ql-font-monospace"> 추가적인 정보가 있다면 적어주세요.</span></p>
<pre class="ql-syntax" spellcheck="false">👉 (ex. 로그를 잘 보자~ :D )</pre>
<p><br/></p><p><br/></p>
<p><strong class="ql-size-large">📌 우선순위</strong></p>
<p>&gt;<span class="ql-font-monospace"> 이 문제가 얼마나 중요한지 우선순위를 적어주세요.</span></p>
<pre class="ql-syntax" spellcheck="false">👉 (ex. 쉽게 해결 가능~~ *^v^* )</pre>
<p><br/></p><p><br/></p>

`;
