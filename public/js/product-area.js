//Clear all the product cards
function clearProductArea() {
	productParent.innerHTML = "";
}


//Add a product card to the product area
function addProductCard(id,name,author,image,course,desc,price) {
	const productLink = document.createElement('a');
	productLink.href = "/textbook?id=" + id;

	const productCard = document.createElement('div');
	productCard.className = "product";
	productLink.appendChild(productCard);

	const productImageDiv = document.createElement('div');
	productImageDiv.className = "product-image";
	const productImage = document.createElement('img');
	//Default image
	productImage.src = "/img/" + image;
	productImageDiv.appendChild(productImage);

	const productText = document.createElement('div');
	productText.className = "product-text";

	const productName = document.createElement('div');
	productName.className = "product-name";
	productName.innerText = name;
	productText.appendChild(productName);

	const productAuthor = document.createElement('div');
	productAuthor.className = "product-author";
	productAuthor.innerText = author;
	productText.appendChild(productAuthor);

	const productCourse = document.createElement('div');
	productCourse.className = "product-course";
	productCourse.innerText = course;
	productText.appendChild(productCourse);

	const productDesc = document.createElement('div');
	productDesc.className = "product-description";
	productDesc.innerText = desc;
	productText.appendChild(productDesc);

	const productPrice = document.createElement('div');
	productPrice.className = "product-price";
	productPrice.innerText = "$" + parseFloat(price).toFixed(2);
	productText.appendChild(productPrice);

	productCard.appendChild(productImageDiv);
	productCard.appendChild(productText);

	productParent.appendChild(productLink);
}