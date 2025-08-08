import { authService } from "../services/auth.service.remote.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { userService } from "../services/user.service.remote.js"

const { useState } = React
const { useNavigate } = ReactRouter

export function LoginSignup({ setLoggedinUser }) {


    const [isSignUp, setIsSignUp] = useState(false)
    const [credentials, setCredentials] = useState(userService.getEmptyCredentials())
    
    const navigate = useNavigate()

    function handleChange({ target }) {
        const { name: field, value } = target
        setCredentials(prevCred => ({ ...prevCred, [field]: value }))
    }

        function handleSubmit(ev) {
        ev.preventDefault()
        isSignUp ? signup(credentials) : login(credentials)
    }


    function login() {
        authService.login(credentials)
            .then(user => {
                setLoggedinUser(user)
                showSuccessMsg('Logged in successfully')
                navigate('/')
            })
            .catch(err => {
                console.log('err', err);
                showErrorMsg(`Couldn't login...`)
            })
    }

    function signup() {
        authService.signup(credentials)
            .then(user => {
                setLoggedinUser(user)
                showSuccessMsg(` Signed up with success`)
                navigate('/')
            })
            .catch(err => {
                console.log('err', err);
                showErrorMsg(` Couldn't signup property`)
            })

    }

    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    value={credentials.username}
                    placeholder="Username"
                    onChange={handleChange}
                    required
                    autoFocus
                />
                <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    autoComplete="off"
                />
                {isSignUp && <input
                    type="text"
                    name="fullname"
                    value={credentials.fullname}
                    placeholder="Full name"
                    onChange={handleChange}
                    required
                />}
                <button>{isSignUp ? 'Signup' : 'Login'}</button>
            </form>

            <div className="btns">
                <a href="#" onClick={() => setIsSignUp(!isSignUp)}>
                    {isSignUp ?
                        'Already a member? Login' :
                        'New user? Signup here'
                    }
                </a >
            </div>
        </div >
    )
}