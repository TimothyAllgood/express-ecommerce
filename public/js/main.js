// Variables for Review Form
const rating = document.querySelector('.rating-container');
const inputs = document.querySelectorAll('.rating-container input');
const stars = document.querySelectorAll('.rating-container [type="radio"] + i');

// Variables for Individual Reviews
const reviews = document.querySelectorAll('.review');
const ratingStr = document.querySelectorAll('.rating');
const reviewStarsContain = document.querySelectorAll('.review .review-rating');

// TextAreas
const textArea = document.querySelector('.product-text');
const form = document.querySelector('.product-form');

// Desktop Menu
const desktopToggle = document.querySelector('.profile-toggle');
const desktopMenu = document.querySelector('.profile-hover');

// Mobile Menu
const mobileMenuToggle = document.querySelector('.mobile-toggle');
const mobileMenu = document.querySelector('.mobile-profile-menu');

// Amount of stars equal to rating in db are updated with proper styling
for (let i = 0; i < reviewStarsContain.length; i++) {
	const reviewStars = reviewStarsContain[i].querySelectorAll(`i`);
	let ratingNum = parseInt(ratingStr[i].id);
	console.log(ratingNum);
	for (let j = 0; j < reviewStars.length; j++) {
		if (j < ratingNum) {
			changeStar(reviewStars[j], 'far', 'fas', 'goldenrod');
		}
	}
}

if (rating) {
	// Changes colors of amount of stars clicked
	rating.addEventListener('click', handleStarUpdate);
}
if (form) {
	form.addEventListener('submit', handleTextArea);
}

mobileMenuToggle.addEventListener('click', displayMenu);

desktopToggle.addEventListener('click', displayDesktopMenu);

function handleStarUpdate(e) {
	let value = null;
	if (e.target.type === 'radio') {
		value = e.target.value;
	}

	if (value) {
		for (i = 0; i < inputs.length; i++) {
			changeStar(stars[i], 'fas', 'far', 'initial');
			if (inputs[i].value <= value) {
				changeStar(stars[i], 'far', 'fas', 'goldenrod');
			}
		}
	}
}

function handleTextArea(e) {
	textAreaFinal = textArea.value.replace('/n', '<br/>');
	textArea.value = textAreaFinal;
	alert(textArea.value);
	e.preventDefault();
	this.submit();
}

function displayDesktopMenu() {
	desktopMenu.classList.toggle('hide');
}

function displayMenu() {
	mobileMenu.classList.toggle('invisible');
}

// Changes Star Color and Updates Icon
function changeStar(star, oldIcon, newIcon, color) {
	star.classList.remove(oldIcon);
	star.classList.add(newIcon);
	star.style.color = color;
}
