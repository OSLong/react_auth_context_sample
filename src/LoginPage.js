import React from "react"
import { useAuthContext } from "./AuthContext"

function LoginPage(props) {

    const { login, isLoadingLogin, isLogin } = useAuthContext()

    const [username , setUsername] = React.useState("")
    return (
        <div>
            <h1>Login Page</h1>

            <input value={username} onChange={evt => setUsername(evt.target.value)} />
            {
                isLoadingLogin ?
                    <h1>Login Loading ...</h1> :
                    <button onClick={() => login(username)}>Login</button>
            }

        </div>
    )
}

export default LoginPage