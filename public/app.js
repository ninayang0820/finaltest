let socket = io();
let dishData;
let selectType = 'Comfort food'
let selectDishData = []
let favorites = []

let dish1 = document.getElementById("dish1")
let dish2 = document.getElementById("dish2")
let dish3 = document.getElementById("dish3")
let comfortFood = document.getElementById("comfort_food")
let quickMeal = document.getElementById("quick_meal")
let adventureCuisine = document.getElementById("adventure_cuisine")
let music = document.getElementById("music")
let audio = document.getElementById("audio")
let scrollNums = document.querySelectorAll(".scroll-num")
let heartImgs = document.querySelectorAll(".heart-img")

const modal = document.getElementById('myModal');
const myFavorite = document.getElementById('myFavorite');
const favoriteList = document.getElementById('favorite_list');
const closeBtn = document.getElementsByClassName('close')[0];

let send = document.getElementById('send');
let message = document.getElementById('message');
let chatList = document.getElementById('chatList');
let upload = document.getElementById('upload');
let uploadFile = document.getElementById('upload_file');

let i1 = -1;
let i2 = -1;
let i3 = -1;

//Listen for confirmation of connection
socket.on('connect', () => {
  console.log("Connected");
});

const left = document.getElementById("left")

document.getElementById("start").addEventListener("click", function() {
  for (let i = 0; i < scrollNums.length; i++) {
    scrollNums[i].classList.remove('active')
  }
  resetFavorite()

  setTimeout(() => {
    for (let i = 0; i < scrollNums.length; i++) {
      scrollNums[i].classList.add('active')
    }
    const randomIndex = Math.floor(Math.random() * (selectDishData.length - 1))
    i1 = randomIndex
    left.style.setProperty('--i', randomIndex)

    const randomIndex2 = Math.floor(Math.random() * (selectDishData.length - 1))
    i2 = randomIndex2
    left.style.setProperty('--i2', randomIndex2)

    const randomIndex3 = Math.floor(Math.random() * (selectDishData.length - 1))
    i3 = randomIndex3
    left.style.setProperty('--i3', randomIndex3)
  }, 300)
})

comfortFood.addEventListener("click", function() {
  for (let i = 0; i < scrollNums.length; i++) {
    scrollNums[i].classList.remove('active')
  }
  document.querySelectorAll('.btn').forEach(item => item.classList.remove('active'))
  comfortFood.classList.add("active")
  selectType = "Comfort food"
  selectDishData = dishData[selectType]
  renderScrollList()
  resetFavorite()
})

quickMeal.addEventListener("click", function() {
  for (let i = 0; i < scrollNums.length; i++) {
    scrollNums[i].classList.remove('active')
  }
  document.querySelectorAll('.btn').forEach(item => item.classList.remove('active'))
  quickMeal.classList.add("active")
  selectType = "Quick meal"
  selectDishData = dishData[selectType]
  renderScrollList()
  resetFavorite()
})

adventureCuisine.addEventListener("click", function() {
  for (let i = 0; i < scrollNums.length; i++) {
    scrollNums[i].classList.remove('active')
  }
  document.querySelectorAll('.btn').forEach(item => item.classList.remove('active'))
  adventureCuisine.classList.add("active")
  selectType = "Adventure cuisine"
  selectDishData = dishData[selectType]
  renderScrollList()
  resetFavorite()
})

music.addEventListener("click", function(e) {
  e.stopPropagation()
  if (!audio.paused && audio.currentTime > 0 && !audio.ended && audio.readyState > 2) {
    audio.pause()
  } else {
    audio.play()
  }
})

myFavorite.onclick = function() {
  favoriteList.innerHTML = '';
  for (let i = 0; i < favorites.length; i++) {
    favoriteList.innerHTML += `
      <div class="favorite-item">
        <div class="favorite-item-name">${favorites[i].name}</div>
        <div class="favorite-item-desc">${favorites[i].description}</div>
        <div class="favorite-item-origin">${favorites[i].origin}</div>
      </div>
    `
  }
  modal.style.display = "block";
}

closeBtn.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
}

//Listen for an event named 'finish dish' from the server
socket.on('message', (data) => {
  chatList.innerHTML += `
            <div class="messageItemReverse">
                <p class="userName"><img src="./images/avatar-other.png" style="width: 30px" /></p>
                ${data.type === 'image'
                  ? `<img src="${data.value}" class="message-img" />`
                  : `<p class="content">${data.value}</p>`
                }
            </div>
        `

  chatList.scrollTo({
    top: chatList.scrollHeight,
    behavior: 'smooth'
  });
});

send.addEventListener("click", () => {
  if (message.value) {
    socket.emit('message', {
      type: 'text',
      value: message.value
    });
    chatList.innerHTML += `
                <div class="messageItem">
                    <p class="content">${message.value}</p>
                    <p class="userName"><img src="./images/avatar.png" style="width: 30px" /></p>
                </div>
            `
    chatList.scrollTo({
      top: chatList.scrollHeight,
      behavior: 'smooth'
    });
    message.value = ""
  }
})

upload.addEventListener("click", () => {
  uploadFile.click()
})

uploadFile.addEventListener("change", (e) => {
  const file = e.target.files[0]; // Get the first file selected by the user

  if (file) {
    const reader = new FileReader();

    // Event listener for when the file is successfully read
    reader.onload = function(event) {
      const base64String = event.target.result;
      socket.emit('message', {
        type: 'image',
        value: base64String
      });
      chatList.innerHTML += `
                <div class="messageItem">
                    <p class="content"><img src="${base64String}" class="message-img" /></p>
                    <p class="userName"><img src="./images/avatar.png" style="width: 30px" /></p>
                </div>
            `
      chatList.scrollTo({
        top: chatList.scrollHeight,
        behavior: 'smooth'
      });
    };

    // Read the file as a data URL (Base64)
    reader.readAsDataURL(file);
  } else {
    console.log("No file selected");
  }
})

for (let i = 0; i < heartImgs.length; i++) {
  heartImgs[i].addEventListener("click", function() {
    if (!(i1 === -1 && i2 === -1 && i3 === -1)) {
      if (heartImgs[i].src.includes("heart.png")) {
        heartImgs[i].src = "./images/heart-fill.png"

        if (i === 1) {
          favorites.push(selectDishData[i2])
        } else if (i === 2) {
          favorites.push(selectDishData[i3])
        } else {
          favorites.push(selectDishData[i1])
        }

      } else {
        heartImgs[i].src = "./images/heart.png"

        if (i === 1) {
          console.log(selectDishData[i2])
          favorites = favorites.filter(item => item.name !== selectDishData[i2].name)
        } else if (i === 2) {
          console.log(selectDishData[i3])
          favorites = favorites.filter(item => item.name !== selectDishData[i3].name)
        } else {
          console.log(selectDishData[i1])
          favorites = favorites.filter(item => item.name !== selectDishData[i1].name)
        }
      }
    }
  })
}

function resetFavorite() {
  for (let i = 0; i < heartImgs.length; i++) {
    heartImgs[i].src = "/images/heart.png"
  }
}

function renderScrollList() {
  dish1.innerHTML = ''
  dish2.innerHTML = ''
  dish3.innerHTML = ''

  for (let i = 0; i < selectDishData.length; i++) {
    const li = document.createElement("li");
    const h5 = document.createElement("h4");
    h5.textContent = selectDishData[i].name;

    const p = document.createElement("p");
    p.textContent = selectDishData[i].description;
    li.append(h5)
    li.append(p)
    dish1.append(li)
  }
  for (let i = 0; i < selectDishData.length; i++) {
    const li = document.createElement("li");
    const h5 = document.createElement("h4");
    h5.textContent = selectDishData[i].name;

    const p = document.createElement("p");
    p.textContent = selectDishData[i].description;
    li.append(h5)
    li.append(p)
    dish2.append(li)
  }
  for (let i = 0; i < selectDishData.length; i++) {
    const li = document.createElement("li");
    const h5 = document.createElement("h4");
    h5.textContent = selectDishData[i].name;

    const p = document.createElement("p");
    p.textContent = selectDishData[i].description;
    li.append(h5)
    li.append(p)
    dish3.append(li)
  }
}

fetch('/data')
  .then(res => res.json())
  .then(res => {
    dishData = res
    selectDishData = dishData[selectType]

    renderScrollList()
  })
