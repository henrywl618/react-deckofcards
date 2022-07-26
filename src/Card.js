import React,{useEffect, useState} from "react";
import "./Card.css"

const Card = ({image,value,suit})=>{

    let [position,setPosition] = useState({})

    useEffect(()=>{
        setPosition({rotation:Math.random()*360,
                     offset:Math.random()*15});
    },[]);

    return <img src={image}  
                className="Card" 
                style={{transform:`rotate(${position.rotation}deg)`,
                        top:`${120+position.offset}px`}}/> 
};

export default Card;