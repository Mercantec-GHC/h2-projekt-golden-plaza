import React from 'react'
import { Link } from "react-router-dom";

function Home() {
    return (
        <>
            <div>HomePage</div>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Log In</Link>
        </>
    )
}

export default Home
