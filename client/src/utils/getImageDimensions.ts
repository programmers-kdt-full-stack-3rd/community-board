export const getImageDimensionsFromBlob = async (blob: Blob) => {
	const url = URL.createObjectURL(blob);

	const dimensions = await new Promise<number[]>(resolve => {
		const img = new Image();
		img.onload = () => resolve([img.width, img.height]);
		img.src = url;
	});

	URL.revokeObjectURL(url);

	return {
		width: dimensions[0],
		height: dimensions[1],
	};
};
