import React from 'react';
import { Link, useParams } from 'react-router-dom';

const MenuPage = () => {

    const { teamName } = useParams();

    return (
        <section className="menu">
            <h1>Menu</h1>
            <div className="menu-buttons">
                <Link className="link-button" to={`/new-game/${teamName}`}>Record Game</Link>
                <Link className="link-button" to={`/team-stats/${teamName}`}>View Team Stats</Link>
                <Link className="link-button" to="/">Return</Link>
            </div>
        </section>
    );
};

export default MenuPage;