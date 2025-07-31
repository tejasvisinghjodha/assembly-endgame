import { useState } from 'react'
import './App.css'
import { languages } from "./language.js"
import { getFarewellText, getRandomWord } from "./utils.js"
import { clsx } from 'clsx'
import Confetti from "react-confetti"

function App() {
  const [currentWord, setCurrentWord] = useState(() => getRandomWord())
  const [guessArray, setGuessArray] = useState([])
  const wrongGuessCount = guessArray.filter(x => (!currentWord.includes(x))).length
  const isGameWon = currentWord.split('').every(letter => guessArray.includes(letter))
  const isGameLost = wrongGuessCount >= 8
  const isGameOver = isGameLost || isGameWon
  const currentWordElements = currentWord.split("").map((letter) => (
    <span>{guessArray.includes(letter) || isGameLost ? letter.toUpperCase() : ""}
    </span>
  ))

  const languageElements = languages.map((lang, index) => {
    const classname = clsx({
      lost: index < wrongGuessCount
    })
    return (
      <span style={{ backgroundColor: lang.backgroundColor, color: lang.color }}
        className={classname}
      >{lang.name}</span>
    )
  })

  const alphabet = "abcdefghijklmnopqrstuvwxyz"
  const keyboardElements = alphabet.split("").map((letter) => {
    const isGuessed = guessArray.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)
    const classname = clsx({
      correct: isCorrect,
      wrong: isWrong
    })
    return (
      <button
        className={classname}
        disabled={isGameOver}
        onClick={() => addKeyboardElements(letter)} >{letter.toUpperCase()}</button>
    )
  })

  function addKeyboardElements(x) {
    setGuessArray(prev => (prev.includes(x) ? prev : [...prev, x]))
  }
  const gamestatues = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost
  })

  function renderGameStatus() {
    if (wrongGuessCount == 0) return null
    if (!isGameOver && isLastGuessed) {
      let currentLanguage = languages[wrongGuessCount - 1].name
      return getFarewellText(currentLanguage);
    }

    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      );
    }

    if (isGameLost) {
      return (
        <>
          <h2>You lost!</h2>
          <p>Well played</p>
        </>
      );
    }
    return null;
  }

  const isLastGuessed = !currentWord.includes(guessArray[guessArray.length - 1])

  function startNewGame() {
    setCurrentWord(getRandomWord());
    setGuessArray([])
  }

  return (
    <>
      {isGameWon && <Confetti />}
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
      </header>
      <section className={gamestatues}>
        {renderGameStatus()}
      </section>
      <section className="lang-section">
        {languageElements}
      </section>
      <section className="word">
        {currentWordElements}
      </section>
      <section className="keyboard">
        {keyboardElements}
      </section>
      {isGameOver && <button id="new-game" onClick={startNewGame}>New Game</button>}
    </>
  )
}

export default App
