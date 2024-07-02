// App.tsx
import React, { useState, useEffect } from 'react';
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';
import LogoutForm from './LogoutForm';
import TweetSubmit from './TweetSubmit';
import TweetDisplay from './TweetDisplay'
import Contentsfail from './Contentsfail';
import { fireAuth } from './firebase'; //firebaseからfireAuthをインポート
import { User, onAuthStateChanged } from 'firebase/auth'; // 必要なFirebase Authの型をインポート


class TweetNoId {
    username: string;
    userid: string;
    content: string;
    replyId?: number | null;

    constructor(username: string, userid: string, content: string, totweetid?: number | null) {
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
    replyId: number;
}

interface ReplyDictionary {
    [key: number]: Tweet[];
}

const App: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loginUser, setLoginUser] = useState<User | null>(null); // User型を明示的に指定
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [soloTweets, setSoloTweets] = useState<Tweet[]>([]);
  const [repliesAtTweet, setRepliesAtTweet] = useState<ReplyDictionary>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fireAuth, (user) => {
      setLoginUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchTweets();
  }, []);

  useEffect(() => {
      const soloTweetsList: Tweet[] = [];
      const repliesList: Tweet[] = [];
      const repliesDict: ReplyDictionary = {};

      tweets.forEach((tweet) => {
          if (tweet.replyId.toString() === "" || tweet.replyId === undefined) {
              soloTweetsList.push(tweet);
              repliesDict[tweet.id] = [];
          } else {
              repliesList.push(tweet);
          }
      });

      repliesList.forEach((reply) => {
          if (reply.replyId && repliesDict[reply.replyId]) {
              repliesDict[reply.replyId].push(reply);
          }
      });

      setSoloTweets(soloTweetsList);
      setRepliesAtTweet(repliesDict);
      console.log("solotweets:", soloTweetsList);
      console.log("replies:", repliesList);
      }, [tweets]);


  const fetchTweets = (): void => {
    fetch(`http://localhost:8080/tweets`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setTweets(data);
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


      const tweetNoId: TweetNoId = new TweetNoId(userName, userId ,content, null);
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
              fetchTweets();
          })
          .catch(error => {
              console.error('Error:', error);
          });

  }

  const handleSubmitReply = (content: string, toTweetId: number) => {

      if (!content) {
          alert("Please enter contents.");
          return;
      }

      if (content.length >280) {
          alert("Please enter contents shorter than 140 characters.")
      }


      const replyNoId: TweetNoId = new TweetNoId(userName, userId ,content, toTweetId);
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
              fetchTweets();
          })
          .catch(error => {
              console.error('Error:', error);
          });

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
                <TweetDisplay soloTweets={soloTweets} repliesAtTweet={repliesAtTweet} handleSubmitReply={handleSubmitReply}/>
            </div>
            :<Contentsfail />}
      </div>
  );
};

export default App;
