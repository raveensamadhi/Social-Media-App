import React, { useEffect, useState } from "react";
import { IconContext } from "react-icons";

import { BsPersonCircle } from "react-icons/bs";

import SettingsPopup from "./SettingsPopup/SettingsPopup";
import CreatePost from "./CreatePost/CreatePost";

import { AiOutlinePlusCircle } from "react-icons/ai";

import { CurrentUserData } from "../../utils/currentUserData";

export default function Header() {
  const userData = CurrentUserData();

  const [settingspopup, setSettingsPopup] = useState(false);
  const [createPostPopup, setCreatePostPopup] = useState(false);

  const [userId, setUserId] = useState();
  const [fullname, setFullName] = useState();
  const [avatar, setAvatar] = useState();

  const handleProfileIconClick = () => {
    setSettingsPopup((current) => !current);
  };

  const handleCreatePost = () => {
    setCreatePostPopup((current) => !current);
  };

  const setCloseCreatePost = (event) => {
    setCreatePostPopup(event);
  };

  useEffect(() => {
    if (userData !== undefined) {
      setUserId(userData.id);
      setFullName(userData.fullname);
      setAvatar(userData.avatar);
    }
  }, [userData]);

  return (
    <>
      <div className="header bg-gray-600 p-4 fixed w-full border-b-indigo-500 z-[99]">
        <div className="header__links flex flex-row justify-between items-center">
          <div className="text-2xl font-bold cursor-pointer">S</div>
          <button
            className="header__links--createpost"
            onClick={handleCreatePost}
          >
            <IconContext.Provider
              value={{
                style: {
                  color: "rgb(255,255,255)",
                  width: "27px",
                  height: "27px",
                },
              }}
            >
              <AiOutlinePlusCircle />
            </IconContext.Provider>
          </button>
          <button
            className="header__links--profileicon"
            onClick={handleProfileIconClick}
          >
            <IconContext.Provider
              value={{
                style: {
                  color: "rgb(255,255,255)",
                  width: "25px",
                  height: "25px",
                },
              }}
            >
              <BsPersonCircle />
            </IconContext.Provider>
          </button>
        </div>
        {createPostPopup && (
          <CreatePost
            data={{ userId, fullname, avatar }}
            setCloseCreatePost={setCloseCreatePost}
          />
        )}
        {settingspopup && <SettingsPopup data={{ fullname, avatar }} />}
      </div>
    </>
  );
}
