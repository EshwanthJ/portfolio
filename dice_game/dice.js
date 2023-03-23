function rollDice() {
  var randomNumber1 = 1 + Math.floor(Math.random() * 6);
  var randomDiceImage1 = "images/dice" + randomNumber1 + ".png";
  var player1Dice = document.querySelector(".img1");
  player1Dice.setAttribute("src", randomDiceImage1);

  var randomNumber2 = 1 + Math.floor(Math.random() * 6);
  var randomDiceImage2 = "images/dice" + randomNumber2 + ".png";
  var player2Dice = document.querySelector(".img2");
  player2Dice.setAttribute("src", randomDiceImage2);

  var result = document.querySelectorAll("h1")[0].innerHTML;

  if (randomNumber1 > randomNumber2) {
    document.querySelectorAll("h1")[0].innerHTML = "Player 1 wins";
  } else if (randomNumber1 < randomNumber2) {
    document.querySelectorAll("h1")[0].innerHTML = "Player 2 wins";
  } else {
    document.querySelectorAll("h1")[0].innerHTML = "Its a tie!!";
  }
}

const play = document.querySelector("#play");

play.addEventListener("click", function() {
    rollDice();
    document.querySelector("#play").innerHTML = "Click here to toss again!!"
});
