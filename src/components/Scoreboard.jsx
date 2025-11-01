export default function Scoreboard({gameWon, rollCounter, timeElapsed}) {
    return (
        <div className="box">
            <p className="counter">
                {gameWon ? `Total Rolls: `
                : `Rolls: `}
                {rollCounter}
            </p>
            <p className="timer">
                {gameWon ? `Total Time Elapsed: `
                :`Time: `}
                {timeElapsed}s
            </p>
        </div>
    )
}