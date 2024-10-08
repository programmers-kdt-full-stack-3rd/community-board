export const sanitizePostContent = (content: string): string => {
	const container = document.createElement("div");
	container.innerHTML = content;

	const styledImages = container.querySelectorAll("img[style]");

	for (const img of styledImages) {
		img.removeAttribute("style");
	}

	return container.innerHTML;
};
