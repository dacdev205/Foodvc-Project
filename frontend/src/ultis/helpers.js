import axios from "axios";

// helpers.js
export const generateRandomString = (length) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const extractProductData = (payment) => {
  let totalHeight = 0;
  let totalLength = 0;
  let totalWeight = 0;
  let totalWidth = 0;

  payment.forEach((item) => {
    item.products.forEach((product) => {
      const { height, length, weight, width } = product.productId;
      totalHeight += height;
      totalLength += length;
      totalWeight += weight;
      totalWidth += width;
    });
  });
  return {
    totalHeight,
    totalLength,
    totalWeight,
    totalWidth,
  };
};

export const calculatePrice = (item) => {
  const totalPrice = item.productId.price * item.quantity;
  return parseFloat(totalPrice.toFixed(2));
};

export const sendEmailToUser = async (email, orderId) => {
  try {
    await axios.post("http://localhost:3000/email", {
      email: email,
      subject: "Xác nhận đơn hàng từ FOODVC",
      html: `
          <html>
          <head>
            <style>
              @import url('https://unpkg.com/tailwindcss@^2.0/dist/tailwind.min.css');
            </style>
          </head>
          <body class="font-sans bg-gray-100">
            <div class="max-w-xl mx-auto p-8 bg-white rounded shadow">
              <h1 class="text-2xl font-bold text-center text-gray-800 mb-4">Xác nhận đơn hàng của bạn</h1>
              <h2 class="text-lg font-semibold text-gray-700 mb-2">Mã đơn hàng: ${orderId}</h2>
              <p class="text-gray-600 mb-2"><span class="font-semibold">Email:</span> ${email}</p>
              <p class="text-gray-600 mb-4">Cảm ơn bạn đã mua sắm tại FOODVC. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.</p>
            </div>
          </body>
          </html>
        `,
    });
  } catch (error) {
    console.error("Error sending email to:", email, error);
  }
};
