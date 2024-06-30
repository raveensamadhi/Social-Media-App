import React, { useState } from "react";

import uploadimage from "../../../images/uploadstatus.svg";

import { IconContext } from "react-icons";
import { FaWindowClose } from "react-icons/fa";

import { db } from "../../../FireBaseConfig";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

function CreatePost({ data, setCloseCreatePost }) {
  const [statusimage, setStatusImage] = useState();
  const [statusimageprev, setStatusImagePrev] = useState();
  const [statusPosting, setStatusPosting] = useState(false);

  const statusUserID = data.userId;

  const handleStatusImgUpload = (event) => {
    setStatusImage(event.target.files[0]);
    setStatusImagePrev(URL.createObjectURL(event.target.files[0]));
  };

  const handleStatusImageClear = () => {
    setStatusImage(null);
    setStatusImagePrev(null);
  };

  const handleStatusOnSubmit = (event) => {
    event.preventDefault();

    if (statusimage || event.target.statustext.value) {
      if (statusimage) {
        const storage = getStorage();

        const metadata = {
          contentType: statusimage.type,
        };

        const imageRef = ref(
          storage,
          `/posts/${data.userId}/${statusimage.name}`
        );

        const uploadTask = uploadBytesResumable(
          imageRef,
          statusimage,
          metadata
        );

        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              try {
                addStatus(
                  statusUserID,
                  event.target.statustext.value,
                  downloadURL,
                  serverTimestamp()
                );
                setCloseCreatePost(false);
                window.scrollTo(0, 0);
                setStatusPosting((current) => !current);
              } catch (err) {
                console.log(err);
              }
            });
          }
        );
      } else {
        try {
          addStatus(
            statusUserID,
            event.target.statustext.value,
            "",
            serverTimestamp()
          );
          setCloseCreatePost(false);
          window.scrollTo(0, 0);
          setStatusPosting((current) => !current);
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      setStatusPosting((current) => !current);
    }
  };

  const addStatus = async (userID, status, statusImage) => {
    const statusReference = collection(db, "posts");

    return await addDoc(statusReference, {
      id: userID,
      status: status,
      statusImage: statusImage,
      statusDate: serverTimestamp(),
      likes: 0,
    });
  };

  return (
    <div className="createpost absolute w-full mx-auto md:w-[700px] h-[420px] overflow-y-auto bg-gray-500 p-5 top-[65px] left-0 right-0 rounded-md">
      <div className="createpost__heading text-center p-3 mb-3 border-b-2 border-gray-400">
        <div className="text-3xl font-bold">Create Post</div>
      </div>
      <div className="createpost__userinfo flex items-center mb-3">
        <img
          src={data.avatar}
          alt={data.fullname}
          className="w-[50px] h-[50px] rounded-full"
        />
        <div className="ml-5 overflow-hidden">
          <p className="text-lg font-bold">{data.fullname}</p>
        </div>
      </div>
      <div>
        <form onSubmit={handleStatusOnSubmit}>
          <div className="block">
            <textarea
              rows="4"
              name="statustext"
              className="w-full bg-gray-500 border-none text-2xl font-bold focus:border-none active:border-none focus:outline-none active:outline-none resize-none"
              placeholder={`What's In your mind, ${data.fullname}?`}
            ></textarea>
          </div>
          <div className="block mb-3">
            <label htmlFor="statusimage">
              <img src={uploadimage} alt="" className="w-[50px] h-[50px]" />
            </label>
            <input
              type={"file"}
              id="statusimage"
              name="statusimage"
              className="hidden"
              accept="image/*"
              onChange={handleStatusImgUpload}
            />
          </div>
          {statusimageprev && (
            <div className="mb-3 border-2 border-gray-400 rounded-lg p-1 relative">
              <span
                className="close-icon absolute right-4 top-4"
                onClick={handleStatusImageClear}
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
                  <FaWindowClose />
                </IconContext.Provider>
              </span>
              <img src={statusimageprev} alt="" className="mx-auto" />
            </div>
          )}
          <button
            className={`w-full bg-gray-400 p-2 rounded-lg ${
              statusPosting && "disabled:opacity-25"
            }`}
            disabled={statusPosting}
          >
            {statusPosting ? "Posting" : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
