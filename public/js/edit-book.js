const editForm = document.getElementById('edit-popup');
const cancel = document.getElementById('cancelEdit');

editForm.onsubmit = async function(e) {
	e.preventDefault();

	const id = document.getElementById('bookId').value;
	const data = {};
	data.title = document.getElementById('bookTitleEdit').value;
	data.author = document.getElementById('authorEdit').value;
	data.owner = session.user;
	data.course = document.getElementById('courseEdit').value;
	data.category = document.getElementById('categoryEdit').value;
	data.price = document.getElementById('priceEdit').value;
	data.description = document.getElementById('descriptionEdit').value;
	
	updateTextbook(id, data).then((response) => {
		const id = response._id;

		if (document.getElementById('picEdit').files.length > 0) {
			const image = document.getElementById('picEdit').files[0];
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
					editForm.style.display = 'none';
					getInventory();
				})
			})
		}
		editForm.style.display = 'none';
		getInventory();
	});
}

async function categoryFormEdit() {
	const categories = await getCategories({});
	console.log(categories);

	const categorySelect = document.getElementById('categoryEdit');

	for (let i = 0; i < categories.length; i++) {
		const category = document.createElement('option');
		category.value = categories[i]._id;
		category.innerText = categories[i].category;
		categorySelect.appendChild(category);
	}
}

categoryFormEdit();

function editBook(e) {
	const id = e.target.parentElement.parentElement.children[0].children[0].href.split('=')[1];
	getTextbook(id).then((book) => {
		document.getElementById('bookId').value = book._id;
		document.getElementById('bookTitleEdit').value = book.title;
		document.getElementById('authorEdit').value = book.author;
		document.getElementById('courseEdit').value = book.course;
		const category = document.getElementById('categoryEdit');
		const opts = category.options;
		for (let opt, j = 0; opt = opts[j]; j++) {
		    if (opt.value == book.category) {
		      category.selectedIndex = j;
		      break;
		    }
		  }
		document.getElementById('priceEdit').value = book.price / 100;
		document.getElementById('descriptionEdit').value = book.description;

		editForm.style.display = 'block';
	})
}

function deleteBook(e) {
	const id = e.target.parentElement.parentElement.children[0].children[0].href.split('=')[1];
	deleteTextbook(id).then((book) => {
		getInventory();
	})
}

function deleteBookManager(e) {
	const id = e.target.parentElement.parentElement.children[0].children[0].href.split('=')[1];
	deleteTextbook(id).then((book) => {
		getBookManager();
	})
}

cancel.addEventListener('click', function() {
	editForm.style.display = 'none';
})