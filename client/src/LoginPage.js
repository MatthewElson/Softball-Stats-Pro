import React from 'react';

const LoginPage = () => {
    return (
        <section className="login">
            <h1>Softball Stats Pro</h1>
            <form>
                <label htmlFor="team-name">Team Name</label>
                <input id="team-name" type="text" required/>
                <label htmlFor="team-password">Password</label>
                <input id="team-password" type="password" required/>
                <button type="submit">Sign In</button>
            </form>
        </section>
    );
};

export default LoginPage;