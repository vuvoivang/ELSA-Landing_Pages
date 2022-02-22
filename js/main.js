const getEleById = (id) => document.getElementById(id);
function scroll(element) {
    var ele = getEleById(element);
    ele.scrollIntoView();
}
// Register now button
let introRegisBtn = getEleById('introduction__btn-register');
introRegisBtn.addEventListener('click', function () {
    scroll('section-register-form');

})
// Register now button
let featuresRegisBtn = getEleById('elsa-features__btn-register');
featuresRegisBtn.addEventListener('click', function () {
    scroll('section-register-form');

})

// handle onclick for checkbox
function handleCheck(checkbox, name) {
    var checkboxes = document.getElementsByName(name);
    checkboxes.forEach((item) => {
        if (item !== checkbox) { // uncheck all other checkboxes and display price none
            item.checked = false;
            item.parentElement.nextElementSibling.style.display = "none";
        }
    })

    checkbox.parentElement.nextElementSibling.style.display = "inline-block";
    if (!checkbox.checked) {
        checkbox.parentElement.nextElementSibling.style.display = "none";
    }
}