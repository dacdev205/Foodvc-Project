/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import userAPI from "../../api/userAPI";

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const friendId = conversation.members.find((m) => m !== currentUser._id);
      try {
        const res = await userAPI.getSingleUserById(friendId);
        setUser(res);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [currentUser, conversation]);

  return (
    <div className="flex items-center mb-4 cursor-pointer">
      <div className="w-10 h-10 rounded-full bg-gray-400 mr-4"></div>
      <div>
        {user && (
          <>
            <p className="font-bold">{user.name}</p>
            <p className="text-gray-600">Online</p>
          </>
        )}
      </div>
    </div>
  );
}
