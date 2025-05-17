document.addEventListener("DOMContentLoaded", () => {
  const gameClose = document.getElementById("game-close");
  const memeGamesDiv = document.getElementById("meme-games");

  gameClose.addEventListener("click", () => {
    memeGamesDiv.style.display = 'none'
  });
});
