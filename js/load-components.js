export function loadComponents() {
  // Load Navbar
  function searchResult(query) {
    const searchItems = document.getElementById("searchItems");
    const searchMeme = filterMemes("search");

    if (!query.trim()) {
      searchItems.style.display = "none";
      searchItems.innerHTML = "";
      return;
    }

    const data = searchMeme.filter((meme) => {
      const titleMatch = meme.title.toLowerCase().includes(query.toLowerCase());
      const tagMatch = meme.tags.some((tag) =>
        tag.toLowerCase().includes(query.toLowerCase())
      );
      return titleMatch || tagMatch;
    });

    if (data.length === 0) {
      searchItems.innerHTML = "<div>No results found</div>";
    } else {
      searchItems.innerHTML = data
        .map(
          (meme) => `
      <div onclick="location.href='meme-single.html?id=${meme.id}'">
        ${meme.title}
      </div>
    `
        )
        .join("");
    }

    searchItems.style.display = "block";
  }
  fetch("/components/header.html")
    .then((res) => {
      return res.text();
    })
    .then((data) => {
      document.getElementById("header").innerHTML = data;
      const searchInput = document.querySelector("#searchInput");
      let timer;
      searchInput.addEventListener("input", (e) => {
        let query = e.target.value.trim();
        clearTimeout(timer);
        timer = setTimeout(() => {
          searchResult(query);
        }, 1000);
      });
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
