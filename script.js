
"use strict";

// დემო პროდუქტები — ფასები არ არის SPAR-ის რეალური ფასები.
const products = [
  { id: 1, name: "რძე", size: "1 ლ", category: "რძის ნაწარმი", price: 3.49, old: 4.49, emoji: "🥛" },
  { id: 2, name: "იოგურტი", size: "400 გ", category: "რძის ნაწარმი", price: 2.29, old: 2.89, emoji: "🥣" },
  { id: 3, name: "ყველი", size: "250 გ", category: "რძის ნაწარმი", price: 5.90, old: null, emoji: "🧀" },
  { id: 4, name: "კარაქი", size: "200 გ", category: "რძის ნაწარმი", price: 4.79, old: 5.49, emoji: "🧈" },
  { id: 5, name: "ბანანი", size: "1 კგ", category: "ხილი და ბოსტნეული", price: 3.20, old: 4.20, emoji: "🍌" },
  { id: 6, name: "ვაშლი", size: "1 კგ", category: "ხილი და ბოსტნეული", price: 2.80, old: null, emoji: "🍎" },
  { id: 7, name: "პომიდორი", size: "1 კგ", category: "ხილი და ბოსტნეული", price: 4.50, old: 5.90, emoji: "🍅" },
  { id: 8, name: "პური", size: "1 ცალი", category: "პური და ცომეული", price: 1.80, old: null, emoji: "🥖" },
  { id: 9, name: "კრუასანი", size: "1 ცალი", category: "პური და ცომეული", price: 2.50, old: 3.20, emoji: "🥐" },
  { id: 10, name: "შოკოლადი", size: "100 გ", category: "ტკბილეული", price: 3.60, old: 4.50, emoji: "🍫" },
  { id: 11, name: "ორცხობილა", size: "180 გ", category: "ტკბილეული", price: 2.90, old: null, emoji: "🍪" },
  { id: 12, name: "ჩიფსი", size: "130 გ", category: "სნექები", price: 3.20, old: 3.90, emoji: "🥔" },
  { id: 13, name: "გაზიანი სასმელი", size: "1.5 ლ", category: "სასმელები", price: 3.50, old: null, emoji: "🥤" },
  { id: 14, name: "წყალი", size: "1.5 ლ", category: "სასმელები", price: 1.20, old: 1.50, emoji: "💧" },
  { id: 15, name: "ყავა", size: "100 გ", category: "სასმელები", price: 8.90, old: null, emoji: "☕" },
  { id: 16, name: "კვერცხი", size: "10 ცალი", category: "სხვა პროდუქტები", price: 5.20, old: 5.90, emoji: "🥚" },
  { id: 17, name: "მაკარონი", size: "500 გ", category: "სხვა პროდუქტები", price: 2.70, old: null, emoji: "🍝" },
  { id: 18, name: "სარეცხი საშუალება", size: "1 ლ", category: "საყოფაცხოვრებო", price: 9.90, old: 12.50, emoji: "🧴" }
];

const categories = [
  { name: "რძის ნაწარმი", emoji: "🥛" },
  { name: "ხილი და ბოსტნეული", emoji: "🍎" },
  { name: "პური და ცომეული", emoji: "🥖" },
  { name: "ტკბილეული", emoji: "🍫" },
  { name: "სნექები", emoji: "🍿" },
  { name: "სასმელები", emoji: "🥤" },
  { name: "სხვა პროდუქტები", emoji: "🥚" },
  { name: "საყოფაცხოვრებო", emoji: "🧴" }
];

// ეს ჩანაწერები მაგალითებია და არა დადასტურებული ფილიალების სია.
const stores = [
  { city: "ბათუმი", name: "SPAR — ბათუმი", address: "ზუსტი მისამართი გადაამოწმე ოფიციალურ საიტზე" },
  { city: "თბილისი", name: "SPAR — თბილისი", address: "ზუსტი მისამართი გადაამოწმე ოფიციალურ საიტზე" },
  { city: "ქუთაისი", name: "SPAR — ქუთაისი", address: "ზუსტი მისამართი გადაამოწმე ოფიციალურ საიტზე" },
  { city: "რუსთავი", name: "SPAR — რუსთავი", address: "ზუსტი მისამართი გადაამოწმე ოფიციალურ საიტზე" }
];

// აპლიკაციის მდგომარეობა
let selectedCategory = "ყველა";
let searchText = "";
let cart = {};
let favorites = new Set();
let toastTimer;

const $ = id => document.getElementById(id);

const money = value =>
  value.toLocaleString("ka-GE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + " ₾";

const discount = product =>
  product.old
    ? Math.round((1 - product.price / product.old) * 100)
    : 0;

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

// გვერდებს შორის გადასვლა
function openPage(page) {
  const target = $("page-" + page);
  if (!target) return;

  document.querySelectorAll(".page").forEach(section => {
    section.classList.toggle("active", section === target);
  });

  document.querySelectorAll("[data-page]").forEach(button => {
    button.classList.toggle("active", button.dataset.page === page);
  });

  if (page === "products") renderProducts();
  if (page === "deals") renderDeals();
  if (page === "favorites") renderFavorites();
  if (page === "cart") renderCart();
  if (page === "stores") renderStores();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// პროდუქტის ბარათის შექმნა
function productCard(product) {
  const isFavorite = favorites.has(product.id);

  return `
    <article class="product-card">
      <div class="product-image">
        ${product.old ? `
          <span class="discount">-${discount(product)}%</span>
        ` : ""}

        <button
          class="favorite-btn ${isFavorite ? "saved" : ""}"
          data-favorite="${product.id}"
          aria-label="რჩეულებში დამატება"
          aria-pressed="${isFavorite}">
          ${isFavorite ? "♥" : "♡"}
        </button>

        <span class="product-emoji">${product.emoji}</span>
      </div>

      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-size">${product.size}</div>

        <div class="price-line">
          <span class="price">${money(product.price)}</span>
          ${product.old
            ? `<span class="old-price">${money(product.old)}</span>`
            : ""}
        </div>

        <button class="add-button" data-add="${product.id}">
          + კალათაში დამატება
        </button>
      </div>
    </article>
  `;
}

// კატეგორიების ღილაკები
function renderCategories() {
  $("homeCategories").innerHTML = categories.map(category => `
    <button class="category-card" data-category="${category.name}">
      <span class="category-emoji">${category.emoji}</span>
      <strong>${category.name}</strong>
    </button>
  `).join("");

  const allCategories = ["ყველა", ...categories.map(c => c.name)];

  $("categoryFilters").innerHTML = allCategories.map(name => {
    const category = categories.find(c => c.name === name);
    const emoji = category ? category.emoji : "🛍️";

    return `
      <button
        class="filter-btn ${selectedCategory === name ? "active" : ""}"
        data-filter="${name}">
        ${emoji} ${name}
      </button>
    `;
  }).join("");
}

// პროდუქტების გაფილტვრა და დალაგება
function getFilteredProducts() {
  let result = products.filter(product => {
    const matchesCategory =
      selectedCategory === "ყველა" ||
      product.category === selectedCategory;

    const searchable =
      `${product.name} ${product.category} ${product.size}`.toLocaleLowerCase("ka");

    const matchesSearch =
      searchable.includes(searchText.toLocaleLowerCase("ka"));

    return matchesCategory && matchesSearch;
  });

  const sort = $("sortSelect").value;

  if (sort === "low") {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === "discount") {
    result.sort((a, b) => discount(b) - discount(a));
  }

  return result;
}

function renderProducts() {
  const result = getFilteredProducts();

  $("allProducts").innerHTML = result.map(productCard).join("");
  $("productCount").textContent = result.length + " პროდუქტი";
  $("resultsLabel").textContent =
    searchText ? `ძიება: ${searchText}` : "პროდუქტების სია";

  $("noProducts").classList.toggle("hidden", result.length > 0);

  renderCategories();
}

function renderDeals() {
  const deals = products.filter(product => product.old !== null);
  $("dealProducts").innerHTML = deals.map(productCard).join("");
}

function renderFeatured() {
  $("featuredProducts").innerHTML =
    products.slice(0, 4).map(productCard).join("");
}

// რჩეულები
function renderFavorites() {
  const result = products.filter(product => favorites.has(product.id));

  $("favoriteProducts").innerHTML = result.map(productCard).join("");
  $("noFavorites").classList.toggle("hidden", result.length > 0);
}

function toggleFavorite(id) {
  if (favorites.has(id)) {
    favorites.delete(id);
    showToast("პროდუქტი რჩეულებიდან წაიშალა");
  } else {
    favorites.add(id);
    showToast("პროდუქტი რჩეულებში დაემატა");
  }

  renderFeatured();
  renderProducts();
  renderDeals();
  renderFavorites();
}

// კალათის ფუნქციები
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  showToast("პროდუქტი კალათაში დაემატა");
}

function changeQuantity(id, amount) {
  cart[id] = (cart[id] || 0) + amount;

  if (cart[id] <= 0) {
    delete cart[id];
  }

  renderCart();
}

function renderCart() {
  const entries = Object.entries(cart)
    .map(([id, quantity]) => ({
      product: products.find(p => p.id === Number(id)),
      quantity
    }))
    .filter(item => item.product && item.quantity > 0);

  const totalQuantity = entries.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const totalPrice = entries.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 0
  );

  $("cartCount").textContent = totalQuantity;

  $("cartItems").innerHTML = entries.map(({ product, quantity }) => `
    <article class="cart-row">
      <span class="cart-emoji">${product.emoji}</span>

      <div class="cart-info">
        <strong>${product.name}</strong>
        <span>${money(product.price * quantity)}</span>
        <div class="muted">${product.size}</div>
      </div>

      <div class="quantity">
        <button data-quantity="${product.id}" data-change="-1"
          aria-label="რაოდენობის შემცირება">−</button>
        <b>${quantity}</b>
        <button data-quantity="${product.id}" data-change="1"
          aria-label="რაოდენობის გაზრდა">+</button>
      </div>
    </article>
  `).join("");

  const empty = entries.length === 0;

  $("emptyCart").classList.toggle("hidden", !empty);
  $("cartSummary").classList.toggle("hidden", empty);
  $("clearCart").classList.toggle("hidden", empty);
  $("finishList").classList.toggle("hidden", empty);

  $("cartSummary").innerHTML = empty ? "" : `
    <div class="summary-line">
      <span>პროდუქტების რაოდენობა</span>
      <strong>${totalQuantity}</strong>
    </div>

    <div class="summary-line summary-total">
      <span>სავარაუდო ჯამი</span>
      <span>${money(totalPrice)}</span>
    </div>
  `;
}

// ფილიალების ძიება
function renderStores() {
  const query = $("storeSearch").value.trim().toLocaleLowerCase("ka");

  const result = stores.filter(store =>
    `${store.city} ${store.name}`.toLocaleLowerCase("ka").includes(query)
  );

  $("storeList").innerHTML = result.length
    ? result.map(store => `
        <article class="store-card">
          <h3>🏪 ${store.name}</h3>
          <p>📍 ${store.address}</p>
        </article>
      `).join("")
    : `<p class="empty">ასეთი ქალაქი ვერ მოიძებნა.</p>`;
}

// ღილაკების საერთო დამმუშავებელი
document.addEventListener("click", event => {
  const pageButton = event.target.closest("[data-page]");

  if (pageButton) {
    event.preventDefault();
    openPage(pageButton.dataset.page);
    return;
  }

  const addButton = event.target.closest("[data-add]");

  if (addButton) {
    addToCart(Number(addButton.dataset.add));
    return;
  }

  const favoriteButton = event.target.closest("[data-favorite]");

  if (favoriteButton) {
    toggleFavorite(Number(favoriteButton.dataset.favorite));
    return;
  }

  const categoryButton = event.target.closest("[data-category]");

  if (categoryButton) {
    selectedCategory = categoryButton.dataset.category;
    openPage("products");
    renderProducts();
    return;
  }

  const filterButton = event.target.closest("[data-filter]");

  if (filterButton) {
    selectedCategory = filterButton.dataset.filter;
    renderProducts();
    return;
  }

  const quantityButton = event.target.closest("[data-quantity]");

  if (quantityButton) {
    changeQuantity(
      Number(quantityButton.dataset.quantity),
      Number(quantityButton.dataset.change)
    );
    return;
  }

  if (event.target.closest("#clearCart")) {
    cart = {};
    renderCart();
    showToast("კალათა გასუფთავდა");
    return;
  }

  if (event.target.closest("#finishList")) {
    showToast("საყიდლების სია მზადაა! ეს არ არის შეკვეთის გადახდის სისტემა.");
  }
});

// პროდუქტის ძიება
$("searchInput").addEventListener("input", event => {
  searchText = event.target.value.trim();

  if (searchText) {
    openPage("products");
  }

  renderProducts();
});

$("clearSearch").addEventListener("click", () => {
  $("searchInput").value = "";
  searchText = "";
  renderProducts();
  $("searchInput").focus();
});

// ფილიალის ძიება
$("storeSearch").addEventListener("input", renderStores);

$("clearStoreSearch").addEventListener("click", () => {
  $("storeSearch").value = "";
  renderStores();
  $("storeSearch").focus();
});

// დალაგება ფასის ან ფასდაკლების მიხედვით
$("sortSelect").addEventListener("change", renderProducts);

// აპლიკაციის საწყისი ჩატვირთვა
renderCategories();
renderFeatured();
renderProducts();
renderDeals();
renderStores();
renderCart();
