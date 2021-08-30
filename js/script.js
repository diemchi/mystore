let productApi = "http://localhost:3000/products"; // API server fake/ Mock API

function start() {
    getProducts(renderProducts);
}

start();

// Functions
// Fetch
function getProducts(callback) {
    fetch(productApi)
        .then(function(response) {
            return response.json();
        })
        .then(callback);
}

function addNewProduct(newProduct, callback) {
    let data = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
    }
    fetch(productApi, data)
        .then(function(response) {
            return response.json();
        })
        .then(callback);
}

function editProduct(updateProduct, callback) {
    let data = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateProduct)
    }
    fetch(productApi + "/" + updateProduct.id, data)
        .then(function(response) {
            return response.json();
        })
        .then(callback);
}

function deleteProduct(id, callback) {
    let method = {
        method: 'DELETE'
    }
    fetch(productApi + "/" + id, method)
        .then(function(response) {
            return response.json();
        })
        .then(callback);
}
// End Fetch

let listProduct = document.querySelector('#list-product');
let nameProduct = document.querySelector('input[name="name"]');
let descProduct = document.querySelector('input[name="description"]');

function renderProducts(products) {
    let innerHTML = products.map(function(product) {
        return renderProductItem(product);
    });
    listProduct.innerHTML = innerHTML.join('');

}

function renderProductItem(item) {
    return `
    <div class="product-item col-md-4" data-id="${item.id}">
        <img class="product-img" src="https://picsum.photos/400/300/?random=${item.id}">
        <h3 class="product-title">${item.name}</h3>
        <p class="product-desc">${item.description}</p>
        <div class="btn-action-group mb-3">
            <a onclick="loadDataEdit(${item.id})" class="btn btn-warning btn-edit mr-3">Sửa</a>
            <a onclick="confirmDelete(${item.id})" class="btn btn-danger btn-delete" data-toggle="modal" data-target="#modal-delete-product">Xóa</a>
        </div>
    </div>
    `
}

function confirmDelete(id) {
    let btnConfirm = document.querySelector('.btn-del-product');
    btnConfirm.setAttribute("data-id-del", id);

    btnConfirm.onclick = function() {
        deleteProduct(id, function() {
            document.querySelector('button.close').click();
            document.querySelector('.product-item[data-id="' + id + '"]').remove();
        })
    }
}

// Remove id product delete in modal
$("#modal-delete-product").on('hide.bs.modal', function (event) {
    document.querySelector('.btn-del-product').setAttribute("data-id-del", "");
});


function loadDataEdit(id) {
    let nameProduct = document.querySelector('input[name="name"]');
    let descProduct = document.querySelector('input[name="description"]');
    
    nameProduct.value = document.querySelector('.product-item[data-id="' + id + '"] .product-title').innerText;
    descProduct.value = document.querySelector('.product-item[data-id="' + id + '"] .product-desc').innerText;
    
    document.querySelector('.create-new-product h4').innerHTML = "Sửa sản phẩm";
    document.querySelector('#btn-add-product').innerHTML = "Sửa sản phẩm";
    document.querySelector('#btn-add-product').setAttribute("data-id-edit", id);
    document.querySelector('#btn-add-product').classList.add("btn-save-edit");
}

function resetForm() {
    nameProduct.value = "";
    descProduct.value = "";
    document.querySelector('.create-new-product h4').innerHTML = "Thêm sản phẩm";
    document.querySelector('#btn-add-product').innerHTML = "Thêm sản phẩm";
    document.querySelector('#btn-add-product').setAttribute("data-id-edit", "");
    document.querySelector('#btn-add-product').classList.remove("btn-save-edit");
}

// Events
document.querySelector('#btn-add-product').onclick = function () {
    if(this.getAttribute("data-id-edit") === "") { // add
        if(nameProduct.value !== "") {
            let newProduct = {
                name : nameProduct.value,
                description : descProduct.value
            }

            addNewProduct(newProduct, function(product) {
                listProduct.innerHTML += renderProductItem(product);
                nameProduct.value = "";
                descProduct.value = "";
            });
        } else {
            alert("Vui lòng nhập tên sản phẩm!")
        }
        
    } else { // edit
        let id = document.querySelector('#btn-add-product').getAttribute("data-id-edit");
        let updateProduct = {
            id : id,
            name : nameProduct.value,
            description : descProduct.value
        }
    
        editProduct(updateProduct, function(product) {
            document.querySelector('.product-item[data-id="' + id + '"] .product-title').innerHTML = product.name;
            document.querySelector('.product-item[data-id="' + id + '"] .product-desc').innerHTML = product.description;
            resetForm();
        });
    }
}
