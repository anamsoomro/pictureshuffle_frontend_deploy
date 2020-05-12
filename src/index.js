  const USERS_URL = "http://localhost:3000/users"
  const IMAGES_URL = "http://localhost:3000/images"
  const GAMES_URL = "http://localhost:3000/games"
  const form = document.querySelector("#login")
  const galleryLi = document.querySelector("#gallery")
  const leaderBoardLi = document.querySelector("#leaderBoard")
  const savedGamesLi = document.querySelector("#savedGames")
  const userDiv = document.querySelector("#user-bar")
  const userUl = document.querySelector("ul")
  const mainMenuDiv = document.querySelector("#main-menu")
  const subMenuDiv = document.querySelector("#sub-menu")
  const showDiv = document.querySelector("#show-panel")
  const gameControlsDiv = document.querySelector("#game-controls")
  const gameBoardDiv = document.querySelector("#game-board")
  const leaderBoardDiv = document.querySelector("#leader-board")
  const titleDiv = document.querySelector("#title")
  const byH4 = document.querySelector("h4")
  const spans = document.querySelectorAll("span")
  let currentUser
  let currentImage

  spans.forEach(span => {
    span.addEventListener( "mouseover", ()=> {
      span.style.position = "relative"
      span.style.top = "-60px"
      setTimeout( ()=> {
        span.style.top = "60px" 
      }, 3000)
    })
  })

  form.addEventListener("submit", () => {
    event.preventDefault()
    let name = form[0].value
    fetch(USERS_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"}, 
      body: JSON.stringify({
        username: name
      })
    })
    .then(resp => resp.json())
    .then(userRecord => {
      form.reset()
      mainMenuDiv.style.display = "inline"
      currentUser = userRecord
      form.style.display = "none"
      let greeting = document.createElement("li")
      greeting.innerText = `hey, ${currentUser.username}!`
      greeting.id = "username"
      let logoutBtn = document.createElement("li")
      logoutBtn.className = "hoverMe"
      logoutBtn.innerText = "logout"
      logoutBtn.style.float = "right"
      userUl.append(greeting, logoutBtn)
      titleDiv.style.display="none"
      byH4.style.display = "none"
      logoutBtn.addEventListener("click", ()=> {
        mainMenuDiv.style.display = "none"
        subMenuDiv.style.display = "none" 
        showDiv.style.display = "none"
        gameBoardDiv.innerHTML = ""
        gameControlsDiv.innerHTML = ""
        leaderBoardDiv.innerHTML = ""
        currentUser = null
        form.style.display = "block"
        logoutBtn.remove()
        greeting.remove()
        titleDiv.style.display = "block"
        byH4.style.display = "block"
        if (time) clearInterval(time)
      })
    })
  })

  galleryLi.addEventListener("click", () => {
    subMenuDiv.style.display = "inline"
    subMenuDiv.innerHTML = "" 
    showDiv.style.display = "none"
    gameBoardDiv.innerHTML = ""
    gameControlsDiv.innerHTML = ""
    leaderBoardDiv.innerHTML = ""
    if (time) clearInterval(time)
    fetch(IMAGES_URL)
    .then(resp => resp.json())
    .then(images => images.forEach(image => showImage(image)))
  })

  leaderBoardLi.addEventListener("click", () => {
    subMenuDiv.style.display = "none"
    subMenuDiv.innerHTML = ""
    showDiv.style.display = "block"
    gameBoardDiv.innerHTML = ""
    gameControlsDiv.innerHTML = ""
    if (time) clearInterval(time)
    createLeaderBoard()
  })

  savedGamesLi.addEventListener("click", ()=>{
    subMenuDiv.style.display = "inline"
    subMenuDiv.innerHTML = ""
    showDiv.style.display = "none"
    gameBoardDiv.innerHTML = ""
    gameControlsDiv.innerHTML = ""
    leaderBoardDiv.innerHTML = ""
    if (time) clearInterval(time)
    fetch(USERS_URL + "/" + currentUser.id) 
    .then(resp => resp.json())
    .then(games =>{showGames(games["open"])})
  })


 

