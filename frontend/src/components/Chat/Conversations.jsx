/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import shopAPI from "../../api/shopAPI";
import userAPI from "../../api/userAPI";
import { CircularProgress } from "@mui/material";

export default function Conversation({
  conversation,
  currentUser,
  membersWithStatus,
}) {
  const [shop, setShop] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const PF = "http://localhost:3000";

  const friendId = conversation.members.find((m) => m !== currentUser._id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resShop = await shopAPI.getShop(friendId);
        setShop(resShop.shop);
      } catch (error) {
        console.log("Error fetching shop:", error);

        try {
          const resUser = await userAPI.getSingleUserById(friendId);
          setUser(resUser);
        } catch (userError) {
          console.log("Error fetching user:", userError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, conversation, friendId]);

  const isOnline = membersWithStatus.find(
    (member) => member.memberId === friendId
  )?.isOnline;

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <CircularProgress color="success" />
      </div>
    );
  }

  return (
    <div className="flex items-center mb-4 cursor-pointer ">
      <div className="w-10 h-10 mr-1 relative">
        <img
          src={
            shop
              ? `${PF}/${shop.shop_image}`
              : user?.photoURL || "https://via.placeholder.com/150"
          }
          alt="photoURL"
          className="w-full h-full rounded-full object-cover"
        />
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border border-white ${
            isOnline ? "bg-green" : "bg-red"
          }`}
        />
      </div>
      <div>
        {shop ? (
          <div>
            <p className="font-bold">{shop.shopName}</p>
            <p className="text-sm text-gray-500">
              {isOnline ? "Trực tuyến" : "Ngoại tuyến"}
            </p>
          </div>
        ) : (
          user && (
            <div>
              <p className="font-bold">{user.name}</p>
              <p className="text-sm text-gray-500">
                {isOnline ? "Trực tuyến" : "Ngoại tuyến"}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
