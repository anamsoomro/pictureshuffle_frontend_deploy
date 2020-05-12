function createLeaderBoard (){ 
  const table = document.createElement("table")
  const titlesTr = document.createElement("tr")
  const imgTh = document.createElement("th")
  imgTh.innerText = "image"
  const movesTh = document.createElement("th")
  movesTh.innerText = "least moves"
  const timeTh = document.createElement("th")
  timeTh.innerText = "least time"
  assignClassName([imgTh, movesTh, timeTh, titlesTr, table], "leaderBoard")
  titlesTr.append(imgTh, movesTh, timeTh)
  table.append(titlesTr)
  fetch(IMAGES_URL+"/stats")
  .then(resp => resp.json())
  .then(imgsWithStats => {
    imgsWithStats["stats"].forEach( img => {
      const imageTr = document.createElement("tr")
      const imageTd = document.createElement("td")
      const gameImg = document.createElement("img")
      gameImg.src = img["image"]["image_url"]
      gameImg.className = "gallery"
      imageTd.append(gameImg)
      const movesTd = document.createElement("td")
      const timeTd = document.createElement("td")
      if (img["game"] != "none") {
        movesTd.innerText = `${img["game"]["byMoves"]["user"]} - ${img["game"]["byMoves"]["moves"]}`
        timeTd.innerText = `${img["game"]["byTime"]["user"]} - ${img["game"]["byTime"]["time"]}`
      } else {
        movesTd.innerText = "no games played"
        timeTd.innerText = "no games played"
      }
      assignClassName([imageTd, movesTd, timeTd], "leaderBoard")
      imageTr.append(imageTd, movesTd, timeTd)
      table.append(imageTr)
    })
    leaderBoardDiv.append(table)
  })
  function assignClassName (elementsArr, classN){
    elementsArr.forEach (element => {
      element.className = classN
    })
  }
}

  
  // show image in puzzle gallery for new games
  function showImage(image, openGame = null){
    let img = document.createElement("img")
    img.src = image.image_url
    if (openGame) img.id = `gameId${openGame.id}`
    img.className = "gallery" 
    img.addEventListener("click", ()=>{
      showDiv.style.display = "grid"
      if (time) clearInterval(time)
      currentImage = image
      currentGame = null 
      openGame ? showExistingGame(openGame) : showNewGame()
      togglePlayPause() 
    }) 
    subMenuDiv.append(img)
  }

  // show users unfinished games
  function showGames(openGames){
    openGames.forEach(openGame => {
      fetch(IMAGES_URL + "/" + openGame.image_id)
      .then(resp => resp.json())
      .then(image => {showImage(image, openGame)})
    })
  }