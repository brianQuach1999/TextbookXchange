"use strict"

async function signUpButtonClick() {

	const data = {};
	data.username = document.getElementById('username').value;
	data.password = document.getElementById('password').value;
	data.type = "User";

	addUser(data).then((response) => {
		window.location.href = "/profile"
	});
}