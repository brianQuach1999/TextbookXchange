const addBookButton = document.getElementById('add-book');
const popupForm = document.getElementById('add-popup');
const cancelEdit = document.getElementById('cancel');

popupForm.onsubmit = async function(e) {
	e.preventDefault();

	const data = {};
	data.title = document.getElementById('bookTitle').value;
	data.author = document.getElementById('author').value;
	data.owner = session.user;
	data.course = document.getElementById('course').value;
	data.category = document.getElementById('category').value;
	data.price = parseFloat(document.getElementById('price').value);
	data.description = document.getElementById('description').value;
	
	addTextbook(data).then((response) => {
		const id = response._id;

		const image = document.getElementById('pic').files[0];
		const extenstion = image.name.split('.')[image.name.split('.').length-1];
		const blob = image.slice(0, image.size, 'image/*'); 
		newFile = new File([blob], "textbook-" + id + "." + extenstion, {type: 'image/*'});

		const formData = new FormData();
		formData.append('image', newFile);

		addUpload(formData).then((path) => {
			console.log(path);

			const update = {};
			update.image = path.originalname;

			updateTextbook(id, update).then((result) => {
				getInventory();
				popupForm.style.display = 'none';
			})
		})
	});
}

async function categoryForm() {
	const categories = await getCategories({});
	console.log(categories);

	const categorySelect = document.getElementById('category');

	for (let i = 0; i < categories.length; i++) {
		const category = document.createElement('option');
		category.value = categories[i]._id;
		category.innerText = categories[i].category;
		categorySelect.appendChild(category);
	}
}

categoryForm();

addBookButton.addEventListener('click', function() {
	popupForm.style.display = 'block';
})

cancelEdit.addEventListener('click', function() {
	popupForm.style.display = 'none';
})