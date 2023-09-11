import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from "./firebase";
import { getDocs, collection } from "firebase/firestore";



const LoginPage = () => {

    const [teamName, setTeamName] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        let teamFound = false;

        const querySnapshot = await getDocs(collection(db, "teams"));
        querySnapshot.forEach((item) => {          
            if (item.data().name === teamName) {
                teamFound = true;
            }
        })

        if (teamFound){
           navigate(`/menu/${teamName}`); 
        } else {
            alert("Team not in database!");
            setTeamName("");
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