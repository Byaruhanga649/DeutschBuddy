// DeutschBuddy German Dictionary

const form = document.querySelector("#dictionary-form");
const wordInput = document.querySelector("#word-input");
const result = document.querySelector("#dictionary-result");


// Search for a German word
async function lookupGermanWord(word) {

    const url = `https://freedictionaryapi.com/api/v1/entries/de/${encodeURIComponent(word)}?translations=true`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Word not found.");
        }

        const data = await response.json();

        console.log("Dictionary Results:", data);

        return data;

    } catch (error) {
        console.error("Dictionary Error:", error.message);
        return null;
    }
}


// Display dictionary results
if (form) {

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const word = wordInput.value.trim();

        if (word === "") {
            return;
        }

        result.innerHTML = "<p>Searching...</p>";

        const data = await lookupGermanWord(word);

        if (!data || !data.entries || data.entries.length === 0) {
            result.innerHTML = "<p>Sorry, this word was not found.</p>";
            return;
        }

        let html = `<h3>${data.word}</h3>`;

        data.entries.forEach(function (entry) {

            html += `<p><strong>Word Type:</strong> ${entry.partOfSpeech || "Not available"}</p>`;

            if (entry.pronunciations && entry.pronunciations.length > 0) {
                html += `<p><strong>Pronunciation:</strong> ${entry.pronunciations[0].text}</p>`;
            }

            if (entry.senses && entry.senses.length > 0) {

                entry.senses.forEach(function (sense) {

                    html += `<p><strong>Meaning:</strong> ${sense.definition}</p>`;

                });

            }

        });

        result.innerHTML = html;

    });

}


// German Practice Quiz

const quizOptions = document.querySelectorAll(".quiz-option");
const quizResult = document.querySelector("#quiz-result");

quizOptions.forEach(function (option) {

    option.addEventListener("click", function () {

        if (option.dataset.answer === "correct") {

            quizResult.textContent = "Correct! Danke means Thank you. Well done!";

        } else {

            quizResult.textContent = "Not quite. Try again!";

        }

    });

});


// Favorites Section

const favoritesList = document.querySelector("#favorites-list");

// Get saved words from local storage
let favoriteWords = JSON.parse(localStorage.getItem("favoriteWords")) || [];


// Add words to Favorites
const addFavoriteButtons = document.querySelectorAll(".add-favorite");

addFavoriteButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const germanWord = button.dataset.german;
        const englishMeaning = button.dataset.english;

        // Check if the word is already saved
        const alreadySaved = favoriteWords.some(function (word) {

            return word.german === germanWord;

        });

        if (alreadySaved) {

            alert("This word is already in your favorites!");
            return;

        }

        // Create a new favorite word
        const newWord = {
            german: germanWord,
            english: englishMeaning
        };

        // Save the word
        favoriteWords.push(newWord);

        localStorage.setItem("favoriteWords", JSON.stringify(favoriteWords));

        alert(germanWord + " has been added to your favorites!");

    });

});


// Display saved words
function displayFavorites() {

    if (!favoritesList) {
        return;
    }

    if (favoriteWords.length === 0) {

        favoritesList.innerHTML = "<p>You have not saved any words yet.</p>";
        return;

    }

    favoritesList.innerHTML = "";

    favoriteWords.forEach(function (word) {

        const card = document.createElement("article");

        card.className = "vocabulary-card";

        const heading = document.createElement("h3");
        heading.textContent = word.german;

        const meaning = document.createElement("p");
        meaning.textContent = word.english;

        // Create Remove button
        const removeButton = document.createElement("button");

        removeButton.className = "remove-favorite";
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", function () {

            favoriteWords = favoriteWords.filter(function (item) {

                return item.german !== word.german;

            });

            localStorage.setItem("favoriteWords", JSON.stringify(favoriteWords));

            displayFavorites();

        });

        card.appendChild(heading);
        card.appendChild(meaning);
        card.appendChild(removeButton);

        favoritesList.appendChild(card);

    });

}


// Display favorites when the page loads
displayFavorites();