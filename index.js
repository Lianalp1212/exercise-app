// new button to record laps that saves the current time to a list of times.
// Laps should be shown at the bottom of the component and should be displayed using map using an array of lap times 
// stored as an array. Laps can be stored on the component and do not need to be stored on the parent component.
// timer refernced from demo-class-components example
// lap function referenced from https://www.reactnativeschool.com/build-a-custom-react-hook-stopwatch

import { useCallback, useEffect, useState } from "react"

let currentTimer = 0
let resetTimer = 0

export default function RunningExercise ({exercise, setMenuScreen}) {
    let [running, setRunning] = useState(false)
    let [timer, setTimer] = useState(0)
    let [lapper, setLapper] = useState(0)
    let [lappedTimes, setLappedTimes] = useState([])
    let mins = (Math.floor((timer / (1000*60)) % 60)).toString().padStart(2, "0")
    let secs = (Math.floor((timer / 1000) % 60)).toString().padStart(2, "0")

    let updateTimer = useCallback(() => {
        if(!running){
            setTimer((timer) => timer+10)
        }
    }, [running])

    let updateLapper = useCallback(() => {
        if(!running){
            setLappedTimes([...lappedTimes, timer])
            setLapper(timer)
        }
    }, [running, timer, lappedTimes])

    let recLaps = lappedTimes.map((lapTime, index) => {
        let mins2 = (Math.floor((lapTime / (1000*60)) % 60)).toString().padStart(2, "0")
        let secs2 = (Math.floor((lapTime / 1000) % 60)).toString().padStart(2, "0")
        return <li key={index}>{mins2}:{secs2}</li>
        })
        console.log(lappedTimes.map)
    
    useEffect(() => {
        currentTimer = setInterval(updateTimer, 10)
        return () => clearInterval(currentTimer)
    }, [running, updateTimer])

    let start = useCallback(() => {
        setRunning(!running)
    }, [running])

    let reset = useCallback(() => {
        clearInterval(currentTimer)
        setTimer(resetTimer)
        setLapper(0)
        setLappedTimes([])
    })
    
    //console.log("running")
    return (
        <div className="run">
            <h2>{exercise.name}</h2>
            <p style={{fontSize: "2em", fontFamily:"monospace"}}>Duration: {mins}:{secs}</p>
            <button onClick={start}>Start</button>
            <br/>
            <button onClick={updateLapper}>Lap</button>
            <br/>
            <button onClick={reset}>Reset</button>
            <br/>
            <button onClick={()=>setMenuScreen()}>Return</button>
            <h3>Lapped Times</h3>
            <div>
                <ul style={{listStyleType: "none"}}>
                    {recLaps}
                </ul>
            </div>
        </div>
    )
}

// let lapTimes = laps.map((lap, index)=>
//     <li key={index}>{lap}</li>)    

// let {name} = exercise 
// <h2>{name}</h2><ul>{lapTimes}</ul>
            // <button onClick={start}>Start</button>
            // <br/>
            // <button onClick={lapTimes}>Lap</button>
            // <br/>
            // <button onClick={reset}>Reset</button>
            // <br/>
            // <button onClick={setMenuScreen}>Return</button>
            // <br/>