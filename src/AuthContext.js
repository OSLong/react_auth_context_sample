import React, { useState } from "react"
import { reject } from "q"
import LoginPage from "./LoginPage"

const AuthContext = React.createContext(undefined)

const Provider = AuthContext.Provider
const Consumer = AuthContext.Consumer

const MOCK_SERVICE = (shouldSuccess = true, delay = 1000) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            shouldSuccess ? resolve() : reject()
        }, delay)
    })
}

// Use With Function Component
export function useAuthContext() {
    return React.useContext(AuthContext)
}

// Use With Class Component and Check User Login
// Must Wrap it on Component
export const withAuthCheck = Component => props => {

    const { isLogin, fetch } = useAuthContext()

    // When First Load , We dont know User is valid or not
    // so if have token, fetch first
    if (isLogin === undefined) {
        fetch({username: "MOCK_USER_ON_FIRST_FETCH"})
        return (
            <div>
                <h1>Fetching User ...</h1>
            </div>
        )
    }
    // If Login is false , is when fetch failed or logout
    // show login page
    else if (isLogin === false) {
        return <LoginPage />
    }
    else {
        // Is Login return children below
    }

    // Render Child Component
    return (
        <Consumer>
            {(contextValue) => <Component auth={contextValue} {...props} />}
        </Consumer>
    )
}


export const AuthContextProvider = (props) => {
    const [isLogin, setIsLogin] = useState(undefined)
    const [user, setUser] = useState(undefined)
    const [isLoadingLogin, setIsLoadingLogin] = useState(false)

    // Use when for Logout
    const logoutAction = () => {
        setIsLogin(false)
        localStorage.removeItem('token')
    }

    // Use when fetch User failed
    const fetchUserFailedAction = () => {
        logoutAction()
    }

    // Use When Fetch User Success
    const fetchUserSuccessAction = (user) => {
        setUser(user)
        setIsLogin(true)
    }
    
    // Use for fetch
    const fetchUserAction = (MOCK_USER) => {
        const token = localStorage.getItem("token")
        return MOCK_SERVICE(true)
            .then((user) => {
                return fetchUserSuccessAction(MOCK_USER)
            })
            .catch(() => {
                return fetchUserFailedAction()
            })

    }

    const loginAction = (username ="user 1", password) => {
        setIsLoadingLogin(true)
        MOCK_SERVICE(true)
            .then((responseToken) => {
                const MOCK_TOKEN = "i am token from login"
                localStorage.setItem("token", responseToken)
                return fetchUserAction({username, password})
            })
            .catch(() => {
                fetchUserFailedAction()
            })
            .finally(() => {
                setIsLoadingLogin(false)
            })
    }

    // What is Pass to Context
    const contextProps = {
        isLogin,
        isLoadingLogin,
        login: loginAction,
        logout: logoutAction,
        fetch: fetchUserAction,
        authUser:user
    }

    return (
        <Provider value={contextProps}>
            {props.children}
        </Provider>
    )
}

export default AuthContext