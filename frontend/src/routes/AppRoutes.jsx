import React from 'react'
import {BrowserRouter as Router,Routes,Route,Navigate} from 'react-router-dom'
import UserRegister from '../pages/auth/UserRegister';
import ChooseRegister from '../pages/auth/ChooseRegister';
import UserLogin from '../pages/auth/UserLogin';
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister';
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin';
import Home from '../pages/generale/Home';
import Saved from '../pages/generale/Saved';
import BottomNav from '../components/BottomNav';
import CreateFood from '../pages/create-food/CreateFood';
import Profile from '../pages/create-food/Profile';
const AppRoutes = () => {
  return (
    <Router>
        <Routes>
           <Route path="/register" element={<ChooseRegister />} />
                <Route path="/user/register" element={<UserRegister />} />
                <Route path="/user/login" element={<UserLogin />} />
                <Route path="/foodpartner/register" element={<FoodPartnerRegister />} />
                <Route path="/foodpartner/login" element={<FoodPartnerLogin />} />  
             <Route path="/"element={<><Home /><BottomNav /></>}/>
                <Route path="/saved" element={<><Saved /><BottomNav /></>} />
                <Route path='/createfood' element={<CreateFood />} />
                <Route path='/foodpartner/:id' element={<Profile />} />
        </Routes>
    </Router>
  )
}

export default AppRoutes
