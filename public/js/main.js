const rating = document.querySelector('.rating-container');
const inputs = document.querySelectorAll('.rating-container input');
const stars = document.querySelectorAll('.rating-container [type="radio"] + i');

const reviews = document.querySelectorAll('.review');
const ratingStr = document.querySelectorAll('.rating');
const reviewStarsContain = document.querySelectorAll('.review .review-rating');

for (let i = 0; i < reviewStarsContain.length; i++) {
	const reviewStars = reviewStarsContain[i].querySelectorAll(`i`);
	let ratingNum = parseInt(ratingStr[i].id);
	console.log(ratingNum);
	for (let j = 0; j < reviewStars.length; j++) {
		if (j < ratingNum) {
			reviewStars[j].classList.remove('far');
			reviewStars[j].classList.add('fas');
			reviewStars[j].style.color = 'goldenrod';
		}
	}
}

rating.addEventListener('click', (e) => {
	let value = null;
	if (e.target.type === 'radio') {
		value = e.target.value;
	}

	if (value) {
		for (i = 0; i < inputs.length; i++) {
			stars[i].style.color = 'initial';
			stars[i].classList.remove('fas');
			stars[i].classList.add('far');
			if (inputs[i].value <= value) {
				stars[i].classList.remove('far');
				stars[i].classList.add('fas');
				stars[i].style.color = 'goldenrod';
			}
		}
	}

	console.log(value);
});
