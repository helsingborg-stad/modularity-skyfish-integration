export const reSize = (originalWidth, originalHeight, newLongestSide) => {
	let width, height;

	if (originalWidth > originalHeight) {
		width = newLongestSide;
		height = (originalHeight / originalWidth) * width;
	} else {
		height = newLongestSide;
		width = (originalWidth / originalHeight) * height;
	}

	return {
		width: Math.ceil(width),
		height: Math.ceil(height),
	};
};

export const getSizes = (width, height, id, fileName) => {
	const avalibleSizes = {
		large: 1600,
		medium: 1200,
		small: 800,
	};

	let sizes = {
		original: {
			id: id,
			width: width,
			height: height,
			format: fileName.split(".").pop() || "",
		},
	};

	Object.entries(avalibleSizes).forEach(([sizeName, size]) => {
		let reSized = reSize(width, height, size);

		sizes[sizeName] = {
			id: id,
			width: reSized.width,
			height: reSized.height,
			format: "jpeg",
		};
	});

	return sizes;
};
