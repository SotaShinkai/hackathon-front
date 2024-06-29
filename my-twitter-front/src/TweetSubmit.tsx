import React, { useState } from 'react';



type TweetProps = {
    onSubmit: (content: string) => void;
};

const TweetSubmit = (props: TweetProps) => {
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

export default TweetSubmit;
