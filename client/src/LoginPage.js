import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { app, db } from "./firebase";
import random from 'random'
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
        <Container>
            <Row>
                <Col><h1>Softball Stats Pro</h1></Col>
            </Row>
            <Row>
                <Form onSubmit={handleSubmit} aria-label="Log in to Team">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label htmlFor="team-name">Team Name</Form.Label>
                    <Form.Control id="team-name" value={teamName} className="mb-2" type="text" onChange={(e) => setTeamName(e.target.value)} placeholder='Team Name' maxLength={35} required/>
                    <Button type="submit">Sign In</Button>
                    </Form.Group>
                </Form>
            </Row>
        </Container>
    );
};

export default LoginPage;
