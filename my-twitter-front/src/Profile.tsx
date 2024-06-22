import { useState } from "react";


const Profile = () => {
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState("");

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

export default Profile;