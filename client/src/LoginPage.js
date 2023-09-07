import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';



const LoginPage = () => {

    const [teamName, setTeamName] = useState("");
    const [teamPassword, setTeamPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    }

    return (
        <section className="login">
            <h1>Softball Stats Pro</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="team-name">Team Name</label>
                <input id="team-name" type="text" name="teamName" value={teamName} onChange={(e) => setTeamName(e.target.value)} required/>
                <label htmlFor="team-password">Password</label>
                <input id="team-password" type="password" name="teamPassword" value={teamPassword} onChange={(e) => setTeamPassword(e.target.value)} required/>
                <button type="submit">Sign In</button>
            </form>
        </section>
    );
};

export default LoginPage;