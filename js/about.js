

const navLinks = document.querySelectorAll(".nav-item");
const menuToggle = document.getElementById("navbarSupportedContent");
// const bsCollapse = new bootstrap.Collapse(menuToggle);

  // document.addEventListener("load", function (event) {
  //   //  bsCollapse.toggle();
  //   menuToggle.classList.remove("show");
  // });



   navLinks.forEach((l) => {
     l.addEventListener("click", () => {
       menuToggle.classList.remove("show");
      //  bsCollapse.toggle();
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
