const img = document.getElementById("img-main");
console.log(img)
window.addEventListener("load", function (event) {
  console.log("All resources finished loading!");
  img.classList.add('main-img')
});
