import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../FireBaseConfig";
import { Navigate } from "react-router-dom";

export default function SignOut() {

  const handdleSignOut = (event) => {
    signOut(auth).then(() => {
      <Navigate to='/' />
    }).catch((error) => {
      console.log(error);
    })
  }

  return <div className="signut">
    <button onClick={handdleSignOut}>SignOut</button>
  </div>
}
