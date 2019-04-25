//Add the categories into the category element
//	Categories need to be given by the server so server request will be implemented here as well
function addCategories(categories) {
	for (let i = 0; i < categories.length; i++) {
		const category = document.createElement('div');
		category.classList.add("list-group-item");
		category.classList.add("category");
		if (i == 0) {
			category.classList.add("active-category");
		}
		category.innerText = categories[i];
		categorySelect.appendChild(category);
	}
}

//Select one of the categories and show the corresponding content
function selectCategory(e) {
	if (e.target.nodeName == "DIV") {
		//Make everything unselected
		for (let i = 0; i < categorySelect.children.length; i++) {
			categorySelect.children[i].classList.remove("active-category");
		}

		//Make the selected category activated
		e.target.classList.add("active-category");
		category = e.target.innerText.toLowerCase();

		//Show the correct content
		for (let i = 0; i < categories.length; i++) {
			if (category == categories[i].toLowerCase()) {
				showContent(categoriesIds[i]);
			}
		}
	}
}

//Set all content that isn't id to no display and the desired content to be shown
function showContent(id) {
	console.log(id);
	for (let i = 0; i < contentBoxes.length; i++) {
		if (document.getElementById(id) == contentBoxes[i]) {
			contentBoxes[i].style.display = "block";
		} else {
			contentBoxes[i].style.display = "none";
		}
	}

	if (id == "user-profile") {
		document.getElementById('username').innerText = session.username
	} else if (id == "inventory") {
		getInventory();
	} else if (id == "wishlist") {
		getWishlist();
	} else if (id == "textbook-manager") {
		getBookManager();
	} else if (id == "user-manager") {
		getUserManager();
	}
}


let category = "";
const bookSearchButton = document.getElementById("book-search-button");
const userSearchButton = document.getElementById("user-search-button");
const loading = document.getElementById("loading");
const categorySelect = document.getElementById("categories");

const userManager = document.getElementById("user-manager");
const bookManager = document.getElementById("textbook-manager");

const contentBoxes = document.querySelectorAll(".content-box");

//These will be provided by server calls
const categories = ["Profile", "Inventory", "Wishlist", "Manage Textbooks", "Manage Users"];
const categoriesIds = ["user-profile", "inventory", "wishlist", "textbook-manager", "user-manager"];


addCategories(categories);
showContent('user-profile');

categorySelect.addEventListener("click",selectCategory);