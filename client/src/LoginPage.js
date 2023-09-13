import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";



const LoginPage = () => {

    const [teamName, setTeamName] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const docRef = doc(db, "teams", teamName);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()){
            navigate(`/menu/${teamName}`)
        } else {
            setTeamName("");
            alert("Team not found");
        }
    }

    return (
        <section className="login">
            <h1>Softball Stats Pro</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="team-name">Team Name</label>
                <input id="team-name" type="text" name="teamName" value={teamName} onChange={(e) => setTeamName(e.target.value)} required/>
                <button type="submit">Sign In</button>
            </form>
        </section>
    );
};

export default LoginPage;