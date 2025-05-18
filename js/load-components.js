export function loadComponents() {
  // Load Navbar
  fetch("/components/header.html")
    .then((res) => {
      return res.text();
    })
    .then((data) => {
      document.getElementById("header").innerHTML = data;
    });

  // Left sidebar
  if (document.getElementById("left-sidebar")) {
    fetch("/components/left-sidebar.html")
      .then((res) => {
        return res.text();
      })
      .then((data) => {
        document.getElementById("left-sidebar").innerHTML = data;
        setupFilterListeners();
      });
  }

  // Right sidebar
  if (document.getElementById("right-sidebar")) {
    fetch("/components/right-sidebar.html")
      .then((res) => {
        return res.text();
      })
      .then((data) => { 
        document.getElementById("right-sidebar").innerHTML = data;
        
        // const button = document.querySelector(".generate-btn");
        // const toggleBtn = document.querySelector("#toggle-btn");
        // if(window.location.href.includes("ai-meme-gernate.html")){
        //     button.style.display ='none'
        // }
        // if (button) {
        //   button.addEventListener("click", () => {
        //     window.location.href = "/ai-meme-gernate.html";
        //   });
        // //   console.log("clic");
        // }
        //  if(!window.location.href.includes("index.html")){
        //     toggleBtn.style.display ='none'
        // }
        // if(toggleBtn){
        //     toggleBtn.addEventListener("click",()=>{
        //         const memeGames = document.querySelector('#meme-games')
        //         memeGames.style.display = 'flex'
        //     })
        // }
      });
  }
}
