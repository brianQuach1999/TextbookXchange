const profile = document.getElementById('profile');
const login = document.getElementById('login');
const logout = document.getElementById('logout');

const shoppingCart = document.getElementById('menu-shopping-number');

if (session.user) {
	profile.style.display = 'block';
	login.style.display = 'none';
	logout.style.display = 'block';
} else {
	profile.style.display = 'none';
	login.style.display = 'block';
	logout.style.display = 'none';
}

console.log(session);

shoppingCart.innerText = session.cart.length;