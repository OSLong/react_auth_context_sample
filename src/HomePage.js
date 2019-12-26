import React from "react"
import { withAuthCheck } from "./AuthContext"

class HomePage extends React.Component {
    render() {
        const { auth } = this.props
        const { logout, authUser } = auth
        console.log("render class", auth )

        return (
            <div>
                <h1>Home Page</h1>
                <h1>Welcome : {authUser.username}</h1>
                <button onClick={logout}>Logout</button>
            </div>
        )
    }
}


// Wrap HomePage in withAuthCheck  
// so  it will check login
export default withAuthCheck(
    HomePage
)