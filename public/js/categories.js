//Add the categories into the category element
//	Categories need to be given by the server so server request will be implemented here as well
async function addCategories() {
	const categories = await getCategories({});
	console.log(categories);

	for (let i = 0; i < categories.length; i++) {
		const category = document.createElement('div');
		category.classList.add("list-group-item");
		category.classList.add("category");
		category.innerText = categories[i].category;
		categorySelect.appendChild(category);
	}
}

//Select one of the categories and show the corresponding content
function selectCategory(e) {
	if (e.target.nodeName == "DIV") {
		let category = "";
		//If the user is unselecting the category
		if (e.target.classList.contains("active-category")) {
			e.target.classList.remove("active-category");
		} else {
			//Make everything unselected
			for (let i = 0; i < categorySelect.children.length; i++) {
				categorySelect.children[i].classList.remove("active-category");
			}

			//Make the selected category active
			e.target.classList.add("active-category");
			category = e.target.innerText;
		}

		//Call searchProducts from the corresponding js file in the HTML
		urlQueryPush(category);
	}
}