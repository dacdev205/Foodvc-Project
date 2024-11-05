import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../ultis/LoadingSpinner";
import usePayment from "../../hooks/usePayment";
import FormattedPrice from "../../ultis/FormatedPriece";
import { CiDiscount1, CiLocationOn } from "react-icons/ci";
import { AiOutlineClose } from "react-icons/ai";
import useCart from "../../hooks/useCart";
import orderAPI from "../../api/orderAPI";
import useAddress from "../../hooks/useAddress";
import useUserCurrent from "../../hooks/useUserCurrent";
import VoucherModal from "../../components/Voucher/VoucherModal";
import AddressForm from "../../components/Address/AddressForm";
import SelectAddress from "../../components/Address/SelectAddress";
import ghnAPI from "../../api/ghnAPI";
import axios from "axios";
import voucherAPI from "../../api/voucherAPI";
import useAuth from "../../hooks/useAuth";
import { AuthContext } from "../../context/AuthProvider";
import cartAPI from "../../api/cartAPI";
import { useNavigate } from "react-router-dom";
import PaymentMethodModal from "../../components/PaymentMethod";
import { Bounce, toast } from "react-toastify";

const Payment = () => {
  const [payment, refetch, isLoading] = usePayment();
  const userData = useUserCurrent();
  const [orderTotal, setOrderTotal] = useState(0);
  const [subOrderTotal, setSubOrderTotal] = useState(0);
  const [cart, refetchCart] = useCart();
  const [address] = useAddress();
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const { user } = useAuth(AuthContext);
  const PF = "http://localhost:3000";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shopData, setShopData] = useState();
  const [note, setNote] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isVoucherApplied, setIsVoucherApplied] = useState(false);
  const [discountedAmount, setDiscountedAmount] = useState(0);
  const GHN_TOKEN = import.meta.env.VITE_GHN_TOKEN;
  const getToken = () => localStorage.getItem("access-token");
  const token = getToken();
  const navigate = useNavigate();
  const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] =
    useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [paymentMethodSelected, setPaymentMethodSelected] = useState(false);
  const [amount, setAmount] = useState(0);
  const [addressUser, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: { cityId: null, cityName: "" },
    district: { districtId: null, districtName: "" },
    ward: { wardCode: "", wardName: "" },
  });
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const res = await ghnAPI.getAddressFOODVC();
        setShopData(res.data.shops[0]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchShopData();
  }, []);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const methods = await axios.get(
          "http://localhost:3000/method-deli/all_methods"
        );
        setPaymentMethods(methods.data);
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };

    fetchPaymentMethods();
  }, []);
  const handleOpenPaymentMethodModal = () => {
    setIsPaymentMethodModalOpen(true);
  };

  const handleClosePaymentMethodModal = () => {
    setIsPaymentMethodModalOpen(false);
  };

  const handleSelectPaymentMethod = (method) => {
    setSelectedPaymentMethod(method);
    setPaymentMethodSelected(true);
    localStorage.setItem("selectedPaymentMethod", JSON.stringify(method));
    handleClosePaymentMethodModal();
  };
  useEffect(() => {
    const savedPaymentMethod = localStorage.getItem("selectedPaymentMethod");
    if (savedPaymentMethod) {
      setSelectedPaymentMethod(JSON.parse(savedPaymentMethod));
      setPaymentMethodSelected(true);
    }
  }, []);
  useEffect(() => {
    const fetchVoucherData = async () => {
      payment.forEach((item) => {
        item.products.forEach(async (product) => {
          const shopId = product.productId.shopId;
          const res = await voucherAPI.getAllVoucher(shopId);
          setVouchers(res);
        });
      });
    };
    fetchVoucherData();
  }, [payment]);
  useEffect(() => {
    let total = 0;
    payment.forEach((item) => {
      item.products.forEach((product) => {
        const totalPrice = product.productId.price * product.quantity;
        total += totalPrice;
      });
    });
    setSubOrderTotal(total);
  }, [payment]);

  useEffect(() => {
    let total = 0;
    if (isVoucherApplied) {
      const newAmount = discountedAmount + shippingFee;
      setAmount(newAmount);
      setOrderTotal(newAmount);
    } else {
      payment.forEach((item) => {
        item.products.forEach((product) => {
          const totalPrice = product.productId.price * product.quantity;
          total += totalPrice;
        });
      });
      total += shippingFee;

      if (userData && userData?.rank.user_discount) {
        const discountAmount = (total * userData?.rank.user_discount) / 100;
        total -= discountAmount;
      }
      setAmount(total);
      setOrderTotal(total);
    }
  }, [
    payment,
    shippingFee,
    discountedAmount,
    vouchers,
    isVoucherApplied,
    userData,
  ]);

  const calculatePrice = (item) => {
    const totalPrice = item.productId.price * item.quantity;
    return parseFloat(totalPrice.toFixed(2));
  };
  const applyVoucher = (voucherCode) => {
    setSelectedVoucher(voucherCode);
    payment.forEach(async (item) => {
      const res = await axios.post(
        "http://localhost:3000/vouchers/apply",
        {
          voucherCode: voucherCode.code,
          paymentId: item._id,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setDiscountedAmount(res.data.discountedAmount);
    });
    setIsVoucherApplied(true);
    setIsVoucherModalOpen(!isVoucherModalOpen);
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

  const sendEmailToUser = async (email, orderId) => {
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
  function getPickShifts() {
    let currentHour = new Date().getHours();
    if (currentHour < 12) {
      return [1];
    } else if (currentHour < 18) {
      return [2];
    } else {
      return [3];
    }
  }
  const extractProductData = (payment) => {
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

  const handleBuyItem = async () => {
    try {
      if (!selectedPaymentMethod) {
        toast.error("Vui lòng chọn hình thức thanh toán trước khi đặt hàng!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
        return;
      }
      if (selectedPaymentMethod.methodId === 1) {
        await handleCODPayment();
      } else if (selectedPaymentMethod.methodId === 2) {
        await handleVNPayPayment();
      } else {
        console.error("Chưa chọn phương thức thanh toán!");
        return;
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi trong quá trình thanh toán:", error);
    }
  };
  const handleVNPayPayment = async () => {
    const randomId = generateRandomString(20);
    const productData = extractProductData(payment);
    const productsWithShopId = payment.flatMap((item) =>
      item.products.map((product) => ({
        ...product,
        shopId: product.productId.shopId,
      }))
    );
    setIsSubmitting(true);
    try {
      const res = await axios.post("http://localhost:3000/method-deli/vn_pay", {
        amount: amount,
        bankCode: "VNPAY",
        language: "vn",
      });
      localStorage.setItem(
        "orderData",
        JSON.stringify({
          userId: userData._id,
          products: productsWithShopId,
          totalAmount: amount,
          orderCode: randomId,
          note: note,
          addressId: addressUser._id,
          methodId: selectedPaymentMethod,
        })
      );
      localStorage.setItem(
        "orderDataPostGHN",
        JSON.stringify({
          payment_type_id: 2,
          note: note,
          required_note: "CHOXEMHANGKHONGTHU",
          return_phone: `${shopData.phone}`,
          return_address: `${shopData.address}`,
          return_district_id: `${shopData.district_id}`,
          return_ward_code: "",
          client_order_code: randomId,
          from_name: `${shopData.name}`,
          from_phone: `${shopData.phone}`,
          from_address: `${shopData.address}`,
          from_ward_name: "Xuân Khánh",
          from_district_name: "Ninh Kiều",
          from_province_name: "Cần Thơ",
          to_name: addressUser.fullName,
          to_phone: addressUser.phone,
          to_address: `${addressUser?.street}, ${addressUser?.ward.wardName}, ${addressUser?.district.districtName}, ${addressUser?.city.cityName}`,
          to_ward_name: addressUser?.ward.wardName,
          to_district_name: addressUser?.district.districtName,
          to_province_name: addressUser?.city.cityName,
          cod_amount: subOrderTotal,
          content: note,
          weight: productData.totalWeight,
          length: productData.totalLength,
          width: productData.totalWidth,
          height: productData.totalHeight,
          cod_failed_amount: 0,
          pick_station_id: 1444,
          deliver_station_id: null,
          insurance_value: Math.min(orderTotal, 5000000),
          service_id: 0,
          service_type_id: 2,
          coupon: null,
          pickup_time: Math.floor(Date.now() / 1000),
          pick_shift: getPickShifts(),
          items: payment.flatMap((item) =>
            item.products.map((product) => ({
              name: product.productId.name,
              quantity: product.quantity,
              price: parseInt(product.productId.price),
            }))
          ),
        })
      );
      window.location.href = res.data.paymentUrl;
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCODPayment = async () => {
    const randomId = generateRandomString(20);
    const productData = extractProductData(payment);
    const productsWithShopId = payment.flatMap((item) =>
      item.products.map((product) => ({
        ...product,
        shopId: product.productId.shopId,
      }))
    );
    setIsSubmitting(true);
    const payload = {
      payment_type_id: 2,
      note: note,
      required_note: "CHOXEMHANGKHONGTHU",
      return_phone: `${shopData.phone}`,
      return_address: `${shopData.address}`,
      return_district_id: `${shopData.district_id}`,
      return_ward_code: "",
      client_order_code: randomId,
      from_name: `${shopData.name}`,
      from_phone: `${shopData.phone}`,
      from_address: `${shopData.address}`,
      from_ward_name: "Xuân Khánh",
      from_district_name: "Ninh Kiều",
      from_province_name: "Cần Thơ",
      to_name: addressUser.fullName,
      to_phone: addressUser.phone,
      to_address: `${addressUser?.street}, ${addressUser?.ward.wardName}, ${addressUser?.district.districtName}, ${addressUser?.city.cityName}`,
      to_ward_name: addressUser?.ward.wardName,
      to_district_name: addressUser?.district.districtName,
      to_province_name: addressUser?.city.cityName,
      cod_amount: subOrderTotal,
      content: note,
      weight: productData.totalWeight,
      length: productData.totalLength,
      width: productData.totalWidth,
      height: productData.totalHeight,
      cod_failed_amount: 0,
      pick_station_id: 1444,
      deliver_station_id: null,
      insurance_value: Math.min(orderTotal, 5000000),
      service_id: 0,
      service_type_id: 2,
      coupon: null,
      pickup_time: Math.floor(Date.now() / 1000),
      pick_shift: getPickShifts(),
      items: payment.flatMap((item) =>
        item.products.map((product) => ({
          name: product.productId.name,
          quantity: product.quantity,
          price: parseInt(product.productId.price),
        }))
      ),
    };
    const createOrderGhn = await ghnAPI.createOrder(payload);
    if (!createOrderGhn.status === 200) {
      console.error("Lỗi tạo đơn hàng GHN:", createOrderGhn.message);
      return;
    } else {
      try {
        for (const item of payment) {
          await orderAPI.postProductToOrder({
            userId: userData._id,
            products: productsWithShopId,
            totalAmount: amount,
            note: note,
            orderCode: randomId,
            addressId: addressUser._id,
            methodId: selectedPaymentMethod,
          });
          await Promise.all(
            item.products.map(async (product) => {
              await cartAPI.deleteProduct(cart._id, product.productId._id);
            })
          );
          refetchCart();
        }
        await sendEmailToUser(user.email, randomId);
        window.location.href = "/order-success";
      } catch (error) {
        if (error.response && error.response.status === 403) {
          alert(
            "Bạn đã hủy đơn hàng quá nhiều, chúng tôi đã hạn chế tính năng đặt hàng. Vui lòng liên hệ để hỗ trợ."
          );
          navigate("/");
        } else {
          console.error("Lỗi khi xử lý mua hàng:", error);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    const productData = extractProductData(payment);
    const calculateShippingFee = async () => {
      if (
        addressUser.city.cityId &&
        addressUser.district.districtId &&
        addressUser.ward.wardCode
      ) {
        const items = payment.forEach((item) =>
          item.products.map((product) => ({
            name: product.productId.name,
            quantity: product.quantity,
            height: product.productId.height,
            length: product.productId.length,
            width: product.productId.width,
            weight: product.productId.weight,
          }))
        );
        try {
          const response = await axios.post(
            "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
            {
              service_type_id: 2,
              from_district_id: shopData?.district_id,
              to_district_id: addressUser.district.districtId,
              to_ward_code: addressUser.ward.wardCode,
              height: productData.totalHeight,
              length: productData.totalLength,
              weight: productData.totalWeight,
              width: productData.totalWidth,
              items: items,
            },
            {
              headers: {
                Token: GHN_TOKEN,
                ShopId: shopData?._id,
                "Content-Type": "application/json",
              },
            }
          );
          setShippingFee(response.data.data.total);
        } catch (error) {
          console.error("Error fetching shipping fee:", error);
        }
      }
    };

    calculateShippingFee();
  }, [addressUser, shopData, payment, GHN_TOKEN]);

  const handleRemoveVoucher = () => {
    setSelectedVoucher(null);
    setIsVoucherApplied(false);
    setDiscountedAmount(0);
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
  if (!userData || !userData._id) {
    return null;
  }

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
        {isSubmitting && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
            <LoadingSpinner />
          </div>
        )}
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
                    <p className="text-lg font-bold text-black">
                      {addressUser.fullName} {addressUser.phone}{" "}
                    </p>
                  </div>
                  <div className="mr-3">
                    <p className="text-black">
                      {addressUser?.street && `${addressUser.street}, `}
                      {addressUser.ward.wardName &&
                        `${addressUser.ward.wardName}, `}
                      {addressUser.district.districtName &&
                        `${addressUser.district.districtName}, `}
                      {addressUser.city.cityName &&
                        `${addressUser.city.cityName}`}
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
                      <tr className="border-style">
                        <th>Sản phẩm</th>
                        <th>Giá</th>
                        <th className="text-center">Số lượng</th>
                        <th>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* row 1 */}
                      {item.products.map((product, index) => (
                        <tr
                          key={index}
                          className="text-black border border-green"
                        >
                          <td>
                            <div className="flex items-center">
                              <div className="avatar p-3">
                                <div className="mask mask-squircle w-12 h-12">
                                  <img
                                    src={PF + "/" + product.productId.image}
                                    alt="product"
                                  />
                                </div>
                              </div>
                              <span className="p-2">
                                {product.productId.name.slice(0, 50)}...
                              </span>
                            </div>
                          </td>
                          <td>
                            <FormattedPrice price={product.productId.price} />
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
                    userId={userData._id}
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
                    className="border input input-bordered"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>
              <div className="md:w-2/3 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CiDiscount1></CiDiscount1>Voucher của Shop:
                  </div>
                  {selectedVoucher && (
                    <div className="flex items-center mt-2 p-2 border text-white rounded bg-green">
                      <p className="mr-2">{selectedVoucher.code}</p>
                      <button
                        onClick={handleRemoveVoucher}
                        className="text-white"
                      >
                        <AiOutlineClose />
                      </button>
                    </div>
                  )}
                  <button
                    className="text-sky-500"
                    onClick={() => setIsVoucherModalOpen(true)}
                  >
                    Chọn Voucher
                  </button>
                  <VoucherModal
                    isOpen={isVoucherModalOpen}
                    onClose={() => setIsVoucherModalOpen(false)}
                    vouchers={vouchers}
                    applyVoucher={applyVoucher}
                  />
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
                {selectedVoucher && (
                  <div className="flex items-center justify-between">
                    <div>
                      <span>Sau khi áp mã: </span>
                    </div>

                    <FormattedPrice price={discountedAmount.toFixed(2)} />
                  </div>
                )}

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
                  <div className="flex justify-between">
                    <span>Giảm giá hạng thành viên: </span>
                    <span>{userData?.rank.user_discount}%</span>
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
                  <span className="text-lg">Phương thức thanh toán: </span>
                </div>
              </div>
              <div className="md:w-1/3 space-y-3">
                <div className="flex items-center justify-between">
                  {selectedPaymentMethod && (
                    <div className="my-5">
                      <p>{selectedPaymentMethod.name}</p>
                    </div>
                  )}
                  <button
                    className="text-blue-400"
                    onClick={handleOpenPaymentMethodModal}
                  >
                    {paymentMethodSelected ? "THAY ĐỔI" : "THIẾT LẬP"}
                  </button>
                </div>
                <PaymentMethodModal
                  isOpen={isPaymentMethodModalOpen}
                  onClose={handleClosePaymentMethodModal}
                  paymentMethods={paymentMethods}
                  onSelectMethod={handleSelectPaymentMethod}
                />
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
                <div className="">
                  <div className="flex justify-between">
                    <span>Giảm giá hạng thành viên: </span>
                    <span>{userData?.rank.user_discount}%</span>
                  </div>
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
                  className="btn bg-green text-white hover:bg-green hover:opacity-80 px-5 w-full border-style"
                  onClick={handleBuyItem}
                  disabled={isSubmitting}
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
