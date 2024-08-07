import React, { useState } from 'react';

interface FavProps {
    id: number;
}

interface FavId {
    id: number;
    isFaved: boolean;
}

const Fav: React.FC<FavProps> = ( {id} ) => {
    const url = `https://hackathon2-fprfp6fbkq-uc.a.run.app/tweets`;
    const [isFaved, setIsFaved] = useState(false);


    const handleToggle = () => {
        setIsFaved(isFaved => !isFaved);
        const tweet: FavId = {id, isFaved}
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
                },
            body: JSON.stringify(tweet)
        });
    };
    return (
        <button onClick={handleToggle}>Fav</button>
    );
};

export default Fav;