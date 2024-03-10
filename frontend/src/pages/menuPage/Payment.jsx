import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import usePayment from "../../hooks/usePayment";
import FormattedPrice from "../../components/FormatedPriece";
import { CiDiscount1, CiLocationOn } from "react-icons/ci";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import orderAPI from "../../api/orderAPI";
import useAddress from "../../hooks/useAddress";
import AddressForm from "../../components/AddressForm";
import SelectAddress from "../../components/SelectAddress";

const Payment = () => {
  const [payment, refetch, isLoading] = usePayment();
  const [orderTotal, setOrderTotal] = useState(0);
  const [subOrderTotal, setSubOrderTotal] = useState(0);
  const [cart, refetchCart] = useCart();
  const [address, refetchAddress] = useAddress();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const { user } = useAuth();
  const PF = "http://localhost:3000";
  const shippingFee = 35000;
  const [addressUser, setAddress] = useState({
    street: "",
    city: "",
    district: "",
    ward: "",
    fullName: "",
    phone: "",
  });

  useEffect(() => {
    let total = 0;
    payment.forEach((item) => {
      item.products.forEach((product) => {
        const totalPrice = product.price * product.quantity;
        total += totalPrice;
      });
    });
    setSubOrderTotal(total);
  }, [payment]);

  useEffect(() => {
    let total = 0;
    payment.forEach((item) => {
      item.products.forEach((product) => {
        const totalPrice = product.price * product.quantity;
        total += totalPrice;
      });
    });
    total += shippingFee;
    setOrderTotal(total);
  }, [payment, shippingFee]);

  const calculatePrice = (item) => {
    const totalPrice = item.price * item.quantity;
    return parseFloat(totalPrice.toFixed(2));
  };

  function generateRandomString(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const randomId = generateRandomString(20);

  const handleBuyItem = async () => {
    try {
      payment.forEach(async (item) => {
        await orderAPI.postProductToOrder({
          userId: user.uid,
          email: user.email,
          products: item.products,
          totalAmount: orderTotal,
          orderCode: randomId,
          address: addressUser,
        });
        refetchCart();
      });
      alert("Đơn hàng đã được đặt thành công");
      window.location.href = "/";
    } catch (error) {
      console.error("Lỗi khi xử lý mua hàng:", error);
    }
  };
  useEffect(() => {
    address.forEach((addressDefault) => {
      if (addressDefault.isDefault) {
        setAddress(addressDefault);
      }
    });
  }, [address]);

  const handleSetAddress = (newAddress) => {
    setAddress(newAddress);
  };

  const handleSetAddressWithForm = (newAddress) => {
    setAddress(newAddress);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  } else {
    refetch();
    return (
      <div>
        <div className="section-container">
          <div className="max-w-screen-2xl container mx-auto px-4">
            <div className="py-24 flex flex-col items-center justify-center">
              {/* content */}
              <div className=" text-center px-4 space-y-7">
                <h2 className="md:text-3xl text-green text-2xl font-bold md:leading-snug leading-snug">
                  Thanh toán
                </h2>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 mb-3 ">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold mb-4 text-green flex items-center">
                  <CiLocationOn />
                  Địa chỉ nhận hàng
                </h3>
                {!address.length ? (
                  <button
                    onClick={() =>
                      document.getElementById("modal-address").showModal()
                    }
                  >
                    Thiết lập
                  </button>
                ) : (
                  <div className=" text-blue-500">
                    <button onClick={() => setAddressModalOpen(true)}>
                      Thay đổi
                    </button>
                  </div>
                )}
              </div>
              <div className="flex">
                <div className="flex">
                  <div className="mr-3">
                    <p className="text-lg font-bold">
                      {addressUser.fullName} {addressUser.phone}{" "}
                    </p>
                  </div>
                  <div className="mr-3">
                    <p>
                      {addressUser.street && `${addressUser.street}, `}
                      {addressUser.ward && `${addressUser.ward}, `}
                      {addressUser.district && `${addressUser.district}, `}
                      {addressUser.city && `${addressUser.city}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {payment.map((item, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg">
                <div className="overflow-x-auto">
                  <table className="table ">
                    {/* head */}
                    <thead className="bg-green text-white rounded-sm">
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Giá</th>
                        <th className="text-center">Số lượng</th>
                        <th>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* row 1 */}
                      {item.products.map((product, index) => (
                        <tr key={index} className="text-black">
                          <td>
                            <div className="flex items-center">
                              <div className="avatar p-3">
                                <div className="mask mask-squircle w-12 h-12">
                                  <img
                                    src={PF + "/" + product.image}
                                    alt="product"
                                  />
                                </div>
                              </div>
                              <span className="p-2">
                                {product.name.slice(0, 50)}...
                              </span>
                            </div>
                          </td>
                          <td>
                            <FormattedPrice price={product.price} />
                          </td>
                          <td className="text-center">
                            <div className="">{product.quantity}</div>
                          </td>
                          <td>
                            <FormattedPrice price={calculatePrice(product)} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div>
                  <AddressForm
                    paymentId={item._id}
                    setAddress={handleSetAddressWithForm}
                  />
                  <SelectAddress
                    paymentId={item._id}
                    addressModalOpen={addressModalOpen}
                    setAddressModalOpen={setAddressModalOpen}
                    handleSetAddress={handleSetAddress}
                  />
                </div>
              </div>
            ))}
            <div className="my-12 flex flex-col md:flex-row justify-between bg-white shadow-md rounded-lg p-6 text-black">
              <div className="md:w-1/2 space-y-3">
                <div className="flex items-center">
                  <span>Lời nhắn:</span>
                  <input
                    type="text"
                    placeholder="Lưu ý cho người bán..."
                    className="border input input-bordered "
                  />
                </div>
              </div>
              <div className="md:w-2/3 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CiDiscount1></CiDiscount1>Voucher của Shop
                  </div>
                  <button className="text-sky-500">Chọn Voucher</button>
                </div>
                <hr />

                <div className="flex items-center justify-between">
                  <div>
                    <span>Tổng tiền hàng: </span>
                  </div>
                  <FormattedPrice
                    className="text-green text-lg"
                    price={subOrderTotal.toFixed(2)}
                  />
                </div>
                <div className="">
                  <div className="flex justify-between">
                    <span>Phí vận chuyển: </span>
                    <FormattedPrice
                      className="text-green text-lg"
                      price={shippingFee}
                    />
                  </div>
                </div>
                <div className="">
                  <div className="flex justify-end">
                    <span>Tổng sô tiền({payment.length} sản phẩm): </span>
                    <span className="text-green font-bold">
                      <FormattedPrice price={orderTotal.toFixed(2)} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-12 flex flex-col md:flex-row justify-between bg-white shadow-md rounded-lg p-6 text-black">
              <div className="md:w-1/2 space-y-3">
                <div className="flex items-center">
                  <span className="text-lg">Phương thức thanh toán </span>
                </div>
              </div>
              <div className="md:w-1/3 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span>Thanh toán khi nhận hàng</span>
                  </div>
                  <button className="text-sky-500">THAY ĐỔI</button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span>Tổng tiền hàng:</span>
                  </div>
                  <FormattedPrice
                    className="text-green text-lg"
                    price={subOrderTotal.toFixed(2)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span>Phí vận chuyển:</span>
                  </div>
                  <FormattedPrice
                    className="text-green text-lg"
                    price={shippingFee}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span>Tổng thanh toán:</span>
                  </div>
                  <span className="text-green font-bold">
                    <FormattedPrice price={orderTotal.toFixed(2)} />
                  </span>
                </div>
                <button
                  className="btn bg-green text-white hover:bg-green hover:opacity-80 px-5 w-full"
                  onClick={handleBuyItem}
                >
                  Đặt hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Payment;
