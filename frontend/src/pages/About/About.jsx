import React, { useState } from "react";

const About = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ name, email, message });
    // Reset fields
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="max-w-screen-2xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6">
        Giới Thiệu Về Chúng Tôi
      </h1>

      <div className="bg-white p-6 rounded-sm shadow-lg mb-6">
        <p className="text-xl text-justify mb-4">
          Chào mừng bạn đến với{" "}
          <span className="bg-green rounded-md text-white">FOODVC</span>- nơi
          chúng tôi mang đến cho bạn những sản phẩm rau củ và trái cây tươi ngon
          nhất. Với sứ mệnh kết nối người tiêu dùng với nguồn thực phẩm sạch và
          an toàn, chúng tôi tự hào cung cấp các sản phẩm chất lượng cao, được
          chọn lọc từ những nông trại uy tín trong nước.
        </p>

        <h2 className="text-3xl font-semibold mb-4">Tại Sao Chọn Chúng Tôi?</h2>
        <ul className="list-disc list-inside text-lg mb-4">
          <li>🌱 Sản phẩm tươi ngon, an toàn cho sức khỏe.</li>
          <li>🚜 Hỗ trợ nông dân địa phương và phát triển bền vững.</li>
          <li>🛒 Dịch vụ giao hàng nhanh chóng và tiện lợi.</li>
          <li>
            💚 Đội ngũ chăm sóc khách hàng nhiệt tình, sẵn sàng hỗ trợ bạn.
          </li>
        </ul>

        <h2 className="text-3xl font-semibold mb-4">Chúng Tôi Cam Kết</h2>
        <p className="text-xl text-justify mb-4">
          Chúng tôi cam kết cung cấp những sản phẩm tốt nhất đến tay bạn, với
          quy trình kiểm soát chất lượng nghiêm ngặt. Đặt hàng dễ dàng, nhanh
          chóng và an toàn với [Tên Cửa Hàng].
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-4">Liên Hệ Với Chúng Tôi</h2>
        <p className="text-xl mb-4">
          Nếu bạn có bất kỳ câu hỏi nào, xin vui lòng điền vào biểu mẫu dưới
          đây:
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Họ và Tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green"
            required
          />
          <textarea
            placeholder="Tin nhắn của bạn"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green"
            rows="4"
            required
          />
          <button
            type="submit"
            className="w-full bg-green px-6 py-3 font-semibold text-white rounded-md hover:bg-green-dark transition duration-300"
          >
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
};

export default About;
