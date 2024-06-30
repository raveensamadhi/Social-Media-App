import React, { useEffect, useState } from "react";

import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../../FireBaseConfig";

export default function Home() {
  const [status, setStatus] = useState();

  useEffect(() => {
    const getPosts = async () => {
      const q = query(collection(db, "posts"), orderBy("statusDate", "desc"));

      // eslint-disable-next-line
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const posts = querySnapshot.docs.map((doc) => ({
          docid: doc.id,
          ...doc.data(),
        }));

        // Get an array of unique user IDs from all posts
        const userIds = [...new Set(posts.map((post) => post.id))];

        // // Fetch documents of those users only
        const userPromises = userIds.map((userId) =>
          getDoc(doc(db, "users", userId))
        );

        const userDocs = await Promise.all(userPromises);

        // Record<string, UserDocumenData>
        const users = userDocs.reduce((acc, userDoc) => {
          acc[userDoc.id] = userDoc.data();
          return acc;
        }, {});

        let posts_arr = [];

        posts.forEach((item) => {
          posts_arr.push(
            <div
              className="home__posts--post bg-slate-500 py-5 mb-8 rounded-xl"
              key={item.docid}
            >
              <div className="home__posts--post-user flex items-center px-5 pb-5">
                <img
                  src={users[item.id].avatar}
                  alt={users[item.id].fullname}
                  className="w-[50px] h-[50px] rounded-full cursor-pointer"
                />
                <div className="ml-5">
                  <p className="text-lg font-bold cursor-pointer">
                    {users[item.id].fullname}
                  </p>
                </div>
              </div>
              <div className="px-5">{item.status}</div>
              {item.statusImage && (
                <div className="pt-5">
                  <img src={item.statusImage} alt={users[item.id].fullname} />
                </div>
              )}
            </div>
          );
        });

        setStatus(posts_arr);
      });
    };

    getPosts();
  }, []);

  return (
    <div className="home p-4 max-w-screen-sm mx-auto">
      <div className="home__posts flex flex-col ">{status}</div>
    </div>
  );
}
