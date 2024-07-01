import React from 'react';
import Fav from "./Fav";
import Reply from "./Reply";

interface Tweet {
    id: number;
    username: string;
    userid: string;
    content: string;
    fav: number;
    replyId?: number | null;
}

interface ReplyDictionary {
    [key: number]: Tweet[];
}

interface TweetDisplayProps {
    soloTweets: Tweet[];
    repliesAtTweet: ReplyDictionary;
    handleSubmitReply: (content: string, toTweetId: number) => void;
}

const TweetDisplay: React.FC<TweetDisplayProps> = ({soloTweets, repliesAtTweet, handleSubmitReply}) => {

    console.log("TweetDisplay;soloTweets:", soloTweets);

    return(
        <div>
            {soloTweets.map((tweet: Tweet) => (
                <div key={tweet.id}>user:{tweet.username} content:{tweet.content} fav:{tweet.fav}
                    <Fav id={tweet.id} />
                    <Reply onSubmit={handleSubmitReply} toTweetId={tweet.id}/>
                    {repliesAtTweet[tweet.id]?.map((reply: Tweet) => (
                        <div key={reply.id}>
                            user:{reply.username} @{tweet.userid} reply:{reply.content} fav:{reply.fav}
                            <Fav id={tweet.id} />
                            <Reply onSubmit={handleSubmitReply} toTweetId={reply.id}/>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );





};

export default TweetDisplay;