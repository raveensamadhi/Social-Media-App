import React, { useEffect } from "react";
import { getAdditionalUserInfo, signInWithPopup } from "firebase/auth";
import { auth, provider, db } from "../../FireBaseConfig";
import { useNavigate } from "react-router-dom";

import { IconContext } from "react-icons";
import { FcGoogle } from 'react-icons/fc';

import VerifyLoggedIn from "../../VerifyUser";

import { collection, getDocs, doc, query, where, serverTimestamp, setDoc } from "firebase/firestore";

import './Login.scss';

export default function Login() {
  const currentUser = VerifyLoggedIn();
  const navigate = useNavigate();

  const userRef = collection(db, "users");

  useEffect(() => {
    if (currentUser) {
      navigate("/home");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  if (currentUser === undefined) return null;

  const handleOnClick = () => {
    signInWithPopup(auth, provider).then(async (result) => {
      const user = result.user;

      const { isNewUser } = getAdditionalUserInfo(result);

      if (isNewUser) {
        await addUser(user.uid);
      }

      const queryCreatedUser = query(userRef, where("id", "==", user.uid), where("createUser", "==", true));

      const queryCreatedUserSnapshot = await getDocs(queryCreatedUser);

      if (queryCreatedUserSnapshot.empty === true) {
        navigate("/create-user");
      } else {
        navigate("/home");
      }

    }).catch(error => {
      console.log(error);
    });
  }

  const addUser = async (userID) => {
    const userRef = doc(db, "users", userID);
    return await setDoc(userRef, {
      id: userID,
      username: "",
      fullname: "",
      avatar: "",
      createUser: false,
      created_at: serverTimestamp(),
    });
  }

  return <div className="login flex justify-center items-center">
    <div className="login__google flex cursor-pointer flex-col w-72 md:w-80 h-72 md:h-80 items-center justify-center bg-white rounded-md" onClick={handleOnClick}>
      <h1 className="text-2xl mb-[10px]" >Sign Up Using Google</h1>
      <IconContext.Provider value={{ style: { height: '100px', width: '100px' } }} >
        <FcGoogle />
      </IconContext.Provider>
    </div>
  </div>
}
