import React, { useState } from "react";

import getAvatar from "../../images/img_avatar.png";

import { db } from "../../FireBaseConfig";

import {
  collection,
  getDocs,
  doc,
  query,
  where,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import { useNavigate } from "react-router-dom";

import VerifyLoggedIn from "../../VerifyUser";

export default function CreateUser({ setPreloader }) {
  const currentUser = VerifyLoggedIn();
  const navigate = useNavigate();

  const userRef = collection(db, "users");

  const [avatar, setAvatar] = useState(getAvatar);
  const [unameAvailable, setUnameAvailable] = useState(false);
  const [filename, setFileName] = useState();
  const [createSuccess, setCreateSuccess] = useState(false);

  if (currentUser === undefined) return null;

  const name = currentUser.displayName;

  const handleUsername = async (event) => {
    setUnameAvailable(false);
    const userName = event.target.value;

    const q = query(userRef, where("username", "==", userName));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      if (doc.id) {
        setUnameAvailable((unamestate) => !unamestate);
      }
    });
  };

  const handleFileUpload = (event) => {
    setFileName(event.target.files[0]);
    setAvatar(URL.createObjectURL(event.target.files[0]));
  };

  const handleCreateUserSubmit = (event) => {
    event.preventDefault();
    setPreloader(true);
    if (!filename) {
      alert("Choose an Image");
    }

    const storage = getStorage();

    const metadata = {
      contentType: filename.type,
    };

    const avatarRef = ref(
      storage,
      `/avatars/${currentUser.uid}/${filename.name}`
    );
    const uploadTask = uploadBytesResumable(avatarRef, filename, metadata);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const updateUserID = currentUser.uid;

          try {
            updateUser(
              updateUserID,
              downloadURL,
              event.target.fullname.value,
              event.target.username.value,
              serverTimestamp()
            );
            setCreateSuccess(true);
            window.scrollTo(0, 0);
            setPreloader(false);
            setTimeout(() => {
              navigate("/home");
            }, 5000);
          } catch (err) {
            console.log(err);
          }
        });
      }
    );
  };

  const updateUser = async (userID, avaterURL, fullname, username) => {
    const userReference = doc(db, "users", userID);

    return await updateDoc(userReference, {
      avatar: avaterURL,
      createUser: true,
      fullname: fullname,
      username: username,
      created_at: serverTimestamp(),
    });
  };

  return (
    <div className="createuser p-5 flex justify-center items-center relative">
      {createSuccess && (
        <div className="absolute py-3 px-5 bg-green-500 w-72 md:w-80 mx-auto top-2 rounded-md shadow-black">
          Perfectly Done. Redirecting to home in 5 Seconds
        </div>
      )}
      <form onSubmit={handleCreateUserSubmit}>
        <div className="createuser__avatar">
          <div
            className="avatar rounded-full w-40 h-40 mx-auto mb-5"
            style={{
              backgroundImage: `url(${avatar})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          ></div>
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            onChange={handleFileUpload}
          />
        </div>
        <div className="createuser__username mt-3">
          <label className="block">
            <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block">
              Username
            </span>
            <input
              type="text"
              name="username"
              onKeyUp={handleUsername}
              className={`text-black mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1 peer ${
                unameAvailable
                  ? "focus:!border-red-600 focus:!ring-red-600"
                  : ""
              } `}
              placeholder="johndoe"
            />
            {unameAvailable && (
              <p className="mt-2 text-white text-sm">
                Username is already taken.
              </p>
            )}
          </label>
        </div>
        <div className="createuser__fullname mt-3">
          <label className="block">
            <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block">
              Full Name
            </span>
            <input
              defaultValue={name}
              type="text"
              name="fullname"
              className="text-black mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
              placeholder="John Doe"
            />
          </label>
        </div>
        <button
          className={`px-4 py-2 mt-5 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm ${
            unameAvailable && "disabled"
          } `}
        >
          Update
        </button>
      </form>
    </div>
  );
}
