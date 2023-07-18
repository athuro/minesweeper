import React from "react";
import { useState, useEffect } from "react";
import './Tiles.css'
import Timer from "./Timer"; 

const Tiles = (props) => {

    const flagURL = 'https://play-lh.googleusercontent.com/S1h8A8cR9s1aLOkFwZJjPRaB4HG6DEWwEUOn_x4olAg-d45vTbt65GkJWYyozANaahM'
    const bombURL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrRLiONJZhFGSR666tR2xWdyYoG36hA85DUA&usqp=CAU'
    
    const clickAdjacentTiles = (index) => {
        const row = Math.floor(index / size);
        const column = index % size;
        const adjacentIndices = [
            index - 1,             // left
            index + 1,             // right
            index + size,          // bottom
            index - size,          // top
            index + 1 + size,      // lower right
            index - 1 - size,      // upper left
            index + size - 1,      // lower left
            index - size + 1       // upper right
        ];
      
        if (column === 0) {
            adjacentIndices.splice(0, 1); // Remove left
            adjacentIndices.splice(4, 1); // Remove upper left
            adjacentIndices.splice(4, 1); // Remove lower left
        } else if (column === size - 1) {
            adjacentIndices.splice(1, 1); // Remove right
            adjacentIndices.splice(3, 1); // Remove lower right
            adjacentIndices.splice(5, 1); // Remove upper right
            
        } 
        
        if (row === 0) {
            adjacentIndices.splice(3, 1); // Remove top
            adjacentIndices.splice(4, 1); // Remove upper left
            adjacentIndices.splice(5, 1); // Remove upper right
        } else if (row === size-1) {
            adjacentIndices.splice(2, 1); // Remove bottom
            adjacentIndices.splice(3, 1); // Remove lower left
            adjacentIndices.splice(4, 1); // Remove lower right
        }
        
        adjacentIndices.forEach((adjIndex) => {
            const adjRow = Math.floor(adjIndex / size);
            const adjColumn = adjIndex % size;
        
            if (
                adjRow >= 0 &&
                adjRow < size &&
                adjColumn >= 0 &&
                adjColumn < size &&
                !tileArray[adjIndex].wasClicked &&
                !tileArray[adjIndex].isBomb
            ) {
                tileArray[adjIndex].wasClicked = true;
                if (tileArray[adjIndex].adjacentBombCount === 0) {
                    // console.log(adjIndex)
                    clickAdjacentTiles(adjIndex); // Recursive call on adjacent tiles with adjacent indices
                }
            }
        });
    };

    const [dummy, setDummy] = useState(false)
    useEffect(() => console.log('Clicked'), [dummy]) //re-render tiles on click

    //! Initialize tiles
    const size = Number(props.difficulty.size); //initial size for ease
    let bombCount
    if(size == 10){
        bombCount = size;
    } else if(size == 15) {
        bombCount = size * 2;
    } else {
        bombCount = size*4;
    }
    const [tileArray, setTileArray] = useState([])
    const [firstClickIndex, setFirstClickIndex] = useState(-1)
    const [firstClick, setFirstClick] = useState(true)
    const [flagsLeft, setFlagsLeft] = useState(bombCount)
    const [reload, setReload] = useState(true)

    useEffect(() => {
        const generateTiles = () => {
            const newArray = new Array(size * size).fill().map(() => ({
                wasClicked: false,
                wasFlagged: false,
                isBomb: false,
                adjacentBombCount: 0,
            }));

            if(firstClickIndex != -1){
                newArray[firstClickIndex].wasClicked = true;
            }

            let bombLoc = []
            for (let i = 0; i < bombCount; i++) {
                let location = Math.floor(Math.random() * size*size);
                if(
                    !newArray[location].isBomb &&
                    location != firstClickIndex &&
                    location != firstClickIndex-1 &&
                    location != firstClickIndex+1 &&
                    location != firstClickIndex-size &&
                    location != firstClickIndex+size &&
                    location != firstClickIndex-1-size &&
                    location != firstClickIndex-1+size &&
                    location != firstClickIndex+1+size &&
                    location != firstClickIndex+1-size
                ){
                    newArray[location].isBomb = true;
                    bombLoc.push(location)
                } else {
                    i--
                }
            }
            console.log(bombLoc)
            
            //! Touching logic
            for (let i = 0; i < bombCount; i++) {
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
    }, [firstClick, reload]);


   //! Click handler
    const clickHandle = (i, event) => {

        if(firstClick) {
            setFirstClick(false)
            setFirstClickIndex(i);
        }

        else {
            setDummy(!dummy)
            event.preventDefault()

            if (event.type === 'click') {
                if(!tileArray[i].wasFlagged) { //can't click a flagged tile
                    tileArray[i].wasClicked = true
                    if(tileArray[i].isBomb) {
                        let title = document.getElementById('title')
                        title.innerHTML = 'Game Over, Click Play to Resart'
                    } else if (tileArray[i].adjacentBombCount === 0) {
                        clickAdjacentTiles(i)
                    } else {
                        // console.log(tileArray[i].adjacentBombCount)
                        return <p>{tileArray[i].adjacentBombCount}</p>
                    }
                }

            } else if (event.type === 'contextmenu') {
                if(!tileArray[i].wasClicked) { //can't flag a clicked tile
                    tileArray[i].wasFlagged = !tileArray[i].wasFlagged
                    if(tileArray[i].wasFlagged){
                        setFlagsLeft(flagsLeft-1)
                    } else {
                        setFlagsLeft(flagsLeft+1)
                    }
                }
            }
        }
    }

    return (
        <>
            <div className="flagCount">Mines Remaining: {flagsLeft}</div>
            <div className="board" style={{ gridTemplateColumns: `repeat(${size}, auto)` }}>
                {tileArray.map((e,i) => {
                    return(
                        <button style={{ width: `${100/size}vh`, height: `${100/size}vh`}} className={e.wasClicked?'clicked':'unclicked'} key={i} onClick={(event) => clickHandle(i, event)} onContextMenu={(event) => clickHandle(i, event)}>
                            {(e.wasClicked && !e.isBomb) ? <p className={(e.adjacentBombCount==1)?'one':(e.adjacentBombCount==2)?'two':(e.adjacentBombCount==3)?'three':(e.adjacentBombCount==4)?'four':'other'}>{e.adjacentBombCount ? e.adjacentBombCount : ''}</p> : (e.wasClicked && e.isBomb) ? <p><img style={{ width: `${100/size-1}vh`, height: `${100/size-1}vh`}} src={bombURL}></img></p> : e.wasFlagged ? <p><img style={{ width: `${100/size-1}vh`, height: `${100/size-1}vh`}} src={flagURL}></img></p> : <p></p>}
                        </button>
                    )
                })}
            </div>
        </>
        
    )
}

export default Tiles