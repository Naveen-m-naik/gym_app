import React from 'react';
import ReactDOM from 'react-dom/client';
import Landing from './Gym/Landing';
import Trainer from './login/trainer';
import Client from './login/client';
import GymForm from './login/newaccount';
import Trainer_log from './login/trainerlogin';
import UserForm from './login/client_information';
import Gym_avl from './client_gym_info/client_gym';
import Client_1 from './login/client1';
import Rough from './Gym/rough';
import Forgot from './login/forgot';
import Home from './client_dash/client_main';
import QrScan from './client_dash/client_qr';
import GymQR from './Gym/commonqr';
import Sidebar from './Trainer_dash/trainer_main';
import MyAttendance from './client_dash/attendece_view';
import SendEmail from './payment/send_mail';
import PaymentButton from './client_dash/payment';
import TrainerAttendanceView from './Trainer_dash/attendence';
import UserList from './Trainer_dash/total_std';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import './style/App.css'; // Make sure global CSS is imported

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    {/* Global background */}
    {/* <div className="global-bg"></div> */}

    <BrowserRouter>
      <Routes>
        <Route path='/Gym/rough' element={<Rough/>} />
        <Route path='/' element={<Landing/>} />
        <Route path="/login/trainer" element={<Trainer />} />
        <Route path="/login/client" element={<Client />} />
        <Route path='/login/newaccount' element={<GymForm/>} />
        <Route path='/login/trainerlogin' element={<Trainer_log/>} />
        <Route path='/login/client_information' element={<UserForm/>} />
        <Route path='/client_gym_info/client_gym' element={<Gym_avl/>} />
        <Route path='/login/client1' element={<Client_1/>} />
        <Route path='/login/forgot' element={<Forgot/>} />
        <Route path='/client_dash/client_main' element={<Home/>} />
        <Route path='/client_dash/client_qr' element={<QrScan/>}/>
        <Route path='/Gym/commonqr' element={<GymQR/>}/>
        <Route path='/Trainer_dash/trainer_main' element={<Sidebar/>}/>
        <Route path='/client_dash/attendence_view' element={<MyAttendance/>}/>
        <Route path='/payment/send_mail' element={<SendEmail/>}/>
        <Route path='/client_dash/payment' element={<PaymentButton/>}/>
        <Route path="/Trainer_dash/attendence" element={<TrainerAttendanceView/>}/>
        <Route path='/Trainer_dash/total_std' element={<UserList/>}/>
      </Routes>
    </BrowserRouter>
  </>
);
