/* Call the cusDD function on any select elements by ID or Class */
cusDD(".dropdown", "slick dark");
$(".dropdown").css('visibility','visible');

const select = document.getElementById("select");
const productParent = document.getElementById("product-parent");
const searchButton = document.getElementById("search-button");
const loading = document.getElementById("loading");

searchButton.addEventListener("click",urlQueryPushSearch);
select.addEventListener("DOMCharacterDataModified",urlQueryPushSearch);

searchProducts();

const categorySelect = document.getElementById("categories");

addCategories();

categorySelect.addEventListener("click",selectCategory);

