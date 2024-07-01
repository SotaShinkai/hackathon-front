// App.tsx
import React, { useState, useEffect } from 'react';
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';
import LogoutForm from './LogoutForm';
import TweetSubmit from './TweetSubmit';
import TweetDisplay from './TweetDisplay'
import Contentsfail from './Contentsfail';
import { fireAuth } from './firebase'; // firebaseからfireAuthをインポート
import { User, onAuthStateChanged } from 'firebase/auth'; // 必要なFirebase Authの型をインポート

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

class ReplyNoId {
    username: string;
    userid: string;
    content: string;
    replyId: number;

    constructor(username: string, userid: string, content: string, totweetid: number) {
        this.username= username;
        this.userid = userid;
        this.content= content;
        this.replyId = totweetid;
    }
}

interface Tweet {
    id: number;
    username: string;
    userid: string;
    content: string;
    fav: number;
    replyId?: number | null;
}

const App: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loginUser, setLoginUser] = useState<User | null>(null); // User型を明示的に指定
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [replies, setReplies] = useState<Tweet[]>([]);
  const [soloTweets, setSoloTweets] = useState<Tweet[]>([]);

    const addTweet = (tweet: Tweet) => {
        setSoloTweets([...soloTweets, tweet]);
    }
    const addReply = (reply: Tweet) => {
        setReplies([...replies, reply]);
    }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fireAuth, (user) => {
      setLoginUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchTweets(tweets);
  }, [tweets]);


  const fetchTweets = (tweets: Tweet[]): void => {
    fetch(`http://localhost:8080/tweets`)
        .then(response => response.json())
        .then(data => {
            setTweets(data);
            data.forEach((tweet: Tweet) => {
                if(tweet.replyId === null) {
                    addTweet(tweet);
                } else {
                    addReply(tweet);
                }
            });
        })
        .catch(error => {
          console.error('Error:', error);
        })
  }


  const handleSubmitProfile = (submit: React.FormEvent<HTMLFormElement>) => {
        submit.preventDefault();
        console.log("onSubmit: ", userName, userId);
  };

  const handleSubmitTweet = (content: string) => {
      if (!content) {
          alert("Please enter contents.");
          return;
      }

      if (content.length >280) {
          alert("Please enter contents shorter than 140 characters.")
      }


      const tweetNoId: TweetNoId = new TweetNoId(userName, userId ,content);
      fetch(`http://localhost:8080/tweets`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(tweetNoId)
      })
          .then(response => response.json())
          .then(data => {
              console.log('succeed in post', data);
          })
          .catch(error => {
              console.error('Error:', error);
          });

      fetchTweets(tweets);
  }

  const handleSubmitReply = (content: string, toTweetId: number) => {

      if (!content) {
          alert("Please enter contents.");
          return;
      }

      if (content.length >280) {
          alert("Please enter contents shorter than 140 characters.")
      }


      const replyNoId: ReplyNoId = new ReplyNoId(userName, userId ,content, toTweetId);
      console.log(replyNoId);
      fetch(`http://localhost:8080/tweets`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(replyNoId)
      })
          .then(response => response.json())
          .then(data => {
              console.log('succeed in post', data);
          })
          .catch(error => {
              console.error('Error:', error);
          });

      fetchTweets(tweets);
  }


  return (
      <div>
        <h1>Authentication</h1>
        {(
            <>
              <SignUpForm />
              <LoginForm />
              <LogoutForm />
            </>
        )}
        {loginUser ?
            <div>
                <form onSubmit={handleSubmitProfile}>
                    <label>UserName</label>
                    <input
                        type={"text"}
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    ></input>
                    <label>UserId</label>
                    <input
                        type={"text"}
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    ></input>
                    <button type={"submit"}>Submit</button>
                </form>
                <TweetSubmit onSubmit={handleSubmitTweet}/>
                <TweetDisplay tweets={tweets} replies={replies} handleSubmitReply={handleSubmitReply}/>
            </div>
            :<Contentsfail />}
      </div>
  );
};

export default App;
