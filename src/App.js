import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';

import PrivateRoutes from './PrivateRoutes';

import Login from './Components/Login/Login';

import Header from './Components/Header/Header';
import Spinner from './Components/Spinner/Spinner';
import CreateUser from './Components/CreateUser/CreateUser';
import Home from './Components/Home/Home';
import NotFound from './Components/NotFound/NotFound';

import VerifyLoggedIn from './VerifyUser';
import { useEffect, useState } from 'react';

function App() {
  const currentUser = VerifyLoggedIn()
  const location = useLocation();

  const locationPath = location.pathname;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (locationPath === '/') {
      document.body.classList.add('bg-blue-700');
      document.body.classList.add('text-black');
    } else {
      document.body.classList.add('bg-gray-700');
      document.body.classList.add('text-white');
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);

  }, [locationPath]);

  const setPreloader = (value) => {
    setLoading(value);
  }

  if (currentUser === undefined) return null;

  return (
    <div className={`App`}>
      {loading && <Spinner />}
      {currentUser && <Header />}
      <div className={`App__body ${currentUser ? 'pt-[65px]' : ''} `}>
        <Routes>
          <Route index element={<Login />} />
          <Route element={<PrivateRoutes />}>
            <Route path="home" element={<Home />} />
            <Route path="create-user" element={<CreateUser setPreloader={setPreloader} />} />
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
