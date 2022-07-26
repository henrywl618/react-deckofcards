import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import Card from "./Card";
import "./CardGame.css"

const CardGame = ()=>{

    let [cardsLeft, setCardsLeft] = useState(52);
    let [cards, setCards] = useState([]);
    let [deckId, setDeckId] = useState(null);
    let [drawing, setDrawing] = useState(false);
    const intervalId = useRef();   

    //Gets a shuffled deck after component is first mounted to the DOM
    useEffect( ()=>{
        const getDeck = async ()=>{
            try {
                const response = await axios.get('http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
                console.log(response);
                setDeckId(response.data.deck_id);
            } catch(error) {
                console.error(error);
            }
        };
        getDeck();
    },[]);

    const drawCard = async ()=> {
        try{
            const response = await axios.get(`http://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);

            // Only add card data if we get a successful response. Success will be false if the deck is empty.
            if(response.data.success){
                const newCard = response.data.cards[0];

                setCards(currentCards => {
                    const copy = [...currentCards];
                    copy.push(newCard);
                    return copy;
                });
                setCardsLeft(response.data.remaining);
            }
        } catch(error) {
            console.error(error)
        }
    };

    useEffect( ()=>{

        if(drawing){
            if (cardsLeft <= 0) {
                // If there are no cards left, stop drawing, clear the interval and display an alert.
                setDrawing(false);
                clearInterval(intervalId.current);
                intervalId.current = null;
                alert("Error: no cards remaining!");
            } else if(!intervalId.current){
                intervalId.current = setInterval(()=>{
                    drawCard();
                },1000);
            }
        }else {
            //If not currently drawing cards, clear the interval to stop drawing cards.
            clearInterval(intervalId.current);
            intervalId.current = null;
        }

    },[cardsLeft,intervalId, drawing]);

    const handleClick = ()=>{
        drawing ? setDrawing(false) : setDrawing(true);
    };

    const handleShuffle = ()=>{
        const shuffleDeck = async()=>{
            try{
                const response = await axios.get(`http://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
                if(response.data.success && response.data.shuffled){
                    setCards([]);
                    setCardsLeft(response.data.remaining);
                };
            } catch(error){
                console.error(error);
            }

        };
        shuffleDeck();
    };

    return (
        <>  
            <div>
                <button onClick={handleClick} className="CardGame-button">{drawing? "Stop Drawing":"Start Drawing"}</button>
                <button onClick={handleShuffle} className="CardGame-button">Shuffle</button>
            </div>
            <div className="CardGame-container">
                {cards.map((card)=><Card image={card.image} 
                                         value={card.value} 
                                         suit={card.suit}
                                         key={`${card.value}-${card.suit}`}/>)}
            </div>
        </>
    );
};

export default CardGame;