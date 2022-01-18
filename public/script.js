let products;
// localStorage.iMarket_cart = JSON.stringify([{ id: 3, count: 1 }, { id: 5, count: 2 }, { id: 2, count: 5 }, { id: 7, count: 1 }, { id: 1, count: 10 }])

fetch("/api/products").then(response => response.json()).then(list => {
  products = list;
  showProducts(list);

  fillCart(JSON.parse(localStorage.iMarket_cart || "[]"));
  countCart();
});

document.querySelector("#wrapper .products").onclick = e => {
  if (e.target.classList.contains("buy")) {
    addToCart(+e.target.dataset.id);
    e.target.classList.remove("add");
    setTimeout(() => e.target.classList.add("add"))
  }
}

function buildProductCard(product) {
  const { id, img, title, text, price } = product;
  return `
    <img src="IMG/${img}" alt="">
    <div class="description">
      <h3 class="title">${title}</h3>
      <p class="text" title="${text}">${text}</p>
      <div>
        <h4 class="price">${format(price)}</h4>
        <button class="buy" data-id="${id}">В корзину</button>
      </div>
    </div>
  `
}

function showProducts(products) {
  const list = document.querySelector("main>.products>ul");
  list.innerHTML = products.map(buildProductCard)
    .map(html => `<li class="product">${html}</li>`).join("")
}

function buildCartItem(id, count) {
  const product = products.find(product => product.id === id);
  const {id, img, title, price } = product;
  const total = price * count;
  return `
    <img src="IMG/${img}" alt="">
    <p>${title}</p>
    <h4 class="price">
      <b>${format(total)}</b><br>
      (${format(price)} за 1шт.)
    </h4>
    <div class="count">
      <button class="remove" data-id="${id}">-1</button>
      <input type="text" readonly value="${count}">
      <button class="add" data-id="${id}">+1</button>
    </div>
  `
}

function fillCart(items) {
  const cartList = document.querySelector("#cart ul");
  const totals = document.querySelectorAll("#cart .total h3")
  const totalPrice = items
    .reduce((sum, { id, count }) => sum + products.find(product => product.id === id).price * count, 0);

  cartList.innerHTML = items.map(({ id, count }) => `
    <li>${buildCartItem(id, count)}</li>
  `).join("");

  totals.forEach(total => total.innerText = format(totalPrice))
}

function format(price){
  return `${String(price).replace(/(\d{3})$/, " $1")} грн.`
}
function closeCart(){
  document.querySelector("h1 a").click();
}
function countCart(){
  const cartLink = document.querySelector('[href="#cart"]').parentElement;
  const count = JSON.parse(localStorage.iMarket_cart || "[]").length;
  if (count) cartLink.dataset.count = count;
  else delete cartLink.dataset.count;
}
function addToCart(id){
  const cartItems = JSON.parse(localStorage.iMarket_cart || "[]");
  const itemIndex = cartItems.findIndex(item => item.id === id);
  if (itemIndex === -1) cartItems.push({id, count: 1});
  else cartItems[itemIndex].count++;
  localStorage.iMarket_cart = JSON.stringify(cartItems);
  countCart();
  fillCart(cartItems);
}

function removeFromCart(id){
  const cartItems = JSON.parse(localStorage.iMarket_cart || "[]");
  const itemIndex = cartItems.findIndex(item => item.id === id);
  if (itemIndex === -1) cartItems.push({id, count: 1});
  else cartItems[itemIndex].count++;
  localStorage.iMarket_cart = JSON.stringify(cartItems);
  countCart();
  fillCart(cartItems);
}

function emptyCart(){
  localStorage.iMarket_cart = "[]";  
  countCart();
  fillCart([]);

}