const categories = [];

const products = document.querySelectorAll('.product');
const filterList = document.getElementById('filter-list');

window.addEventListener('load', setFilterList);

filterList.addEventListener('click', filterItems);

function setFilterList() {
	for (let product of products) {
		if (
			!categories.includes(product.classList[1]) &&
			!product.classList.contains('show')
		) {
			categories.push(product.classList[1]);
		}
	}

	for (let category of categories) {
		const filterOption = `<option value="${category}">${category.replace(
			'-',
			' '
		)}</option>`;
		filterList.insertAdjacentHTML('beforeend', filterOption);
	}
}

function filterItems(e) {
	for (let product of products) {
		product.classList.add('show');
		product.classList.remove('hide');
		if (e.target.value === 'all-products') {
			product.classList.add('show');
			product.classList.remove('hide');
		} else if (
			product.classList[1] !== e.target.value &&
			product.classList[2]
		) {
			product.classList.remove('show');
			product.classList.add('hide');
			console.log(product);
		}
	}
}
