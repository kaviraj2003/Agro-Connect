function submitForm() {
    var nameInput = document.getElementById('name');
    var email=document.getElementById('email');
    var mobileInput = document.getElementById('phone');
    var productNameInput = document.getElementById('product');
    var placeInput = document.getElementById('place');
    var districtInput = document.getElementById('district');
    var productquantity=document.getElementById('productqu');
    var shopname = document.getElementById('shopname');
    var imageInput = document.getElementById('image');

    if (nameInput.value.trim() === '' || mobileInput.value.trim() === '' ||
        productNameInput.value.trim() === '' || placeInput.value.trim() === '' ||
        districtInput.value.trim() === '' || email.value.trim() === '' ||
        shopname.value.trim() === '' || !imageInput.files[0]||productquantity.value.trim()==='') {
        alert('Please fill in all the required fields.');
        return;
    }

    var formData = {
        name: nameInput.value,
        email:email.value,
        mobile: mobileInput.value,
        productName: productNameInput.value,
        place: placeInput.value,
        district: districtInput.value,
        shopname: shopname.value,
        productquantity:productquantity.value, 
        image: URL.createObjectURL(imageInput.files[0]) 
    };

    var storedData = localStorage.getItem('agroFormData');
    var dataArray = storedData ? JSON.parse(storedData) : [];

    if (!Array.isArray(dataArray)) {
        dataArray = [];
    }

    dataArray.push(formData);

    localStorage.setItem('agroFormData', JSON.stringify(dataArray));

    window.open('vege.html', '_blank');
}
document.addEventListener('DOMContentLoaded', function () {
    var postForm = document.getElementById('postForm');
    postForm.addEventListener('submit', submitForm);
});
