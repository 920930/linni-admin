export const tinyCanvas = (blob, quality = 50, width = 750) => {
	return new Promise((resolve) => {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		const img = new Image();
		img.src = blob.path;
		img.onload = () => {
			canvas.width = width;
			canvas.height = width * img.height / img.width;
			ctx.drawImage(img, 0, 0, width, canvas.height);
			// canvas.toBlob((file) => resolve(file), blob.type, quality / 100)
			const base64 = canvas.toDataURL(blob.type, quality / 100)
			resolve(base64)
		}
	})
}