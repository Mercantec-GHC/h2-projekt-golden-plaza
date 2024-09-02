import { Link } from "react-router-dom";

function Home() {
    const token = localStorage.getItem("token");

    return (
        <>
            <div>HomePage</div>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Log In</Link>

            {token ? (
                <p>Logged in</p>
            ) : (
                <p>Not logged in</p>
            )}
        </>
    )
}

export default Home
