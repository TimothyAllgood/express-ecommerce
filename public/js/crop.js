// Uses cropper.js

const form = document.querySelector('form');
const cropperContainer = document.querySelector('.cropper');
const imageUpload = document.querySelector('input[type=file]');
const image = document.getElementById('image');
const cropBtn = document.querySelector('.crop');

let newBlob = null;

imageUpload.addEventListener('change', (e) => {
	cropperContainer.classList.add('flex');
	e.preventDefault();
	console.log(e.target.files);
	image.src = URL.createObjectURL(event.target.files[0]);

	const preview = document.querySelector('.preview');
	const cropper = new Cropper(image, {
		viewMode: 2,
		aspectRatio: 1 / 1,
		minCropBoxHeight: 200,
		minCropBoxWidth: 200,
		preview: preview,
		crop(event) {
			// console.log(event.detail.x);
			// console.log(event.detail.y);
			// console.log(event.detail.width);
			// console.log(event.detail.height);
			// console.log(event.detail.rotate);
			// console.log(event.detail.scaleX);
			// console.log(event.detail.scaleY);
		},
	});
	cropBtn.addEventListener('click', () => {
		cropperContainer.classList.remove('flex');
		const test = document.querySelector('.test');
		// console.log(cropper.getCroppedCanvas().toDataURL('image/png'));

		cropper.getCroppedCanvas();
		cropper.getCroppedCanvas(cropper.getData);
		cropper.getCroppedCanvas().toBlob(function (blob) {
			// newBlob = new File([blob], 'blob.png');
			newBlob = blob;
			console.log(blob);
			var blobUrl = URL.createObjectURL(blob);

			test.src = blobUrl;

			// Pass the image file name as the third parameter if necessary.
		});
	});
});

// Sends form and redirects after form is updated with cropped image
form.addEventListener('submit', (e) => {
	e.preventDefault();
	const formData = new FormData(form);
	if (newBlob) {
		formData.set('img', newBlob, 'blob.png');
	}

	// console.log(newBlob);
	// for (var value of formData) {
	// 	console.log(value);
	// }
	form.addEventListener('formdata', (e) => {
		console.log('formdata fired');
		console.log(formData);
		// Get the form data from the event object
		let data = formData;
		for (var value of data) {
			console.log(value);
		}

		// submit the data via XHR
		var request = new XMLHttpRequest();

		if (request.status == 0) {
			// when completed we can move away
			window.location = '/products';
		}

		request.open('POST', '/users');
		request.send(data);
	});
});

console.log(image.value);
