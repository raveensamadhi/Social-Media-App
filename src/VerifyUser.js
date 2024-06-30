import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./FireBaseConfig";

export default function VerifyLoggedIn() {
  const [currentuser, setCurrentuser] = useState();

  useEffect(() => {
    const cuser = onAuthStateChanged(auth, user => {
      setCurrentuser(user);
    })
    return cuser;
  }, []);

  return currentuser;

}
