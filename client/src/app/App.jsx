import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { setAccessToken } from '../shared/lib/axiosInstance';
import { AuthApi } from '../entities/AuthApi';
import NavBar from '../widgets/NavBar/NavBar';
import MainPage from '../pages/MainPage/MainPage';
import SignUpPage from '../pages/SignUpPage/SignUpPage';
import SignInPage from '../pages/SignInPage/SignInPage';
import SignOutPage from '../pages/SignOutPage/SignOutPage';
import UserAccountPage from '../pages/UserAccountPage/UserAccountPage';
import AllTasksPage from '../pages/AllTasksPage/AllTasksPage';
import UserTasksPage from '../pages/UserTasksPage/UserTasksPage';
import OneTaskPage from '../pages/OneTaskPage/OneTaskPage';

export default function App() {
  const [user, setUser] = useState(null);
  const [allTasks, setAllTasks] = useState([]);

  const handleSignOut = async () => {
    try {
      AuthApi.signOut();

      setUser(null);
      setAccessToken('');
    } catch (error) {
      console.log('Sign out failed', error);
    }
  };

  useEffect(() => {
    AuthApi.refreshTokens()
      .then((response) => {
        setUser(response.data.user);
        setAccessToken(response.data.accessToken);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  return (
    <>
      {/* <h1>Meow meow meow!!!!!!</h1> */}
      <BrowserRouter>
        <NavBar user={user} handleSignOut={handleSignOut} />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/signUp" element={<SignUpPage setUser={setUser} />} />
          <Route path="/signIn" element={<SignInPage setUser={setUser} />} />
          <Route path="/signOut" element={<SignOutPage setUser={setUser} />} />
          <Route path="/account/:userId" element={<UserAccountPage user={user} setUser={setUser} />} />
          <Route
            path="/allTasks"
            element={
              <AllTasksPage user={user} allTasks={allTasks} setAllTasks={setAllTasks} />
            }
          />
          <Route path="/userTasks" element={<UserTasksPage user={user} />} />
          <Route
            path="/task/:taskId"
            element={<OneTaskPage user={user} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
