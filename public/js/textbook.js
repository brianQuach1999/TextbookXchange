const queryParams = new URLSearchParams(window.location.search);
const id = queryParams.get('id');

getTextbook(id).then((result) => {
	console.log(result);

	const product = document.getElementById('product');

	product.innerHTML = "";

	const title = document.createElement('h4');
	title.innerText = result.title;

	const price = document.createElement('h5');
	price.innerText = "$" + parseFloat(result.price / 100).toFixed(2);

	const description = document.createElement('p');
	description.innerText = result.description;

	const image = document.getElementById('image');
	image.src = "/img/" + result.image;

	product.appendChild(title);
	product.appendChild(price);
	product.appendChild(description);
});

const cart = document.getElementById('cart');
const wishlist = document.getElementById('wishlist');

if (session.user) {
	wishlist.style.display = 'block';
} else {
	wishlist.style.display = 'none';
}

cart.addEventListener('click', function(e) {
	e.preventDefault();
	if (session.user) {
		getUser(session.user).then((user) => {
			let userCart = user.cart;
			if (userCart.indexOf(id) == -1) {
				userCart.push(id);
			}
			data = {};
			data.cart = userCart;
			updateUser(session.user, data).then((result) => {
				console.log(result);
				console.log("Added to Cart");
			});
		})
	}
	let userCart = session.cart;
	if (userCart.indexOf(id) == -1) {
		userCart.push(id);
	}
	data = {};
	data.cart = userCart;
	cartSession(data).then((session) => {
		shoppingCart.innerText = session.cart.length;
			console.log(session);

	})
})

wishlist.addEventListener('click', function() {
	getUser(session.user).then((user) => {
		let userWishlist = user.cart;
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
})