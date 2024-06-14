// Set the game name in the title and heading
let gameName = "Guess the Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
// Set the game name in the footer link
document.querySelector("footer a").innerHTML = `Elzero's ${gameName} Game`;

// Generate a random word to guess from the list of words
let wordToGuess = "";
const words = [
  "banana",
  "apple",
  "pear",
  "melon",
  "grape",
  "peach",
  "mouse",
  "keyboard",
  "elephant",
  "lion",
  "tiger",
  "zebra",
  "snake",
  "turtle",
  "rabbit",
  "rocket",
  "pizza",
  "donut",
  "burger",
  "cookie",
  "rainbow",
  "sunset",
  "beach",
  "river",
  "castle",
  "guitar",
  "drum",
  "piano",
  "flame",
  "storm",
  "cloud",
  "light",
  "fairy",
  "magic",
  "dream",
  "heart",
  "smile",
  "peace",
  "music",
  "dance",
  "flower",
  "spark",
  "angel",
  "dream",
  "sunny",
  "happy",
  "laugh",
];

// Shuffle function to shuffle the array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

shuffle(words);

let randomIndex = Math.floor(Math.random() * words.length);
wordToGuess = words[randomIndex];

// Define the number of tries and letters in the word
let numbersOfTries = 0;
let numbersOfLetters = wordToGuess.length;
let currentTry = 1;
let numbersOfHints = 2;

// Get message area and check button
let messageAreas = document.querySelectorAll(".message");
let checkButton = document.querySelector(".check");

// Variable to hold try div
let tryDiv;

// Function to generate input fields for guesses
function generateInputs() {
  const inputsContainer = document.querySelector(".inputs");

  // Create input fields for each attempt
  for (let i = 1; i <= numbersOfTries; i++) {
    tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.classList.add(`try`);
    tryDiv.innerHTML = `<span>Attempt ${i}</span>`;

    // Disable inputs for attempts after the first one
    if (i !== 1) tryDiv.classList.add("disabled-inputs");

    // Create input fields for each letter in the word
    for (let j = 1; j <= numbersOfLetters; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;
      input.setAttribute("maxlength", "1");
      if (j === 1) {
        input.classList.add("first-input");
      }
      tryDiv.append(input);
    }

    inputsContainer.append(tryDiv);
  }

  // Set focus on the first input field of the first attempt
  inputsContainer.children[0].children[1].focus();

  // Disable inputs for all attempts except the first one
  const inputsInDisabledDiv = document.querySelectorAll(
    ".disabled-inputs input"
  );
  inputsInDisabledDiv.forEach((input) => {
    input.disabled = true;
  });

  // Add event listeners for input fields
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    // Convert input value to uppercase
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      const nextInput = inputs[index + 1];
      if (nextInput) nextInput.focus();
    });

    // Handle keyboard events
    input.addEventListener("keydown", function (event) {
      const currentIndex = Array.from(inputs).indexOf(this); // event.target or this

      // Move focus to the next input field when right arrow key is pressed
      if (event.key === "ArrowRight") {
        const nextIndex = currentIndex + 1;
        if (nextIndex < inputs.length) inputs[nextIndex].focus();
      }

      // Move focus to the previous input field when left arrow key is pressed
      if (event.key === "ArrowLeft") {
        const previousIndex = currentIndex - 1;
        if (currentIndex > 0) inputs[previousIndex].focus();
      }

      // Trigger guess when Enter key is pressed
      if (event.key === "Enter") {
        checkButton.click();
      }

      // Handle Backspace key to clear current input and move focus to previous input
      if (event.key === "Backspace") {
        const previousIndex = currentIndex - 1;

        inputs[currentIndex].value = ""; // Clear current input value
        event.preventDefault(); // Prevent default behavior of Backspace

        if (currentIndex > 0) inputs[previousIndex].focus();
      }

      // Define a variable to store the number of input fields
      const numberOfRowInputs = numbersOfLetters;

      for (let i = 1; i <= numberOfRowInputs; i++) {
        if (currentTry < numbersOfTries) {
          const inputField = document.querySelector(
            `#guess-${currentTry}-letter-${i}`
          );
          const inputFieldDiv = document.querySelector(`.try-${currentTry}`);

          // Get all input fields within the inputFieldDiv
          const inputFields = inputFieldDiv.querySelectorAll("input");

          // Handle keyboard events for each input field
          inputField.addEventListener("keydown", function (event) {
            const currentIndex = Array.from(inputFields).indexOf(this); // Get the index of the current input field

            // Check if the input field is filled and there's another input field available
            if (
              event.key.length === 1 &&
              this.value !== "" &&
              currentIndex < numberOfRowInputs - 1
            ) {
              const nextInput = inputFields[currentIndex + 1];
              nextInput.focus();
              nextInput.value = event.key.toUpperCase(); // Type the pressed key into the next input field
              event.preventDefault();
            }
          });
        }
      }
    });
  });
}
// Add event listener for guess button click
const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handelGuesses);

// Manage Hints
document.querySelector(".hint span span").innerHTML = numbersOfHints;
const hintButton = document.querySelector("button.hint");
hintButton.addEventListener("click", getHint);

// Function to handle guesses
function handelGuesses() {
  let successGuess = true;
  for (let i = 1; i <= numbersOfLetters; i++) {
    // Get input field for each letter in the word
    const inputField = document.querySelector(
      `#guess-${currentTry}-letter-${i}`
    );
    const inputletter = inputField.value.toLowerCase();
    const actualLetter = wordToGuess[i - 1];

    // Check if input value matches the actual letter
    if (inputField.value !== "") {
      if (inputletter === actualLetter) {
        inputField.classList.add("yes-in-place");
      } else if (wordToGuess.includes(inputletter)) {
        inputField.classList.add("not-in-place");
        successGuess = false;
      } else {
        inputField.classList.add("no");
        successGuess = false;
      }
    } else {
      inputField.classList.add("no");
      successGuess = false;
    }
  }

  // Display message for successful guess
  if (successGuess) {
    const winningPhrases = [
      "Congratulations! You guessed it right!",
      "You're a winner! Great job!",
      "Victory is yours! Well done!",
      "You've cracked the code! Amazing!",
      "You've won the challenge!",
      "Success! You've mastered the game!",
      "Fantastic! You've solved it!",
    ];

    messageAreas.forEach((message) => {
      message.innerHTML = `<p>${
        winningPhrases[Math.floor(Math.random() * winningPhrases.length)]
      }</p> <p>Reload to Play Again</p>`;
    })
    messageAreas.scrollIntoView({
  behavior: "smooth",
});

    // Disable input fields after successful guess
    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((div) => div.classList.add("disabled-inputs"));

    let allTriesInputs = document.querySelectorAll(".inputs > div input");
    allTriesInputs.forEach((input) => (input.disabled = true));

    checkButton.disabled = true;
    hintButton.disabled = true;
  } else {
    // Enable input fields for the next attempt
    const allTryDivs = document.querySelectorAll(".try");
    let nextIndex = currentTry; // currentTry Starts From 1 not 0
    let previousIndex = currentTry - 1;

    if (currentTry < numbersOfTries) {
      allTryDivs[nextIndex].classList.remove("disabled-inputs");
      for (let i = 0; i < allTryDivs[nextIndex].children.length; i++) {
        if (i !== 0) {
          allTryDivs[nextIndex].children[i].disabled = false;
        }
      }

      allTryDivs[previousIndex].classList.add("disabled-inputs");
      for (let i = 0; i < allTryDivs[previousIndex].children.length; i++) {
        if (i !== 0) {
          allTryDivs[previousIndex].children[i].disabled = true;
        }
      }

      let firstInputs = document.querySelectorAll(".try .first-input");
      for (let i = 1; i < firstInputs.length; i++) {
        firstInputs[i].focus();
      }
    }

    currentTry++;

    // Disable last input fields after all attempts are used
    if (currentTry > numbersOfTries) {
      allTryDivs[allTryDivs.length - 1].classList.add("disabled-inputs");
      for (
        let i = 0;
        i < allTryDivs[allTryDivs.length - 1].children.length;
        i++
      ) {
        if (i !== 0) {
          allTryDivs[allTryDivs.length - 1].children[i].disabled = true;
        }
      }

      checkButton.disabled = true;

      const losingPhrases = [
        `Sorry, you couldn't guess it this time. The word was <span>${wordToGuess}</span>`,
        `Better luck next time! The word was <span>${wordToGuess}</span>`,
        `Unfortunately, you didn't guess correctly. The word was <span>${wordToGuess}</span>`,
        `Sorry, that's not it. The word you were looking for is <span>${wordToGuess}</span>`,
        `Hard luck! The word was <span>${wordToGuess}</span>`,
        `You'll get it next time! The word was <span>${wordToGuess}</span>`,
        `Don't worry, it's a tough one! The word was <span>${wordToGuess}</span>`,
        `Almost there! The word was <span>${wordToGuess}</span>`,
        `Keep trying! The word was <span>${wordToGuess}</span>`,
      ];

      messageAreas.forEach((message) => {
        message.innerHTML = `<p>${
          losingPhrases[Math.floor(Math.random() * losingPhrases.length)]
        }</p> <p>Reload to Play Again</p>`;
      })

      hintButton.disabled = true;
    }
  }
}

const hintMessage = document.createElement("p");
hintMessage.innerHTML = `you'll need to clear your guesses before using hints.`;
hintMessage.style.cssText = "margin: 5px 0; display: none;";
document.querySelector(".game-area").append(hintMessage);

function getHint() {
  const enabledInputs = document.querySelectorAll("input:not([disabled])");
  const emptyEnabledInputs = Array.from(enabledInputs).filter(
    (input) => input.value === ""
  );

  if (numbersOfHints > 0 && emptyEnabledInputs.length !== 0) {
    numbersOfHints--;
    document.querySelector(".hint span span").innerHTML = numbersOfHints;
  }

  if (numbersOfHints === 0) {
    document.querySelector(".hint span").remove();
    hintButton.disabled = true;
  }

  if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
    const randomInput = emptyEnabledInputs[randomIndex];
    const indexToFill = Array.from(enabledInputs).indexOf(randomInput);

    if (indexToFill !== -1) {
      randomInput.value = wordToGuess[indexToFill].toUpperCase();
      hintMessage.style.display = "none";
    }
  } else if (emptyEnabledInputs.length === 0) {
    hintMessage.style.display = "block";
  }
}

// Generate input fields when the difficulty is chosen
const difficultyDiv = document.querySelector(".difficulty");
const difficultyButtons = document.querySelectorAll(
  ".difficulty-buttons button"
);

difficultyButtons.forEach((button) => {
  button.onclick = function () {
    numbersOfTries = parseInt(this.dataset.number);
    difficultyDiv.remove();
    document.querySelector(".guess-game").style.display = "flex";
    generateInputs();
  };
});
