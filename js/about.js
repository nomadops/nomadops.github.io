

const navLinks = document.querySelectorAll(".nav-item");
const menuToggle = document.getElementById("navbarSupportedContent");
const bsCollapse = new bootstrap.Collapse(menuToggle);

  
window.addEventListener("load", function (event) {
 
  menuToggle.classList.remove("show");
});

   navLinks.forEach((l) => {
     l.addEventListener("click", () => {
       bsCollapse.toggle();
     });
   });



   const sections = document.querySelectorAll(".section");

   const observer = new IntersectionObserver((entries) => {
     entries.forEach((entry) => {
       if (entry.isIntersecting) {
         entry.target.classList.add("animate");
       }
     });
   });

   sections.forEach((section) => {
     observer.observe(section);
   });
