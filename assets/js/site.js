
document.addEventListener("DOMContentLoaded", function(){
  const menu = document.querySelector(".menu-btn");
  const nav = document.querySelector(".navlinks");
  if(menu && nav){
    menu.addEventListener("click", function(){
      const open = nav.classList.toggle("mobile-open");
      if(open){
        nav.style.display="flex";
        nav.style.position="absolute";
        nav.style.top="72px";
        nav.style.left="14px";
        nav.style.right="14px";
        nav.style.padding="18px";
        nav.style.background="#071a34";
        nav.style.flexDirection="column";
        nav.style.alignItems="flex-start";
        nav.style.zIndex="50";
      } else {
        nav.removeAttribute("style");
      }
    });
  }
});
