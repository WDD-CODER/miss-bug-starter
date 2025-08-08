const Router = ReactRouterDOM.BrowserRouter
const { Route, Routes } = ReactRouterDOM

import { UserMsg } from './cmps/UserMsg.jsx'
import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { Home } from './pages/Home.jsx'
import { BugIndex } from './pages/BugIndex.jsx'
import { BugDetails } from './pages/BugDetails.jsx'
import { AboutUs } from './pages/AboutUs.jsx'
import { authService } from './services/auth.service.remote.js'
import { LoginSignup } from './pages/LoginSignup.jsx'

const { useState } = React
// console.log("authService:", authService)

export function App() {
    const [loggedinUser, setLoggedinUser] = useState(authService.getLoggedinUser())


    return <Router>
        <div className="app-wrapper">
            <UserMsg />
            <AppHeader loggedinUser={loggedinUser} setLoggedinUser={setLoggedinUser}  />
            <main className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<LoginSignup setLoggedinUser={setLoggedinUser} />} />
                    <Route path="/bug" element={<BugIndex />} />
                    <Route path="/bug/:bugId" element={<BugDetails />} />
                    <Route path="/about" element={<AboutUs />} />
                </Routes>
            </main>
            <AppFooter />
        </div>
    </Router>
}
