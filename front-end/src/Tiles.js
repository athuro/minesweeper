import React from "react";
import { useState, useEffect } from "react";
import './Tiles.css' 

const Tiles = () => {

    const flagURL = 'https://play-lh.googleusercontent.com/S1h8A8cR9s1aLOkFwZJjPRaB4HG6DEWwEUOn_x4olAg-d45vTbt65GkJWYyozANaahM'
    const bombURL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrRLiONJZhFGSR666tR2xWdyYoG36hA85DUA&usqp=CAU'
    
    const [dummy, setDummy] = useState(false)
    useEffect(() => console.log('Clicked'), [dummy]) //re-render tiles on click

    //! Initialize tiles
    const size = 10; //initial size for ease
    const [tileArray, setTileArray] = useState([])
    // const [bombLoc, setBombLoc] = useState([])

    useEffect(() => {
        const generateTiles = () => {
            const newArray = new Array(size * size).fill().map(() => ({
                wasClicked: false,
                wasFlagged: false,
                isBomb: false,
                adjacentBombCount: 0,
            }));

        let bombLoc = []
        for (let i = 0; i < size; i++) {
            let location = Math.floor(Math.random() * 100);
            if(!newArray[location].isBomb){
                newArray[location].isBomb = true;
                bombLoc.push(location)
            } else {
                i--
            }
        }
        console.log(bombLoc)
        
        //! Touching logic
        for (let i = 0; i < size; i++) {
            let bombIndex = bombLoc[i]
            if (newArray[bombIndex-1] && (bombIndex%size != 0)) { //left
                newArray[bombIndex-1].adjacentBombCount+=1
            } if (newArray[bombIndex+1] && (bombIndex%size != size-1)) { //right
                newArray[bombIndex+1].adjacentBombCount+=1
            } if (newArray[bombIndex+size]) { //bottom
                newArray[bombIndex+size].adjacentBombCount+=1
            } if (newArray[bombIndex-size]) { //top
                newArray[bombIndex-size].adjacentBombCount+=1
            } if (newArray[bombIndex+1+size] && (bombIndex%size != size-1)) { //lower right
                newArray[bombIndex+1+size].adjacentBombCount+=1
            } if (newArray[bombIndex-1-size] && (bombIndex%size != 0)) { // upper left
                newArray[bombIndex-1-size].adjacentBombCount+=1
            } if (newArray[bombIndex+size-1] && (bombIndex%size != 0)) { //lower left
                newArray[bombIndex+size-1].adjacentBombCount+=1
            } if (newArray[bombIndex-size+1] && (bombIndex%size != size-1)) { //upper right
                newArray[bombIndex-size+1].adjacentBombCount+=1
            }
        }
        setTileArray(newArray);
        };

        generateTiles();
    }, []);


   //! Click handler
    const clickHandle = (i, event) => {
        setDummy(!dummy)
        event.preventDefault()

        if (event.type === 'click') {
            if(!tileArray[i].wasFlagged) { //can't click a flagged tile
                tileArray[i].wasClicked = true
                if(tileArray[i].isBomb) {
                    console.log('Loser')
                } else {
                    // console.log(tileArray[i].adjacentBombCount)
                    return <p>{tileArray[i].adjacentBombCount}</p>
                }
                console.log(tileArray[i])
            }

        } else if (event.type === 'contextmenu') {
            if(!tileArray[i].wasClicked) { //can't flag a clicked tile
                tileArray[i].wasFlagged = !tileArray[i].wasFlagged
                console.log(tileArray[i])
            }
        }
    }

    return (
        <div className="board">
            {tileArray.map((e,i) => {
                return(
                    <button className={e.wasClicked?'clicked':'unclicked'} key={i} onClick={(event) => clickHandle(i, event)} onContextMenu={(event) => clickHandle(i, event)}>
                        {(e.wasClicked && !e.isBomb) ? <p>{e.adjacentBombCount}</p> : (e.wasClicked && e.isBomb) ? <p><img className='flag' src={bombURL}></img></p> : e.wasFlagged ? <p><img className='flag' src={flagURL}></img></p> : <p></p>}
                    </button>
                )
            })}
        </div>
    )
}

export default Tiles