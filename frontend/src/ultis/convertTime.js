export const convertLeadtimeToNormalTime = (leadtime) => {
  const leadtimeDate = new Date(leadtime * 1000);

  const formattedDate = leadtimeDate.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: false,
  });

  return formattedDate;
};
