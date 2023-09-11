import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { teams } from './DummyData';



const LoginPage = () => {

    const [teamName, setTeamName] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        let found = false;
        teams.forEach((team) => {
            if (team.name === teamName){
                found = true;
            }
        })
        if (found){
           navigate(`/menu/${teamName}`); 
        } else {
            alert("Team not in database!")
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