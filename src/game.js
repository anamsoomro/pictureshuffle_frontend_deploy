const boardHTML = 
    `<table id="game-board" class="game-board">` + 
    `<tr>` +
      `<td><div id="x1_y3"class="tile1"></div></td>` +
      `<td><div id="x2_y3" class="tile2"></div></td>` +
      `<td><div id="x3_y3" class="tile3"></div></td>` +
    `</tr>` +
    `<tr>` +
      `<td><div id="x1_y2" class="tile4"></div></td>` +
      `<td><div id="x2_y2" class="tile5"></div></td>` +
      `<td><div id="x3_y2" class="tile6"></div></td>` +
    `</tr>` +
    `<tr>` +
      `<td><div id="x1_y1" class="tile7"></div></td>` +
      `<td><div id="x2_y1" class="tile8"></div></td>` +
      `<td><div id="x3_y1" class="blank"></div></td>` +
    `</tr>` +
  `</table>` 

const controlsHTML = 
  `<p id="play" class="hoverMeBefore">play</p>`+
  `<p id="stop" class="hoverMeDuring">pause</p>`+
  `<p id="moves">moves: 0</p>`+
  `<p id="timer">time: 0:00:00 </p>` + 
  `<p id="kill" class="hoverMeDuring">kill game </p>`

let movesBtn 
let timer 
let playBtn
let stopBtn 
let killBtn
let tilePieces
let time 
let currentGame
let dev 

function showNewGame(){
  showNewBoard()
  showNewGameControls()
}

function showExistingGame(openGame){
  showExistingBoard(openGame)
  showExistingGameControls(openGame)
}

function togglePlayPause(){
  playBtn.addEventListener("click", () => {
    playBtn.style.display = "none"
    stopBtn.style.display = "block"
    killBtn.style.display = "block"
    currentGame ? playPausedGame() : playNewGame()
  })
  stopBtn.addEventListener("click", () => {
    stopBtn.style.display = "none"
    killBtn.style.display = "none"
    playBtn.style.display= "block"
    clearInterval(time)
    saveGame()
  }) 
  killBtn.addEventListener("click", ()=>{
    clearInterval(time)
    deleteGame()
    // if youre playing an unfinished game remove its img from the queue 
    let openGameImg = document.querySelector(`#gameId${currentGame.id}`)
    if (openGameImg) openGameImg.remove()
    currentGame = null
    showNewGame()
    togglePlayPause()
  })
}

function playNewGame(){
  console.log("YOU PLAYING A NEW GAME")
  movesBtn.innerText = "moves: 0"
  dev === "here" ? devShuffle() : shuffleBoard();
  postNewGame()
  moves = 0
  let startTime = Date.now()
  time = setInterval(()=>{
    let timeDiff = Date.now() - startTime
    timer.innerText = `time: ${formatTime(timeDiff)}`
  }, 1000)
  tilePieces.forEach( tile => {
    tile.addEventListener("click", ()=>{activateTile(tile, movesBtn)})
  })
}

function playPausedGame(){
  console.log("YOU PLAYING A PAUSED GAME")
  moves = parseInt(movesBtn.innerText.substring(7))
  let carryOverTime = timer.innerText.substring(6)
  let startTime = Date.now()
  time = setInterval(()=>{
    let timeDiff = Date.now() - startTime
    timer.innerText = `time: ${addTime(formatTime(timeDiff), carryOverTime)}`
  }, 1000)
  tilePieces.forEach(tile=> {
    tile.addEventListener("click", ()=>{activateTile(tile, movesBtn)})
  })
}

function activateTile(tile,movesBtn){
  let adjTiles = surroundingTiles(tile)
  adjTiles.forEach (tileToSwap => {
    if (tileToSwap) { 
      if(tileToSwap.className === "blank"){
        swapTile(tile, tileToSwap)
        moves++
        movesBtn.innerText = `moves: ${moves}`  
        if (checkSolution()) {
          playBtn.style.display = "block"
          stopBtn.style.display = "none"
          killBtn.style.display = "none"
          clearInterval(time)
          showWinGame()
          let openGameImg = document.querySelector(`#gameId${currentGame.id}`)
          if (openGameImg) openGameImg.remove()
          closeGame()
          currentGame = null
        } 
      }
    }
  })
}

function surroundingTiles(tile){
  let x = parseInt(tile.id[1])
  let y = parseInt(tile.id[4])
  let leftTile = document.querySelector(`#x${x-1}_y${y}`)
  let rightTile = document.querySelector(`#x${x+1}_y${y}`)
  let upTile = document.querySelector(`#x${x}_y${y+1}`)
  let downTile = document.querySelector(`#x${x}_y${y-1}`)
  return [leftTile, rightTile, upTile, downTile]
}

function swapTile(tile, blankTile){
  blankTile.className = tile.className
  blankTile.style.backgroundImage = `url(${currentImage.image_url})`
  tile.className = "blank"
  tile.style = "none"
}

function shuffleBoard(){
  let i = 0
  let swap = setInterval( ()=>{
    let blankTile = document.querySelector(".blank")
    let tiles = surroundingTiles(blankTile).filter( tile => tile)
    let rand = Math.floor( Math.random() * tiles.length )
    swapTile(tiles[rand], blankTile)
    i++ 
    if (i === 50){clearInterval(swap)}
  },20)
}

function devShuffle(){
  let tile = document.querySelector("#x2_y1")
  let blank = document.querySelector("#x3_y1")
  swapTile(tile, blank)
}

function checkSolution(){
  const solution = ["tile1", "tile2", "tile3", "tile4", "tile5", "tile6", "tile7", "tile8", "blank"]
  let arrangment = []
  tilePieces.forEach( piece => {arrangment.push(piece.className)})
  for (let i = 0; i < arrangment.length; i++){
    if (arrangment[i] !== solution[i]) { 
      return false
    }
  }
  return true
}

function formatTime(ms) {
  var s = ("0" + Math.floor((ms / (      1000)) % 60)).substr(-2);
  var m = ("0" + Math.floor((ms / (   60*1000)) % 60)).substr(-2);
  var h =        Math.floor((ms / (60*60*1000))     );
  return h + ":" + m + ":" + s;
}

function addTime(time1, time2){
  time1Arr = time1.split(":")
  time2Arr = time2.split(":")
  s = parseInt(time1Arr[2]) + parseInt(time2Arr[2])
  m = parseInt(time1Arr[1]) + parseInt(time2Arr[1])
  h = parseInt(time1Arr[0]) + parseInt(time2Arr[0])
  if ( s >= 60){
    m = m + 1 
    s = s - 60
  } if (m >= 60){
    h = h + 1
    m = m - 60
  }
  return h + ":" + ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2)
}

function postNewGame(){
  console.log("new game created")
  fetch(GAMES_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      user_id: currentUser.id,
      image_id: currentImage.id,
      status: "open", 
      moves: 0,
      time: "0:00:00"
    })
  })
  .then(resp => resp.json())
  .then(newGame => {
    currentGame = newGame
    console.log(newGame)
  })
}

function saveGame(){
  let moves = parseInt(document.querySelector("#moves").innerText.substring(7))
  let time = document.querySelector("#timer").innerText.substring(6)
  const board = document.querySelector("#game-board")
  let pieces = board.querySelectorAll("div")
  fetch(GAMES_URL + "/" + currentGame.id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      moves: moves,
      time: time,
      status: "open",
      x1_y3: pieces[0].className,
      x2_y3: pieces[1].className,
      x3_y3: pieces[2].className,
      x1_y2: pieces[3].className,
      x2_y2: pieces[4].className,
      x3_y2: pieces[5].className,
      x1_y1: pieces[6].className,
      x2_y1: pieces[7].className,
      x3_y1: pieces[8].className
    })
  })
  .then(resp => resp.json())
  .then(updatedGame => {
    currentGame = updatedGame
    // render game again without active tiles 
    gameBoardDiv.innerHTML = ""
    gameControlsDiv.innerHTML = ""
    showExistingGame(currentGame)
    togglePlayPause()
  })
  console.log("saved to db")
}

  function closeGame() {
  let moves = parseInt(document.querySelector("#moves").innerText.substring(7))
  let time = document.querySelector("#timer").innerText.substring(6)
  fetch(GAMES_URL + "/" + currentGame.id, {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      moves: moves,
      time: time,
      status: "closed",
      x1_y3: null,
      x2_y3: null,
      x3_y3: null,
      x1_y2: null,
      x2_y2: null,
      x3_y2: null,
      x1_y1: null, 
      x2_y1: null,
      x3_y1: null
    })
  })
  .then (resp => resp.json())
  .then (updatedGame => {
    console.log(updatedGame)
  })
}

function showWinGame(){
  const p = document.createElement("p")
  p.innerText = "you did it."
  gameControlsDiv.append(p)
  setTimeout(()=>{p.remove()}, 5000)
  gameBoardDiv.innerHTML = ""
  showNewBoard()
}

function deleteGame(){
  console.log("deleted from db")
  fetch(GAMES_URL + "/" + currentGame.id, {
    method: "DELETE", 
    headers: {"Content-Type": "application/json"}
  })
}

function showNewBoard(){
  gameBoardDiv.innerHTML = boardHTML
  tilePieces = gameBoardDiv.querySelectorAll("div")
  tilePieces.forEach( tilePiece => {
    if (tilePiece.className !== "blank"){
      tilePiece.style.backgroundImage = `url(${currentImage.image_url})`
    }
  })
}

function showNewGameControls(){
  gameControlsDiv.innerHTML = controlsHTML
  movesBtn = document.querySelector("#moves")
  timer = document.querySelector("#timer")
  playBtn = document.querySelector("#play")
  stopBtn = document.querySelector("#stop")
  killBtn = document.querySelector("#kill")
}


function showExistingBoard(openGame){
  currentGame = openGame
  gameBoardDiv.innerHTML = boardHTML
  const x1_y1 = document.querySelector("#x1_y1")
  const x2_y1 = document.querySelector("#x2_y1")
  const x3_y1 = document.querySelector("#x3_y1")
  const x1_y2 = document.querySelector("#x1_y2")
  const x2_y2 = document.querySelector("#x2_y2")
  const x3_y2 = document.querySelector("#x3_y2")
  const x1_y3 = document.querySelector("#x1_y3")
  const x2_y3 = document.querySelector("#x2_y3")
  const x3_y3 = document.querySelector("#x3_y3")
  x1_y1.className = openGame.x1_y1
  x2_y1.className = openGame.x2_y1
  x3_y1.className = openGame.x3_y1
  x1_y2.className = openGame.x1_y2
  x2_y2.className = openGame.x2_y2
  x3_y2.className = openGame.x3_y2
  x1_y3.className = openGame.x1_y3
  x2_y3.className = openGame.x2_y3
  x3_y3.className = openGame.x3_y3
  tilePieces = gameBoardDiv.querySelectorAll("div")
  tilePieces.forEach( tilePiece => {
  if (tilePiece.className !== "blank"){
    tilePiece.style.backgroundImage = `url(${currentImage.image_url})`
  }})
  
}

function showExistingGameControls(openGame){
  gameControlsDiv.innerHTML = controlsHTML
  movesBtn = document.querySelector("#moves")
  movesBtn.innerText = `moves: ${openGame.moves}`
  timer = document.querySelector("#timer")
  timer.innerText = `time: ${openGame.time}`
  playBtn = document.querySelector("#play")
  stopBtn = document.querySelector("#stop")
  killBtn = document.querySelector("#kill")
}


