import { authService } from "../services/auth.service.local.js"
import { showErrorMsg } from "../services/event-bus.service.js"

const { NavLink, Link, useNavigate } = ReactRouterDOM

export function AppHeader({loggedinUser, setLoggedinUser}) {
    
    const navigate = useNavigate()
    
    
   function onLogout() {
        authService.logout()
            .then(()=> {
                setLoggedinUser(null)
                navigate('/auth')
            })
            .catch(err => {
                console.log(err)
                showErrorMsg(`Couldn't logout`)
            })
    }
                    console.log("🚀 ~ AppHeader ~ loggedinUser:", loggedinUser)

    return <header className="app-header main-content single-row">
        <h1>Miss Bug</h1>
        <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/bug">Bugs</NavLink>
            <NavLink to="/about">About</NavLink>
            {!loggedinUser ?
                <NavLink to="/auth"> Login </NavLink> :

                <div className="logged-user">
                    <Link to={`/user/${loggedinUser.id}`}>{loggedinUser.fullname}</Link>
                    <button onClick={onLogout}>logout</button>
                </div>
            }
        </nav>
    </header>
}