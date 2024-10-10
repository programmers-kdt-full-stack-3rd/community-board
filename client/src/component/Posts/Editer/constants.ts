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
