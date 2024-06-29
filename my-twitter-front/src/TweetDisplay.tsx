import React from 'react';
import Fav from "./Fav";
import Reply from "./Reply";

interface Tweet {
    id: number;
    username: string;
    userid: string;
    content: string;
    fav: number;
    totweetid: number;
}

interface ReplyDictionary {
    [key: number]: Tweet[];
}

interface TweetDisplayProps {
    tweets: Tweet[];
    replies: Tweet[];
    handleSubmitReply: (content: string, toTweetId: number) => void;
}

const TweetDisplay: React.FC<TweetDisplayProps> = ({tweets, replies,handleSubmitReply}) => {
    const repliesAtTweet: ReplyDictionary = {};

    tweets.forEach((tweet, index) =>　{
        repliesAtTweet[tweet.id] = [];
    })

    replies.forEach((reply, index) => {
        tweets.forEach((tweet, index) => {
                if (reply.totweetid === tweet.id) {
                    repliesAtTweet[reply.totweetid].push(tweet);
                }
            }
        )
    });

    return(
        <div>
            {tweets.map((tweet: Tweet) => (
                <div key={tweet.id}>user:{tweet.username} {tweet.content} fav:{tweet.fav}
                    <Fav id={tweet.id} />
                    <Reply onSubmit={handleSubmitReply} toTweetId={tweet.id}/>
                    {repliesAtTweet[tweet.id].map((reply: Tweet) => (
                        <div key={reply.id}>
                            user:{reply.username} @{tweet.userid} {reply.content} fav:{reply.fav}
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