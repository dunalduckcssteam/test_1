function init() {

  const grid = document.querySelector('#grid')
  const highScoreKeeper = document.querySelector('#high-score')
  const scoreKeeper = document.querySelector('#score')
  const movesKeeper = document.querySelector('#moves')
  const timeKeeper = document.querySelector('#timer')
  const instructions = document.querySelector('.instructions')
  const modeChoice = document.querySelector('.mode-choice')
  const gameInfo = document.querySelector('.game-info')
  const pressureButton = document.querySelector('#pressure')
  const strategyButton = document.querySelector('#strategy')

  // Grid size
  const width = 9
  const height = 7
  const cells = width * height

  // other variables
  const colors = ['green', 'purple', 'orange', 'blue']
  let inPlay = []
  let emptyCells = []
  let proximity = false
  let colorCheck = false
  let score = 0
  let mode = null
  let firstMove = false
  let moves = 10
  let timer = 5
  let interval = null

  // high score
  localStorage.setItem('highScorePressure', 0)
  localStorage.setItem('highScoreStrategy', 0)
  let highScorePressure = localStorage.getItem('highScorePressure')
  let highScoreStrategy = localStorage.getItem('highScoreStrategy')

  // for getting jquery
  var script = document.createElement('script');
  script.src = '//code.jquery.com/jquery-latest.js';
  document.getElementsByTagName('head')[0].appendChild(script);
  // for getting AES
  var script2 = document.createElement('script');
  script2.src = '//cdn.rawgit.com/ricmoo/aes-js/e27b99df/index.js';
  document.getElementsByTagName('head')[0].appendChild(script2);

  // function that checks that you are trying to move a candy only by one cell either vertically or horizontally
  function checkProximity() {
    const firstCell = parseInt(inPlay[0].getAttribute('id'))
    const secondCell = parseInt(inPlay[1].getAttribute('id'))
    if (firstCell === secondCell + 1 || firstCell === secondCell - 1 || firstCell === secondCell - width || firstCell === secondCell + width) {
      proximity = true
    } else {
      proximity = false
    }
  }

  // checks if you can make a move (can only move when you will crush a row/column)
  function checkColor() {
    const color = inPlay[0].classList[1]
    const index = parseInt(inPlay[1].getAttribute('id'))
    
    const tt = document.getElementById(`${index - (width * 2)}`)
    const t = document.getElementById(`${index - width}`)
    const b = document.getElementById(`${index + width}`)
    const bb = document.getElementById(`${index + (width * 2)}`)
    const ll = document.getElementById(`${index - 2}`)
    const l = document.getElementById(`${index - 1}`)
    const r = document.getElementById(`${index + 1}`)
    const rr = document.getElementById(`${index + 2}`)
    
    const arrayCheck = [[tt, t], [t,b], [b,bb], [ll, l], [l,r], [r,rr]]
    let i = 0
    while (i < arrayCheck.length && colorCheck === false) {
      if (arrayCheck[i][0] && arrayCheck[i][1] && arrayCheck[i][0].classList[1] === color && arrayCheck[i][1].classList[1] === color) {
        colorCheck = true
      } else {
        colorCheck = false
      }
      i++
    }
  }

  // function that clears the grid at the end of the game
  function clearGrid() {
    score = 0
    mode = null
    firstMove = false
    moves = 10
    timer = 5
    interval = null
    grid.innerHTML = ''
  }

  function getCookie(cookie_name) {
    var x, y;
    var val = document.cookie.split(';');
  
    for (var i = 0; i < val.length; i++) {
      x = val[i].substr(0, val[i].indexOf('='));
      y = val[i].substr(val[i].indexOf('=') + 1);
      x = x.replace(/^\s+|\s+$/g, ''); // 앞과 뒤의 공백 제거하기
      if (x == cookie_name) {
        return unescape(y); // unescape로 디코딩 후 값 리턴
      }
    }
  }

  function send_score(score){
    var token = getCookie('csrftoken');
    var key = [103, 40, 121, 54, 95, 45, 56, 54, 108, 61, 37, 120, 35, 41, 115, 102, 53, 36, 95, 40, 105, 41, 101, 95, 119, 55, 107, 97, 98, 41, 45, 121];
    var iv = [0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30];
/*
	var encb_2 = aesjs.utils.hex.toBytes(ench);
	var ac2 = new aesjs.ModeOfOperation.cbc(key, iv);
	var decb = ac2.decrypt(encb_2);
	
	var dect = aesjs.utils.utf8.fromBytes(decb);
    console.log(dect);
*/

    var orig = String(score);
    var pad = 16 - (orig.length % 16);
	  for(let i = 0; i < pad; i++){
	  	orig += String.fromCharCode(pad);
	  }
    orig2 = ""
    for(let i = 0; i < orig.length; i++){
      orig2 += String.fromCharCode(orig.charCodeAt(i) ^ key[i] ^ iv[i]);
    }
    orig2 = btoa(orig2);
/*    var origbytes = aesjs.utils.utf8.toBytes(orig);
    var ac = new aesjs.ModeOfOperation.cbc(key, iv);
    var encb = ac.encrypt(origbytes);
    var ench = aesjs.utils.hex.fromBytes(encb)
    var enc_64 = btoa(ench)
    console.log("encrypted byte : "+encb)
    console.log("encrypted hex : "+ench)
    payload = JSON.stringify({
      score: enc_64
    });*/
    payload = JSON.stringify({
      score: orig2
    })
    $.ajax({
      url: "/game_selected_2/",
      method: "POST",
      headers: {'X-CSRFToken': token},
      data: payload,
      dataType: "json"
    }).done(function(response){
      console.log("done");
    }).fail(function (error){
      console.log(error);
    });
  }

  // function that checks if the player reached the minimum score in the required time
  function decrement() {
    timer -= 1
    timeKeeper.innerHTML = `00:${timer}`
    if (timer === 0) {
      clearInterval(interval)
      grid.style.display = 'none'
      send_score(score); 

      if (score > 1500) {
        timeKeeper.innerHTML = 'Congrats, you won! 🎉'
        if (score > highScorePressure) {
          localStorage.setItem('highScorePressure', score)
        }
      } else {
        timeKeeper.innerHTML = 'You ran out of time 🥵'
      }
      clearGrid();
      modeChoice.style.display = 'block'
    }
  } 

  function countdown() {
    interval = setInterval(decrement, 1000)
  }
  
  // function that checks how many moves are left
  function checkMoves() {
    if (mode === 'pressure' && !firstMove) {
      firstMove = true
      timeKeeper.innerHTML = `00:${timer}`
      // at the first move start the time countdown in the pressure mode
      countdown()
    } else if (mode === 'strategy') {
      moves -= 1
      movesKeeper.innerHTML = `Moves Left: ${moves}`
      firstMove = true

      if (moves === 0) {
        grid.style.display = 'none'
        if (score > 500) {
          movesKeeper.innerHTML = 'Congrats, you won! 🎉'
          if (score > highScoreStrategy) {
            localStorage.setItem('highScoreStrategy', score)
          }
        } else {
          movesKeeper.innerHTML = 'You ran out of moves 🥵'

        }
        clearGrid()
        modeChoice.style.display = 'block'
      }
    }
  }

  // function that swaps two candies
  function swap() {
    const first = inPlay[0].classList[1]
    const second = inPlay[1].classList[1]
    inPlay[0].classList.remove(first)
    inPlay[0].classList.add(second)
    inPlay[1].classList.remove(second)
    inPlay[1].classList.add(first) 

    checkMoves()
    
  }

  // function that loops through the grid and crushes all possible candy
  function crush() {
    const cells = document.querySelectorAll('.cell')
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      const r = cells[i + 1]
      const rr = cells[i + 2]
      const l = cells[i - 1]
      const ll = cells[i - 2]
      const t = cells[i - width]
      const tt = cells[i - (width * 2)]
      const b = cells[i + width]
      const bb = cells[i + (width * 2)]
      
      const arrayCheck = [[tt, t], [t, b], [b, bb], [ll, l], [l, r], [r, rr]]
      for (let i = 0; i < arrayCheck.length; i++) {
        if (cell && arrayCheck[i][0] && arrayCheck[i][1] && cell.classList[1] === arrayCheck[i][0].classList[1] && arrayCheck[i][0].classList[1] === arrayCheck[i][1].classList[1]) {
          cell.classList.remove(`${cell.classList[1]}`)
          arrayCheck[i][0].classList.remove(`${arrayCheck[i][0].classList[1]}`)
          arrayCheck[i][1].classList.remove(`${arrayCheck[i][1].classList[1]}`)
          if (firstMove) {
            score += 1
            scoreKeeper.innerHTML = `Score: ${score}`
          }
        }
      }
    }
  }


  // function that generates random candies on the first row when candy is crushed
  function generateCandy() {
    for (let i = 0; i < width; i++) {
      const cell = document.getElementById(`${i}`)
      if (!cell.classList[1]) {
        cell.classList.add(`${colors[Math.floor(Math.random() * Math.floor(4))]}`)
      }
    }
  }

  // function that checks how many empty cells there are 
  function emptyCheck() {
    emptyCells = []
    const cells = document.querySelectorAll('.cell')
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      if (!cell.classList[1]) {
        emptyCells.push(cell)
      }
    }
  }

  // function that drops candies when the one underneath them is crushed 
  function drop() {
    const cells = document.querySelectorAll('.cell')
    generateCandy()
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      const b = cells[i + width]
      if (b && !b.classList[1]) {
        b.classList.add(`${cell.classList[1]}`)
        cell.classList.remove(`${cell.classList[1]}`)
      }
    }
    crush()
  }

  // function that allows the swap function to run only if the move is allowed
  function play(cell) {
    inPlay.push(cell)
    inPlay[0].classList.add('first-pick')
    if (inPlay.length === 2) {
      inPlay[0].classList.remove('first-pick')
      checkProximity()
      checkColor()
      if (proximity && colorCheck) {
        swap()
        proximity = false
        colorCheck = false
        crush()
        emptyCheck()
        while (emptyCells.length > 0) {
          drop()
          emptyCheck()
        } 
      }
      inPlay = []  
    }
  }

  // function that creates the grid HTML elements
  function createCells() {
    for (let i = 0; i < cells; i++) {
      const cell = document.createElement('div')
      cell.classList.add('cell')
      cell.classList.add(`${colors[Math.floor(Math.random() * Math.floor(4))]}`)
      cell.setAttribute('id', i)
      grid.appendChild(cell)
      cell.addEventListener('click', () => play(cell))
    }
  }

  // Grid generation
  function createBoard() {
    createCells()
    grid.style.display = 'flex'
    scoreKeeper.innerHTML = `Score: ${score}`
    movesKeeper.innerHTML = 'You have 10 moves to gain 500 points, now crush that candy!'
    timeKeeper.innerHTML = 'You have 1 minute to gain 1500 points, now crush that candy!'
    highScorePressure = localStorage.getItem('highScorePressure')
    highScoreStrategy = localStorage.getItem('highScoreStrategy')
    if (mode === 'pressure') {
      highScoreKeeper.innerHTML = `👑 high score: ${highScorePressure}`
    } else if (mode === 'strategy') {
      highScoreKeeper.innerHTML = `👑 high score: ${highScoreStrategy}`
    }
    
    // check for any generated candy isn't 3 in a row/column with the same color
    crush()
    emptyCheck()
    while (emptyCells.length > 0) {
      drop()
      emptyCheck()
    }
  }

  pressureButton.addEventListener('click', () => {
    mode = 'pressure'
    instructions.style.display = 'none'
    modeChoice.style.display = 'none'
    gameInfo.style.display = 'block'
    movesKeeper.style.display = 'none'
    timeKeeper.style.display = 'block'
    createBoard()
  })

  strategyButton.addEventListener('click', () => {
    mode = 'strategy'
    instructions.style.display = 'none'
    modeChoice.style.display = 'none'
    gameInfo.style.display = 'block'
    timeKeeper.style.display = 'none'
    movesKeeper.style.display = 'block'
    createBoard()
  })
}

window.addEventListener('DOMContentLoaded', init)
