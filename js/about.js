const img = document.getElementById("img-main");

const navLinks = document.querySelectorAll(".nav-item");
const menuToggle = document.getElementById("navbarSupportedContent");
const bsCollapse = new bootstrap.Collapse(menuToggle);

window.addEventListener("load", function (event) {
  img.classList.add('main-img')
  menuToggle.classList.remove("show");
});

   navLinks.forEach((l) => {
     l.addEventListener("click", () => {
       bsCollapse.toggle();
     });
   });


