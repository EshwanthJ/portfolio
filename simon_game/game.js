//declarations
var gamePattern = [];
var userClickedPattern = [];

var level = 0;
var highestLevel = 0;
var started = false;

var buttonColors = ["green", "red", "yellow", "blue"];

//functions
function playSound(name) {
    var clickAudio = new Audio("sounds/" + name + ".mp3");
    clickAudio.play();
}

function animatePress(currentColor) {
    $("#" + currentColor).addClass("pressed");
    setTimeout(function () {
        $("#" + currentColor).removeClass("pressed");
    }, 100);
}

function nextSequence() {
    userClickedPattern = [];
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber];
    gamePattern.push(randomChosenColor);
    console.log(gamePattern);
    var audio = new Audio("sounds/" + randomChosenColor + ".mp3");
    if (highestLevel === level) {
        highestLevel++;
    } else {
        highestLevel = Math.max(highestLevel);
    }
    level++;

    $("#current-level").html(level);
    $("#highest-level").html(highestLevel);
    $("#" + randomChosenColor)
        .fadeOut(50)
        .fadeIn(50)
        .fadeIn(50);
    playSound(randomChosenColor);
    animatePress(randomChosenColor);
}

function checkAnswer(currentLevel) {
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(function () {
                nextSequence();
            }, 1000);
        }
    } else {
        playSound("wrong");
        $("#current-level").html("0");
        $("body").addClass("game-over");
        setTimeout(function () {
            $("body").removeClass("game-over");
        }, 200);
        $("#level-title").html("Game Over, Press Here to Restart");
        startOver();
    }
}

function startOver() {
    level = 0;
    gamePattern = [];
    started = false;
}

//script

$("#level-title").click(function () {
    if (!started) {
        $("#level-title").html("Click Here to Restart");
        $("#help-text").addClass("hidden");
        startOver();
        nextSequence();
        started = true;
    } else {
        startOver();
        nextSequence();
    }
});

$(".btnc").click(function (event) {
    var userChosenColor = $(this).attr("id");
    userClickedPattern.push(userChosenColor);
    console.log(userClickedPattern);

    playSound(userChosenColor);
    animatePress(userChosenColor);
    checkAnswer(userClickedPattern.length - 1);
});

// jQuery code to handle button click event
$(document).ready(function () {
    $("#help-text").click(function () {
        if ($("#help-popup").hasClass("hidden")) {
            $("#help-text").html("Click here to hide instructions");
            $("#help-popup").removeClass("hidden");
            $("#help-popup").fadeIn();
        } else {
            $("#help-text").html("Click here for instructions");
            $("#help-popup").fadeOut();
            $("#help-popup").addClass("hidden");
        }
    });
});

