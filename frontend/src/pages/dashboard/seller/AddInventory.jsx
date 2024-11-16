import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import React, { useEffect, useState } from "react";
import { FaUtensils } from "react-icons/fa";
import { useForm } from "react-hook-form";
import inventoryAPI from "../../../api/inventoryAPI";
import QuillEditor from "../../../ultis/QuillEditor";
import { Bounce, toast } from "react-toastify";
import categoryAPI from "../../../api/categoryAPI";
import useUserCurrent from "../../../hooks/useUserCurrent";
import PrintWarehouseReceipl from "../../../components/Modal/PrintWarehouseReceipt";
const AddInventory = () => {
  const { register, handleSubmit, setValue, reset } = useForm({
    mode: "onChange",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastProductData, setLastProductData] = useState(null);

  const [photo, setPhoto] = useState(null);
  const [categories, setCategories] = useState([]);
  const userData = useUserCurrent();
  const shopId = userData?.shops[0];
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryAPI.getAllCategory();
        setCategories(data.categories);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("category", data.category);
      formData.append("quantity", data.quantity);
      formData.append("price", parseFloat(data.price));
      formData.append("recipe", data.recipe);
      formData.append("height", data.height);
      formData.append("weight", data.weight);
      formData.append("length", data.length);
      formData.append("width", data.width);
      formData.append("brand", data.brand);
      formData.append("shopId", shopId);
      formData.append("productionLocation", data.productionLocation);
      formData.append("instructions", data.instructions);
      if (photo) {
        formData.append("image", photo);
      }
      const res = await inventoryAPI.addProduct(formData);
      setLastProductData(res.product);
      reset();
      setPhoto(null);
      toast.success("Nhập kho thành công!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Nhập kho thành công!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };
  const handlePrint = () => {
    const content = `
      <html>
        <head>
          <title>Phiếu nhập kho</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-50">
          <div class="relative flex items-center justify-center min-h-screen">
            <!-- Background logo -->
            <div class="absolute inset-0 flex items-center justify-center opacity-10">
              <img src="/images/logo.jpg" alt="Logo" class="w-1/3" />
            </div>
            <!-- Content -->
            <div class="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
              <h1 class="text-2xl font-bold text-center mb-4">Phiếu nhập kho</h1>
              <p class="text-lg text-center mb-6">Thông tin sản phẩm</p>
              <!-- Product Table -->
              <table class="table-auto w-full mb-6">
                <thead>
                  <tr>
                    <th class="px-4 py-2 border text-left">Tên sản phẩm</th>
                    <th class="px-4 py-2 border text-left">Số lượng</th>
                    <th class="px-4 py-2 border text-left">Giá</th>
                    <th class="px-4 py-2 border text-left">Kích thước (Dài x Rộng x Cao)</th>
                    <th class="px-4 py-2 border text-left">Thương hiệu</th>
                    <th class="px-4 py-2 border text-left">Nơi sản xuất</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="px-4 py-2 border">${lastProductData?.name}</td>
                    <td class="px-4 py-2 border">${
                      lastProductData?.quantity
                    }</td>
                    <td class="px-4 py-2 border">${lastProductData?.price.toLocaleString()} VNĐ</td>
                    <td class="px-4 py-2 border">${lastProductData?.length} x ${
      lastProductData?.width
    } x ${lastProductData?.height}</td>
                    <td class="px-4 py-2 border">${lastProductData?.brand}</td>
                    <td class="px-4 py-2 border">${
                      lastProductData?.productionLocation
                    }</td>
                  </tr>
                </tbody>
              </table>
              <div class="mb-4">
                <p class="text-lg"><strong>Hướng dẫn sử dụng:</strong> ${
                  lastProductData?.instructions
                }</p>
                <p class="text-lg"><strong>Ngày nhập kho:</strong> ${new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();

    setIsModalOpen(false);
  };

  const handlePhotoChange = (event) => {
    setPhoto(event.target.files[0]);
  };
  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4 text-black">
        Thêm sản phẩm mới vào <span className="text-green">kho</span>
      </h2>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-black">
                Tên sản phẩm(<span className="text-red">*</span>):
              </span>
            </label>
            <input
              type="text"
              {...register("name", { required: true })}
              placeholder="VD: Gà ủ muối"
              className="input input-bordered w-full text-black input-sm"
            />
          </div>

          <div className="flex gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label- text-black">
                  Loại sản phẩm(<span className="text-red">*</span>):
                </span>
              </label>
              <select
                {...register("category", { required: true })}
                className="select select-bordered w-full select-sm"
              >
                <option value="">Chọn loại sản phẩm</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control w-1/2">
              <label className="label">
                <span className="label-text text-black">
                  Giá(<span className="text-red">*</span>):
                </span>
              </label>
              <input
                type="number"
                {...register("price", { required: true })}
                placeholder="VD: 200000"
                className="input input-bordered w-full text-black border-2 border-rose-500 input-sm"
              />
            </div>

            <div className="form-control w-1/2">
              <label className="label">
                <span className="label-text text-black">
                  Số lượng (<span className="text-red">*</span>):
                </span>
              </label>
              <input
                type="number"
                {...register("quantity", { required: true })}
                placeholder="VD: 1"
                className="input input-bordered w-full text-black input-sm"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-black">Thương hiệu: </span>
              </label>
              <input
                type="text"
                {...register("brand")}
                placeholder="VD: CÔNG TY TNHH EMIVEST FEEDMILL VIỆT NAM"
                className="input input-bordered w-full text-black input-sm"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-black">Nơi sản xuất: </span>
              </label>
              <input
                type="text"
                {...register("productionLocation")}
                placeholder="VD: Việt Nam"
                className="input input-bordered w-full text-black input-sm"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-black">
                  Hướng dẫn sử dụng:{" "}
                </span>
              </label>
              <input
                {...register("instructions")}
                placeholder="VD: Để với nhiệt độ dưới 20 độ C"
                className="input input-bordered w-full text-black input-sm"
                type="text"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-black">Độ dài: </span>
              </label>
              <input
                type="text"
                {...register("length")}
                placeholder="VD: 5"
                className="input input-bordered w-full text-black input-sm"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-black">Cân nặng: </span>
              </label>
              <input
                type="text"
                {...register("weight")}
                placeholder="VD: 2"
                className="input input-bordered w-full text-black input-sm"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-black">Độ cao: </span>
              </label>
              <input
                {...register("height")}
                placeholder="VD: 6"
                className="input input-bordered w-full text-black input-sm"
                type="text"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-black">Độ rộng: </span>
              </label>
              <input
                {...register("width")}
                placeholder="VD: 6"
                className="input input-bordered w-full text-black input-sm"
                type="text"
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-black">
                Thông tin sản phẩm:{" "}
              </span>
            </label>
            <QuillEditor
              defaultValue=""
              onChange={(value) => setValue("recipe", value)}
            />
          </div>

          <div className="form-control w-40 mb-3">
            <label className="label">
              <span className="label-text text-black">
                Hình ảnh sản phẩm(<span className="text-red">*</span>):
              </span>
            </label>
            {photo && <img src={URL.createObjectURL(photo)} alt="" />}
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{
                backgroundColor: "#4caf50",
                color: "white",
                "&:hover": {
                  backgroundColor: "#388e3c",
                },
                borderRadius: "5px",
                padding: "10px 20px",
                marginRight: "10px",
                textTransform: "none",
              }}
            >
              Chọn ảnh
              <VisuallyHiddenInput
                type="file"
                {...register("image")}
                onChange={handlePhotoChange}
              />
            </Button>
          </div>

          <button className="btn bg-green text-white px-6 border-none hover:bg-green hover:opacity-80">
            Nhập kho <FaUtensils />
          </button>
        </form>
        <PrintWarehouseReceipl
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handlePrint}
        />
      </div>
    </div>
  );
};

export default AddInventory;
