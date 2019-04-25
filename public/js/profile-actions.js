
function clearDisplay(display) {
	display.innerHTML = "";
}

function setUpBookDisplay(display) {
	display.innerHTML = `<tr><th></th><th><div>Price</div></th></tr>`
}

function setUpUserDisplay(display) {
	display.innerHTML = `<tr><th><div>Name</div></th><th><div>Actions</div></th></tr>`
}

function getInventory() {
	loading.style.display = "block";
	const inventory = document.getElementById('inventory-parent').children[0];
	clearDisplay(inventory);

	query = {};
	query.owner = session.user;
	getTextbooks(query).then((result) => {
		console.log(result);
		if (result.length <= 0) {
			const row = document.createElement('tr');
			const span = document.createElement('td');
			span.colSpan = "2";
			span.style.textAlign = "center";
			span.innerText = "Nothing in your inventory!";
			row.appendChild(span);
			inventory.appendChild(row);
		} else {
			setUpBookDisplay(inventory);
			for (let i = 0; i < result.length; i++) {
				const row = document.createElement('tr');
				const cellOne = document.createElement('td');
				const cellOneHTML = `<div><a class="cart-textbook" href="/textbook?id=${result[i]._id}">
									${result[i].title}</a><span class="textbook-course">${result[i].course}
									</span></div><div><span class="edit" onclick="editBook(event)">Edit</span> | 
									<span class="delete" onclick="deleteBook(event)">Delete</span></div>`;
				cellOne.innerHTML = cellOneHTML;
                const cellTwo = document.createElement('td');
                cellTwo.innerHTML = `<div>$${(result[i].price / 100).toFixed(2)}</div>`;
				row.appendChild(cellOne);
				row.appendChild(cellTwo);
				inventory.appendChild(row);
			}
		}
	}).catch((error) => {
		const row = document.createElement('tr');
		const span = document.createElement('td');
		span.colSpan = "2";
		span.innerText = "Nothing in your inventory!";
		row.appendChild(span);
		inventory.appendChild(row);
	})
	loading.style.display = "none";	
}

function getWishlist() {
	loading.style.display = "block";
	const wishlist = document.getElementById('cart-parent').children[0];
	clearDisplay(wishlist);

	getUser(session.user).then((result) => {
		console.log(result);
		const userWishlist = result.wishlist;
		if (userWishlist.length <= 0) {
			const row = document.createElement('tr');
			const span = document.createElement('td');
			span.colSpan = "2";
			span.style.textAlign = "center";
			span.innerText = "Nothing in your wishlist!";
			row.appendChild(span);
			wishlist.appendChild(row);
		} else {
			setUpBookDisplay(wishlist);
			for (let i = 0; i < userWishlist.length; i++) {
				getTextbook(userWishlist[i]).then((book) => {
					const row = document.createElement('tr');
					const cellOne = document.createElement('td');
					const cellOneHTML = `<div><a class="cart-textbook" href="/textbook?id=${book._id}">
										${book.title}</a><span class="textbook-course">${book.course}
										</span></div><div><span class="remove" onclick="removeWish(event)">Remove</span> | 
									<span class="cart" onclick="cartBook(event)">Add to Cart</span></div>`;
					cellOne.innerHTML = cellOneHTML;
	                const cellTwo = document.createElement('td');
	                cellTwo.innerHTML = `<div>$${(book.price / 100).toFixed(2)}</div>`;
					row.appendChild(cellOne);
					row.appendChild(cellTwo);
					wishlist.appendChild(row);
				}).catch((error) => {
					const row = document.createElement('tr');
					const span = document.createElement('td');
					span.colSpan = "2";
					span.innerText = "Nothing in your wishlist!";
					row.appendChild(span);
					wishlist.appendChild(row);
				})
			}
		}
	}).catch((error) => {
		const row = document.createElement('tr');
		const span = document.createElement('td');
		span.colSpan = "2";
		span.innerText = "You don't exist!";
		row.appendChild(span);
		wishlist.appendChild(row);
	})
	loading.style.display = "none";	
}

function getBookManager() {
	loading.style.display = "block";
	const manager = document.getElementById('book-parent').children[0];
	clearDisplay(manager);

	query = {};
	getTextbooks(query).then((result) => {
		console.log(result);
		if (result.length <= 0) {
			const row = document.createElement('tr');
			const span = document.createElement('td');
			span.colSpan = "2";
			span.style.textAlign = "center";
			span.innerText = "Nothing in the system!";
			row.appendChild(span);
			manager.appendChild(row);
		} else {
			setUpBookDisplay(manager);
			for (let i = 0; i < result.length; i++) {
				const row = document.createElement('tr');
				const cellOne = document.createElement('td');
				const cellOneHTML = `<div><a class="cart-textbook" href="/textbook?id=${result[i]._id}">
									${result[i].title}</a><span class="textbook-course">${result[i].course}
									</span></div><div><span class="edit" onclick="editBook(event)">Edit</span> | 
									<span class="delete" onclick="deleteBookManager(event)">Delete</span></div>`;
				cellOne.innerHTML = cellOneHTML;
                const cellTwo = document.createElement('td');
                cellTwo.innerHTML = `<div>$${(result[i].price / 100).toFixed(2)}</div>`;
				row.appendChild(cellOne);
				row.appendChild(cellTwo);
				manager.appendChild(row);
			}
		}
	}).catch((error) => {
		const row = document.createElement('tr');
		const span = document.createElement('td');
		span.colSpan = "2";
		span.innerText = "Nothing in the system!";
		row.appendChild(span);
		manager.appendChild(row);
	})
	loading.style.display = "none";	
}

function getUserManager() {
	loading.style.display = "block";
	const manager = document.getElementById('user-parent').children[0];
	clearDisplay(manager);

	query = {};
	getUsers(query).then((result) => {
		console.log(result);
		if (result.length <= 0) {
			const row = document.createElement('tr');
			const span = document.createElement('td');
			span.colSpan = "2";
			span.style.textAlign = "center";
			span.innerText = "Nothing in the system!";
			row.appendChild(span);
			manager.appendChild(row);
		} else {
			setUpUserDisplay(manager);
			for (let i = 0; i < result.length; i++) {
				const row = document.createElement('tr');
				const cellOne = document.createElement('td');
				cellOne.innerHTML = `<div><a class="cart-textbook" title="${result[i]._id}">${result[i].username}</a></div>`;
                const cellTwo = document.createElement('td');
                cellTwo.innerHTML = `<div><span class="delete" onclick="editUser(event)">Edit</span> | 
                					<span class="delete" onclick="removeUser(event)">Delete</span></div>`;
				row.appendChild(cellOne);
				row.appendChild(cellTwo);
				manager.appendChild(row);
			}
		}
	}).catch((error) => {
		const row = document.createElement('tr');
		const span = document.createElement('td');
		span.colSpan = "2";
		span.innerText = "Nothing in the system!";
		row.appendChild(span);
		manager.appendChild(row);
	})
	loading.style.display = "none";	
}


function removeWish(e) {
	const id = e.target.parentElement.parentElement.children[0].children[0].href.split('=')[1];

	getUser(session.user).then((user) => {
		let userWishlist = user.wishlist;
		let index = userWishlist.indexOf(id);
		userWishlist.splice(index, 1);
		data = {};
		data.wishlist = userWishlist;
		updateUser(session.user, data).then((result) => {
			console.log(result);
			console.log("Removed from Wislist");

			getWishlist();
		})
	})
}

function cartBook(e) {
	const id = e.target.parentElement.parentElement.children[0].children[0].href.split('=')[1];

	getUser(session.user).then((user) => {
		let userWishlist = user.wishlist;
		let index = userWishlist.indexOf(id);
		userWishlist.splice(index, 1);
		let userCart = user.cart;
		if (userCart.indexOf(id) == -1) {
			userCart.push(id);
		}
		data = {};
		data.wishlist = userWishlist;
		data.cart = userCart;
		updateUser(session.user, data).then((result) => {
			console.log(result);
			console.log("Moved to Cart");

			getWishlist();
			let sessionCart = session.cart;
			if (sessionCart.indexOf(id) == -1) {
				sessionCart.push(id);
			}
			data = {};
			data.cart = sessionCart;
			cartSession(data).then((session) => {
				shoppingCart.innerText = session.cart.length;
			})
		})
	})
}

function editUser(e) {
	if (e.target) {
		const id = e.target.parentElement.parentElement.parentElement.children[0].children[0].children[0].title;
		console.log(id);
		getUser(id).then((user) => {
			console.log(user)
			document.getElementById('userId').value = user._id;
			document.getElementById('usernameEdit').value = user.username;
			const type = document.getElementById('userType');
			const opts = type.options;
			for (let opt, j = 0; opt = opts[j]; j++) {
			    if (opt.value == user.type) {
			      type.selectedIndex = j;
			      break;
			    }
			  }

			document.getElementById('user-popup').style.display = 'block';
		})
	}
}

document.getElementById('cancelUser').addEventListener('click', function() {
	document.getElementById('user-popup').style.display = 'none';
})

document.getElementById('user-popup').onsubmit = async function(e) {
	e.preventDefault();

	const id = document.getElementById('userId').value;
	const data = {};
	data.username = document.getElementById('username').value;
	data.type = document.getElementById('userType').value;
	
	updateUser(id, data).then((response) => {
		const id = response._id;
		document.getElementById('user-popup').style.display = 'none';
		getUserManager();
	});
}



function removeUser(e) {
	if (e.target) {
		const id = e.target.parentElement.parentElement.parentElement.children[0].children[0].children[0].title;
		console.log(id);
		deleteUser(id).then((user) => {
			getUserManager();
		})
	}
}