
var intervalID;
var myAudio;

var triviaGame = {

  correctCount: 0,
  wrongCount: 0,
  score: 0,
  questionsLeft: 1,
  timeLeft: 45,
  choiceHolder: [],
  noRepeats: [],
  alreadyGuessed: [],
  rightAnswer: "",
  
  answerBank: ["Police Squad", "Sanford and Son", "Moonlighting", "Family Ties", "Perfect Strangers", "CHiPS", "NYPD Blue", "Magnum PI", "LA Law", "MacGyver", "St Elsewhere", "Mystery Science Theater 3000", "Matlock", "Murder She Wrote"],
  
  startGame: function() {

    $("#start-btn").on("click", triviaGame.resetGame);
  },
  
  createAnswerChoices: function() {
    
    myAudio = document.createElement("AUDIO");
    
    $("#num-right").text(triviaGame.correctCount);
    $("#num-wrong").text(triviaGame.wrongCount);
    $("#game-score").text(triviaGame.score);
    $("#qs-left").text(triviaGame.questionsLeft);
    
    // create array for answer choices
    triviaGame.choiceHolder.length = 0;
    triviaGame.noRepeats.length = 0;

    if ($("#info-box-text").hasClass("text-success")) {
      $("#info-box-text").removeClass("text-success");
    }

    if ($("#info-box-text").hasClass("text-danger")) {
      $("#info-box-text").removeClass("text-danger");
    }
    
    
    
    var q;

    for (var i = 0; i < 4; i++) { 
      q = Math.floor(Math.random() * 14);
      if (!triviaGame.noRepeats.includes(q)) {
        triviaGame.noRepeats.push(q);
        triviaGame.choiceHolder.push(triviaGame.answerBank[q]);
      }
      else i--;
    }

    
    triviaGame.createTargetAnswer();
  },

  createTargetAnswer: function() {

    var x = Math.floor(Math.random() * 3);
  
    triviaGame.rightAnswer = triviaGame.choiceHolder[x];

    if (!triviaGame.alreadyGuessed.includes(triviaGame.rightAnswer)) {
      myAudio.src = "assets/sounds/" + triviaGame.choiceHolder[x] + ".mp3";
      myAudio.load();
      myAudio.play();
      triviaGame.renderButtons();
    } else {
      triviaGame.createAnswerChoices();
    }
  },

  triviaTimer: function() {

    
      triviaGame.timeLeft--;

      $("#info-box-text").text(triviaGame.timeLeft + " seconds left");
      
      if (triviaGame.timeLeft === 0) {
        clearInterval(intervalID);
        triviaGame.timeLeft = 45;
        myAudio.pause();
        triviaGame.wrongCount++;
        triviaGame.questionsLeft--;
        $("#qs-left").text(triviaGame.questionsLeft);
        $("#choices").empty();
        $("#info-box-text").text("Time's Up!");
        if (triviaGame.questionsLeft === 0) {
          setTimeout(triviaGame.gameOver, 3000);
        } else {
        setTimeout(triviaGame.createAnswerChoices, 3000);
        }
      }
    
  },

  
  renderButtons: function() {
  
    $("#choices").empty();
    
      
    for (var j = 0; j < triviaGame.choiceHolder.length; j++) {
    
      var ansBtn = $("<button>");
      ansBtn.addClass("choice-button btn btn-info");
      ansBtn.attr("data-choice", triviaGame.choiceHolder[j]);
      ansBtn.text(triviaGame.choiceHolder[j]);
      $("#choices").append(ansBtn);
    }

    $(".choice-button").on("click", triviaGame.checkAnswer);

    $("#info-box-text").text(triviaGame.timeLeft + " seconds left");
    intervalID = setInterval(triviaGame.triviaTimer, 1000);
  },

  checkAnswer: function() {

    var answer = ($(this).attr("data-choice"));
    var points = triviaGame.timeLeft;

    clearInterval(intervalID);
    triviaGame.timeLeft = 45;
    myAudio.pause();

    
    if (answer === triviaGame.rightAnswer) {
      $("#info-box-text").addClass("text-success");
      $("#info-box-text").text("You're Correct!");
      triviaGame.score += points;
      $("#game-score").text(triviaGame.score);
      triviaGame.alreadyGuessed.push(answer);
      triviaGame.correctCount++;
      $("#num-right").text(triviaGame.correctCount);
    } 
    else {
      $("#info-box-text").addClass("text-danger");
      $("#info-box-text").text("Wrong Answer!");
      triviaGame.wrongCount++;
      $("#num-wrong").text(triviaGame.wrongCount);
    }

    triviaGame.questionsLeft--;
    $("#qs-left").text(triviaGame.questionsLeft);

    if (triviaGame.questionsLeft === 0) {
      setTimeout(triviaGame.gameOver, 3000);
    } else {
      setTimeout(triviaGame.createAnswerChoices, 3000);
    }
    
  },

  gameOver: function() {

    if ($("#info-box-text").hasClass("text-success")) {
      $("#info-box-text").removeClass("text-success");
    }

    if ($("#info-box-text").hasClass("text-danger")) {
      $("#info-box-text").removeClass("text-danger");
    }

    $("#info-box-text").text("Off the Air");
    $("#choices").empty();

    var z = $("<button>");
    z.addClass("btn btn-outline-dark btn-lg");
    z.attr("id", "start-btn");
    z.text("CLICK TO PLAY AGAIN");
    $("#choices").append(z);
    triviaGame.startGame();
    
  },

  resetGame: function() {

    triviaGame.correctCount = 0;
    triviaGame.wrongCount = 0;
    triviaGame.score = 0;
    triviaGame.questionsLeft = 10;
    triviaGame.timeLeft = 45;
    triviaGame.rightAnswer = "";
    triviaGame.alreadyGuessed.length = 0;
    triviaGame.createAnswerChoices();

  }
};

window.onload = function() {

triviaGame.startGame();

};



