import { useState, useEffect } from "react";

import { db, auth } from "../FireBaseConfig";

import { doc, getDoc } from "firebase/firestore";

export const CurrentUserData = () => {
  const [data, setData] = useState();

  const user = auth.currentUser;

  useEffect(() => {
    async function fetchUserData() {
      const docRef = doc(db, "users", user.uid);
      await getDoc(docRef)
        .then((res) => {
          setData(res.data());
        })
        .catch((err) => {
          console.log(err);
        });
    }

    fetchUserData();
  }, [user.uid]);

  if (data !== undefined) {
    return data;
  }
};
