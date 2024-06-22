// App.tsx
import React, { useState, useEffect } from 'react';
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';
import LogoutForm from './LogoutForm';
import Tweet from './Tweet';
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

const App: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loginUser, setLoginUser] = useState<User | null>(null); // User型を明示的に指定
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState("");


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fireAuth, (user) => {
      setLoginUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchTweets(tweets);
  }, [tweets])

  const fetchTweets = (tweets: Tweet[]): void => {
    fetch('http://localhost:8080/user')
        .then(response => response.json())
        .then(data => {
          setTweets(data);
        })
        .catch(error => {
          console.error('Error:', error);
        })
  }


  const handleSubmitTweet = (content: string) => {
      if (!content) {
          alert("Please enter contents.");
          return;
      }

      if (content.length >280) {
          alert("Please enter contents shorter than 140 characters.")
      }

      const tweetNoId: TweetNoId = new TweetNoId(userName, userId ,content);
      fetch('http://localhost:8080/tweets', {
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

      fetch('http://localhost:8080/tweets')
          .then(response => response.json())
          .then(data => {
              console.log('succeed in get', data)
              setTweets(data);
          })
          .catch(error => {
              console.error('Error:', error);
          });
  }

    const Profile = () => {

        const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setUserName("");
            setUserId("");
        };

        return (
            <form onSubmit={handleSubmit}>
                <label>Name: </label>
                <input
                    type={"text"}
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                ></input>
                <label>Age: </label>
                <input
                    type={"text"}
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                ></input>
                <button type={"submit"}>POST</button>
            </form>
        );
    };

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
                <Profile />
                <Tweet onSubmit={handleSubmitTweet}/>
                {tweets.map((tweet) => (
                    <div key={tweet.id}>{tweet.username}+","+{tweet.content}</div>
                ))}
            </div>
            :<Contentsfail />}
      </div>
  );
};

export default App;
