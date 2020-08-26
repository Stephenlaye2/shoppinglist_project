// Create Product class
class Product {
  constructor(name, category, price) {
    this.name = name;
    this.category = category;
    this.price = price;
  }
}
// Create User Interface (UI) class
class UI {
  addProductToList(product) {
    const list = document.getElementById("product-list");
    // Create tr element
    const row = document.createElement("tr");

    // Add class name
    row.className = "t-row";

    // create inner html of table data with td tags
    row.innerHTML = `
    <td>${product.name}</td>
    <td>${product.category}</td>
    <td>£${product.price}</td>
    <td> <a href="#" class='delete'>delete</a></td>
    `;

    // Append row to list
    list.appendChild(row);
  }

  showAlert(message, className) {
    // Create div element
    const div = document.createElement("div");
    // Add class name
    div.className = `alert ${className}`;

    div.appendChild(document.createTextNode(message));

    // Specify the location of the div in the document by creating container and heading variables
    const container = document.querySelector(".container");
    const heading = document.querySelector(".heading");

    // Insert the div inside the container just before the form
    container.insertBefore(div, heading);

    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  clearFields() {
    document.getElementById("name").value = "";
    document.getElementById("category").value = "";
    document.getElementById("price").value = "";
  }

  deleteProduct(deleteItem) {
    deleteItem.remove();
  }
}

// Add product to local storage
class Store {
  static getProduct() {
    let products;
    if (localStorage.getItem("products") === null) {
      products = [];
    } else {
      products = JSON.parse(localStorage.getItem("products"));
    }

    return products;
  }

  static addProduct(product) {
    const products = Store.getProduct();
    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));
  }

  static displayProduct() {
    const products = Store.getProduct();
    products.forEach(function (product) {
      const ui = new UI();
      ui.addProductToList(product);
    });
  }
  static removeProduct(target) {
    const products = Store.getProduct();
    products.forEach(function (product, index) {
      if (product.name === target) {
        products.splice(index, 1);
      }
    });
    localStorage.setItem("products", JSON.stringify(products));
  }

  static calculatePrice() {
    const products = Store.getProduct();
    let prices = [];
    products.forEach((eachPrice) => {
      prices.push(parseFloat(eachPrice.price));
    });

    let total = 0;
    for (let i = 0; i < prices.length; i++) {
      total += prices[i];
    }
    // let total = prices.reduce((a, b) => {
    //   return a + b;
    // }, 0);
    document.getElementById("total-price").value = `£${total.toFixed(2)}`;

    localStorage.setItem("products", JSON.stringify(products));
  }

  static countProduct() {
    const products = Store.getProduct();
    let addItem = 0;
    products.forEach((eachProduct) => {
      let i = 1;
      addItem += i;
    });

    document.getElementById("total-product").value = addItem;

    localStorage.setItem("product", JSON.stringify(products));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  Store.displayProduct();
  Store.calculatePrice();
  Store.countProduct();
});

// Event listener for submitting product form
const submitEvent = document.querySelector("#form-card");
submitEvent.addEventListener("submit", (e) => {
  const name = document.getElementById("name").value,
    category = document.getElementById("category").value,
    price = document.getElementById("price").value;

  // Instantiate Product
  const product = new Product(name, category, price);
  // Instantiate UI
  const ui = new UI();

  // Conditions
  if (name === "" || category === "" || price === "") {
    ui.showAlert("Please provide enough information", "error");
  } else {
    ui.addProductToList(product);
    Store.addProduct(product);
    ui.clearFields();
    Store.calculatePrice();
    Store.countProduct();

    ui.showAlert(
      `${product.name}: £${product.price} successfully added`,
      "success"
    );
  }

  // console.log(name, category, price);
  e.preventDefault();
});

// DELETE EVENT
document.querySelector("#product-list").addEventListener("click", function (e) {
  // Instantiate UI class
  const ui = new UI();

  if (e.target.className === "delete") {
    // Call deleteProduct method
    ui.deleteProduct(e.target.parentElement.parentElement);

    // Target the the children of the parent element of the 'delete'
    const firstChildren = e.target.parentElement.parentElement.children;

    // Use the text of the first child of the targeted children elements
    Store.removeProduct(firstChildren[0].textContent);

    var c = e.target.parentElement.parentElement.children;
    const actualPrice = parseFloat(c[2].textContent);

    Store.calculatePrice();
    Store.countProduct();

    // Call showAlert method
    ui.showAlert(
      `${e.target.parentElement.parentElement.firstElementChild.textContent}: £${actualPrice} successfully removed`,
      "success"
    );
  }

  e.preventDefault();
});
