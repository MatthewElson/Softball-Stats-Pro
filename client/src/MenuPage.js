import React from 'react';
import { Link } from 'react-router-dom';

const MenuPage = () => {
    return (
        <section className="menu">
            <h1>Menu</h1>
            <div className="menu-buttons">
                <Link className="link-button" to="/new-game">Record Game</Link>
                <Link className="link-button" to="/team-stats">View Team Stats</Link>
                <Link className="link-button" to="/logout">Logout</Link>
            </div>
        </section>
    );
};

export default MenuPage;