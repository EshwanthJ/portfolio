var tom1 = new Audio("sounds/tom-1.mp3");
var tom2 = new Audio("sounds/tom-2.mp3");
var tom3 = new Audio("sounds/tom-3.mp3");
var tom4 = new Audio("sounds/tom-4.mp3");
var crash = new Audio("sounds/crash.mp3");
var kick = new Audio("sounds/kick-bass.mp3");
var snare = new Audio("sounds/snare.mp3");
var userCreatedSound = [];
const playbackElements = document.querySelectorAll(".playback");

for (var i=0; i < document.querySelectorAll(".drum").length; i++) {
    document.querySelectorAll(".drum")[i].addEventListener("click", function () {
      var buttonPress = this.innerHTML;
      userCreatedSound.push(buttonPress);
      makeSound(buttonPress);
      makeAnimation(buttonPress);
    })
}

document.addEventListener("keydown", function(event){
    makeSound(event.key);
    makeAnimation(event.key);
})

function makeSound(key) {
    switch (key) {
        case "w":
            tom1.play();
            break;
      
        case "a":
            tom2.play();
            break;

        case "s":
            tom3.play();
            break;
        
        case "d":
            tom4.play();
            break;

        case "j":
            crash.play();
            break;

        case "k":
            kick.play();
            break;

        case "l":
            snare.play();
            break;
            
        default:console.log(buttonPress);
      }
}

function makeAnimation(currentKey) {
    var activeButton = document.querySelector("."+ currentKey);
    activeButton.classList.add("pressed");

    setTimeout(function(){
        activeButton.classList.remove("pressed");
    }, 50)
}

function playUserCreatedSound() {
    for (var i = 0; i < userCreatedSound.length; i++) {
      setTimeout(function(index) {
        makeSound(userCreatedSound[index]);
      }, i * 250, i);
    }
  }
  

  playbackElements.forEach(function(playbackElement) {
    playbackElement.addEventListener("click", function() {
      playUserCreatedSound();
    });
  });
  