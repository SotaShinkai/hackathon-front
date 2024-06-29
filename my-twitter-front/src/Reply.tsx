import React, { useState } from 'react';

type ReplyProps = {
    onSubmit: (content: string, toTweetId: number) => void;
    toTweetId: number;
};

const Reply: React.FC<ReplyProps> = ({ onSubmit, toTweetId}) => {
    const [tweetContent, setTweetContent] = useState<string>('');
    const [isPut, setIsPut] = useState<boolean>(false);

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(tweetContent, toTweetId);
        console.log(toTweetId, tweetContent);
        setTweetContent("");
    }

    const handleReplyButton = () => {
        setIsPut(isPut => !isPut);
    };


    return (
        <div>
            <button onClick={handleReplyButton}>
                Reply
            </button>
            {isPut && <form onSubmit={submit}>
                <input
                    type="text"
                    value={tweetContent}
                    onChange={(e) => setTweetContent(e.target.value)}
                    placeholder="What's happening?"/>
                <button type={"submit"}>Tweet</button>
            </form>}
        </div>


    );
}

export default Reply