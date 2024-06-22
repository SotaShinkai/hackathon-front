import React, { useState, useEffect } from 'react';

interface Tweet {
  id: number;
  username: string;
  userid: string;
  content: string;
}

class TweetNoId {
    username: string;
    userid: string;
    content: string;

    constructor(username: string, userid: string, content: string) {
        this.username= username;
        this.userid = userid;
        this.content= content;
    }
}

type TweetProps = {
    onSubmit: (content: string) => void;
};

const Tweet = (props: TweetProps) => {
  const [tweetContent, setTweetContent] = useState<string>('');

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      props.onSubmit(tweetContent);
      setTweetContent("");
  }


  return (
        <form onSubmit={submit}>
            <input
            type="text"
            value={tweetContent}
            onChange={(e) => setTweetContent(e.target.value)}
            placeholder="What's happening?" />
            <button type={"submit"}>Tweet</button>
        </form>

  );
};

export default Tweet;
