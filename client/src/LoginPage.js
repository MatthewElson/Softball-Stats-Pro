import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { app, db } from "./firebase";
import random from 'random'
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [teamName, setTeamName] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const colRef = collection(db, "teams")
        const teams = [];
        getDocs(colRef)
            .then((snapshot) => {
                console.log('snapshot.docs :', snapshot.docs);
                snapshot.docs.forEach(doc => {
                    teams.push({ ...doc.data(), id: doc.id});
                })
                console.log('teams :', teams);
                const filteredTeams = teams.find((v) => v.name === teamName)
                console.log('filteredTeams :', filteredTeams);
                setTimeout(() => {
                    setIsLoading(false);
                    if (filteredTeams && filteredTeams.name === teamName){
                        navigate(`/menu/${ teamName }`);
                    } else {
                        setTeamName("");
                        alert("Team not found");
                    }
                    console.log(teams);
                }, random.float(1000, 2000));
                if(isLoading){
                    
                }
            })
            .catch(err => {
                console.log(err.message);
            })
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
