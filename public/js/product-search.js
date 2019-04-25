//Search for products given the current query
async function searchProducts() {
	loading.style.display = "block";
	clearProductArea();
	const query = urlQueryRequest();
	const searchProducts = await searchDatabase(query);
	displayResults(searchProducts);
	loading.style.display = "none";	
}

//Manipulation of url query string without reloading page - can only do on a live site
function urlQueryPushSearch(category) {
	if (typeof category === 'string' || category instanceof String) {
		getCategories({"category":category}).then((categoryId) => {
			const category = categoryId[0]._id;
			const course = document.getElementById('course').value;
			const textbook = document.getElementById('textbook').value;
			const sort = select.children[0].value;

			const queryString = "category=" + category + "&course=" + course + "&book=" + textbook + "&sort=" + sort;

			if (history.pushState) {
			    const url = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + queryString;
			    window.history.pushState({path:url}, '', url);
			}

			searchProducts();
		}).catch((error) => {
			console.log(error);
		});
	} else {
		const category = "";
		const course = document.getElementById('course').value;
		const textbook = document.getElementById('textbook').value;
		let sort = select.children[0].innerText;

		if (sort == "Sort by Price") {
			sort = 'price';
		} else if (sort == "Sort Alphabetically") {
			sort = 'alphabetically'
		} else if (sort == "Sort by Course") {
			sort = 'course';
		} else {
			sort = "";
		}

		const queryString = "category=" + category + "&course=" + course + "&book=" + textbook + "&sort=" + sort;

		if (history.pushState) {
		    const url = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + queryString;
		    window.history.pushState({path:url}, '', url);
		}

		searchProducts();
	}
}

//Manipulation of url query string without reloading page - can only do on a live site
function urlQueryPush(category) {
	if (category != "") {
		getCategories({"category":category}).then((categoryId) => {
			const category = categoryId[0]._id;
			
			const queryString = "category=" + category;

			if (history.pushState) {
			    const url = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + queryString;
			    window.history.pushState({path:url}, '', url);
			}

			searchProducts();
		}).catch((error) => {
			console.log(error);
		});
	} else {
		const category = "";
		
		const queryString = "category=" + category;

		if (history.pushState) {
		    const url = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + queryString;
		    window.history.pushState({path:url}, '', url);
		}

		searchProducts();
	}
}


//Pulling of query string to generate search query
function urlQueryRequest() {
	const queryParams = new URLSearchParams(window.location.search);

	const query = {};
	query.category = queryParams.get('category');
	query.course = queryParams.get('course');
	query.book = queryParams.get('book');
	query.sort = queryParams.get('sort');

	return query;
}

//Search function based on query
async function searchDatabase(query) {
	const searchResults = await getTextbooks(query);
	console.log(searchResults);

	const sort = query.sort;

	//Sort according to the desired query
	if (sort == "price") {
		searchResults.sort(function(a,b) {
			return a.price - b.price;
		});
	} else if (sort == "alphabetically") {
		searchResults.sort(function(a, b) {
		    const textA = a.title.toUpperCase();
		    const textB = b.title.toUpperCase();
		    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
		});
	} else if (sort == "course") {
		searchResults.sort(function(a, b) {
		    const textA = a.course;
		    const textB = b.course;
		    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
		});
	}

	return searchResults;
}

//Display the results
function displayResults(results) {
	//If no textbooks were found
	if (results.length <= 0) {
		const noProducts = document.createElement('div');
		noProducts.innerText = "Sorry, no textbooks were found";
		productParent.appendChild(noProducts);
	} else {
		//Add each textbook into the DOM
		for (let i = 0; i < results.length; i++) {
			console.log(results[i]);
			addProductCard(results[i]._id, results[i].title, results[i].author, results[i].image,results[i].course,results[i].description, results[i].price / 100);
		}
	}
}