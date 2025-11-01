import { useState, useEffect, useRef } from "react"
import Die from "./components/Die"
import Hero from "./components/Hero"
import GameWon from "./components/GameWon"
import Scoreboard from "./components/Scoreboard"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = useState(() => generateAllNewDice())
    const [gameWon, setGameWon] = useState(false)
    const [rollCounter, setRollCounter] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const [timeElapsed, setTimeElapsed] = useState(0)

    const button = useRef(null)
    const gameRef = useRef(null)
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

    // focus button on game win
    useEffect(() => {
        gameWon && button.current.focus()
    }, [gameWon])

    // NEW: measure the game container size (for confetti)
    useEffect(() => {
        if (gameRef.current) {
            const rect = gameRef.current.getBoundingClientRect()
            setContainerSize({ width: rect.width, height: rect.height })
        }
    }, [gameWon])

    // generate new dice
    function generateAllNewDice() {
        return new Array(10)
            .fill(0)
            .map(() => ({
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
            }))
    }

    // check win condition
    useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allValueMatched = dice.every(die => die.value === firstValue)

        if (allHeld && allValueMatched) {
            setGameWon(true)
            setIsRunning(false)
        } else {
            setGameWon
        }
    }, [dice])

    // toggle box function
    function toggleBox(id) {
        setDice(prevDice =>
            prevDice.map((die, index) =>
                index === id
                    ? { ...die, isHeld: !die.isHeld } // toggle that one
                    : die // keep the others same
            )
        )
        setIsRunning(true)
        button.current.focus()
    }

    // timer
    useEffect(() => {
        let interval
        if (isRunning) {
            interval = setInterval(() => {
                setTimeElapsed(prev => prev + 1)
            }, 1000)
        }

        // cleanup function for interval when stop or component unmounts
        return () => clearInterval(interval)
    }, [isRunning])

    // roll dice function
    function rollDice() {
        if (gameWon) {
            setDice(prev => generateAllNewDice())
            setGameWon(false)
            setRollCounter(0)
            setTimeElapsed(0)
            setIsRunning(false)
        } else {
            setDice(oldDice =>
                oldDice.map(die =>
                    die.isHeld
                        ? die
                        : { ...die, value: Math.ceil(Math.random() * 6) }
                )
            )
            setRollCounter(prev => prev + 1)
            setIsRunning(true)
        }
    }

    // create dice elements
    const diceElements = dice.map((dieObj, index) =>
        <Die
            value={dieObj.value}
            key={index}
            isHeld={dieObj.isHeld}
            toggleBox={() => toggleBox(index)}
        />
    )

    return (
        <main ref={gameRef} className="game-container">

            {gameWon && (
                <div className="confetti-wrapper">
                    <Confetti
                        width={containerSize.width}
                        height={containerSize.height}
                        numberOfPieces={200}
                        recycle={false}
                    />
                </div>
            )}

            {gameWon && <GameWon />}

            <Hero />

            <div className="dice-container">
                {diceElements}
            </div>

            <Scoreboard
                gameWon={gameWon}
                rollCounter={rollCounter}
                timeElapsed={timeElapsed}
            />

            <button ref={button} className="roll-button" onClick={rollDice}>
                {gameWon ? "New Game" : "Roll"}
            </button>
        </main>
    )
}
