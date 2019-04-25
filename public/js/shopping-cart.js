function clearDisplay(display) {
	display.innerHTML = "";
}

function setUpBookDisplay(display) {
	display.innerHTML = `<tr><th></th><th><div>Price</div></th></tr>`
}

function getUserCart() {
	loading.style.display = "block";
	clearDisplay(cartParent);

	getUser(session.user).then((user) => {
		console.log(user.cart);
		const cart = user.cart;
		if (cart.length <= 0) {
			const row = document.createElement('tr');
			const span = document.createElement('td');
			span.colSpan = "2";
			span.style.textAlign = "center";
			span.innerText = "Nothing in your cart!";
			row.appendChild(span);
			cartParent.appendChild(row);
		} else {
			setUpBookDisplay(cartParent);
			for (let i = 0; i < cart.length; i++) {
				getTextbook(cart[i]).then((book) => {
					console.log(book);
					const row = document.createElement('tr');
					const cellOne = document.createElement('td');
					const cellOneHTML = `<div><a class="cart-textbook" href="/textbook?id=${book._id}">
										${book.title}</a><span class="textbook-course">${book.course}</span></div>
	                            		<div><span class="remove">Remove</span> | 
	                            		<span class="wish">Save for later</span></div>`;
					cellOne.innerHTML = cellOneHTML;
	                const cellTwo = document.createElement('td');
	                cellTwo.innerHTML = `<div class="book-price">$${(book.price / 100).toFixed(2)}</div>`;
					row.appendChild(cellOne);
					row.appendChild(cellTwo);
					cartParent.appendChild(row);
					updatePrice();
				})
			}
		}
	}).catch((error) => {
		const row = document.createElement('tr');
		const span = document.createElement('td');
		span.colSpan = "2";
		span.innerText = "Nothing in your cart!";
		row.appendChild(span);
		cartParent.appendChild(row);
	})

	loading.style.display = "none";	
}

function getCart() {
	loading.style.display = "block";
	clearDisplay(cartParent);

	const sessionCart = session.cart;
	if (sessionCart.length <= 0) {
		const row = document.createElement('tr');
		const span = document.createElement('td');
		span.colSpan = "2";
		span.style.textAlign = "center";
		span.innerText = "Nothing in your cart!";
		row.appendChild(span);
		cartParent.appendChild(row);
	} else {
		setUpBookDisplay(cartParent);
		for (let i = 0; i < sessionCart.length; i++) {
			getTextbook(sessionCart[i]).then((book) => {
				console.log(book);
				const row = document.createElement('tr');
				const cellOne = document.createElement('td');
				const cellOneHTML = `<div><a class="cart-textbook" href="/textbook?id=${book._id}">
									${book.title}</a><span class="textbook-course">${book.course}</span></div>
                            		<div><span class="remove">Remove</span></div>`;
				cellOne.innerHTML = cellOneHTML;
                const cellTwo = document.createElement('td');
                cellTwo.innerHTML = `<div class="book-price">$${(book.price / 100).toFixed(2)}</div>`;
				row.appendChild(cellOne);
				row.appendChild(cellTwo);
				cartParent.appendChild(row);
				updatePrice();
			}).catch((error) => {
				console.log("oof");
			})
		}
	}

	loading.style.display = "none";	
}




//Update the cart's subtotal,HST and total values in the DOM
function updatePriceContainer(sub,num) {
	const HST = Math.round((sub * 0.13) * 100) / 100;
	const totalCost = parseFloat(sub) + parseFloat(HST);

	console.log(sub, HST, totalCost)

	subtotal.innerText = "$" + parseFloat(sub).toFixed(2);
	numItems.innerText = "(" + parseInt(num) + " items)";
	tax.innerText = "$" + HST.toFixed(2);
	total.innerText = "$" + parseFloat(totalCost).toFixed(2);
}

//Get the subtotal price based on the sum of all the products in the cart
function updatePrice() {
	let price = 0;
	let quantity = 0;

	for (let i = 1; i < cartParent.children.length; i++) {
		price += parseFloat(cartParent.children[i].children[1].children[0].innerText.substr(1));
		quantity += 1;
	}

	updatePriceContainer(price,quantity);
}

//Remove an entry in the cart
function removeEntry(e) {
	if (e.target.classList.contains('remove') || e.target.classList.contains('wish')) {
		const id = e.target.parentElement.parentElement.children[0].children[0].href.split('=')[1];
		console.log(id);

		if (e.target.classList.contains('wish')) {
			//Send to wishlist via server call
			getUser(session.user).then((user) => {
				let userWishlist = user.wishlist;
				if (userWishlist.indexOf(id) == -1) {
					userWishlist.push(id);
				}
				data = {};
				data.wishlist = userWishlist;
				updateUser(session.user, data).then((result) => {
					console.log(result);
					console.log("Added to Wislist");
				})
			})
		}

		const entryToRemove = e.target.parentElement.parentElement.parentElement;
		const parent = entryToRemove.parentElement;
		parent.removeChild(entryToRemove);

		//Remove from cart in session
		let userCart = session.cart;
		let index = userCart.indexOf(id); 
		userCart.splice(index, 1);
		data = {};
		data.cart = userCart;
		cartSession(data).then((session) => {
			shoppingCart.innerText = session.cart.length;
		})

		if (session.user) {
			getUser(session.user).then((user) => {
				let userCart = user.cart;
				let index = userCart.indexOf(id);
				userCart.splice(index, 1);
				data = {};
				data.cart = userCart;
				updateUser(session.user, data).then((result) => {
					console.log(result);
					console.log("Removed from Cart");
				})
			})
		}

		//If the cart would become empty display said status
		if (parent.children.length == 1) {
			parent.parentElement.style.display = 'none';
			const emptyCart = document.createElement('div');
			emptyCart.className = "empty-cart";
			emptyCart.innerText = "Your Shopping Cart is empty.";
			parent.parentElement.parentElement.appendChild(emptyCart);
		}

		updatePrice();
	}
}


const subtotal = document.getElementById('subtotal');
const numItems = document.getElementById('numItems');
const tax = document.getElementById('tax');
const total = document.getElementById('total');
const cartParent = document.getElementById('cart-parent').children[0];


if (session.user) {
	console.log("getting user cart");
	getUserCart();
} else {
	console.log("getting session cart");
	getCart();
}

cartParent.addEventListener('change', updatePrice);
cartParent.addEventListener('click', removeEntry);