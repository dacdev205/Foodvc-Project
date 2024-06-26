import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaUtensils } from "react-icons/fa";
import inventoryAPI from "../../../api/inventoryAPI";
import menuAPI from "../../../api/menuAPI";
import React, { useEffect, useState } from "react";
import QuillEditor from "../../../ultis/QuillEditor";
import productsAPI from "../../../api/productsAPI";
import SuccessAlert from "../../../ultis/SuccessAlert";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material";
const UpdateItem = () => {
  const { register, handleSubmit, setValue } = useForm({ mode: "onChange" });
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const { reset } = useForm();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const successMessage = "Chỉnh sửa thành công!";
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await inventoryAPI.getProductById(id);
        setProduct(response);
      } catch (error) {
        console.error("Error fetching product detail:", error);
      }
    };

    fetchProductDetail();
  }, [id]);
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
      formData.append("image", data.image[0]);
      formData.append("brand", data.brand);
      formData.append("productionLocation", data.productionLocation);
      formData.append("instructions", data.instructions);

      await productsAPI.updateProduct(product._id, formData);
      setShowSuccessAlert(true);
      const updatedProduct = await productsAPI.getProductById(product._id);
      const menuUpdateData = {
        name: updatedProduct.name,
        category: updatedProduct.category,
        price: updatedProduct.price,
        recipe: updatedProduct.recipe,
        image: updatedProduct.image,
        brand: updatedProduct.brand,
        productionLocation: updatedProduct.productionLocation,
        instructions: updatedProduct.instructions,
      };

      const productOnMenu = await menuAPI.getProductById(product._id);

      if (productOnMenu === null) {
        return;
      } else {
        await menuAPI.updateProduct(product._id, menuUpdateData);
      }
    } catch (error) {
      console.log("Update menu failed", error);
    }
    reset();
  };

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4 text-black">
        Chỉnh sửa chi tiết <span className="text-green">sản phẩm</span>
      </h2>
      <SuccessAlert show={showSuccessAlert} message={successMessage} />

      {product && (
        // <div>
        //   <form onSubmit={handleSubmit(onSubmit)}>
        //     <div className="form-control w-full">
        //       <label className="label">
        //         <span className="label-text text-black">Tên sản phẩm</span>
        //       </label>
        //       <input
        //         type="text"
        //         defaultValue={product.name}
        //         {...register("name", { required: true })}
        //         placeholder="Recipe Name"
        //         className="input input-bordered w-full text-black input-sm"
        //       />
        //     </div>

        //     <div className="flex items-center gap-4">
        //       {/* categories */}
        //       <div className="form-control w-full">
        //         <label className="label">
        //           <span className="label-text text-black">Loại:</span>
        //         </label>
        //         <select
        //           {...register("category", { required: true })}
        //           className="select select-bordered select-sm"
        //           defaultValue={product.category}
        //         >
        //           <option value="vegetable">RAU CỦ, NẤM, TRÁI CÂY</option>
        //           <option value="protein">THỊT, CÁ, TRỨNG, HẢI SẢN</option>
        //           <option value="soup">MÌ, MIẾN, CHÁO, PHỞ</option>
        //           <option value="milk">SỮA CÁC LOẠI</option>
        //           <option value="drinks">BIA, NƯỚC GIẢI KHÁT</option>
        //           <option value="popular">NỔI BẬT</option>
        //         </select>
        //       </div>

        //       {/* prices */}
        //       <div className="form-control w-50">
        //         <label className="label">
        //           <span className="label-text text-black">Giá:</span>
        //         </label>
        //         <input
        //           type="number"
        //           defaultValue={product.price}
        //           {...register("price", { required: true })}
        //           placeholder="Price"
        //           className="input input-bordered w-full text-black input-sm"
        //         />
        //       </div>
        //       {/* quantity */}
        //       <div className="form-control w-50">
        //         <label className="label">
        //           <span className="label-text text-black">Số lượng:</span>
        //         </label>
        //         <input
        //           type="number"
        //           defaultValue={product.quantity}
        //           {...register("quantity", { required: true })}
        //           placeholder="Quantity"
        //           className="input input-bordered w-full text-black input-sm"
        //         />
        //       </div>
        //     </div>
        //     <div className="form-control">
        //       <label className="label">
        //         <span className="label-text text-black">
        //           Chi tiết sản phẩm:
        //         </span>
        //       </label>
        //       <QuillEditor
        //         defaultValue={product.recipe}
        //         onChange={(value) => setValue("recipe", value)}
        //       />
        //     </div>

        //     <div className="form-control w-full">
        //       <label className="label">
        //         <span className="label-text text-black">Thương hiệu:</span>
        //       </label>
        //       <input
        //         type="text"
        //         defaultValue={product.brand}
        //         {...register("brand")}
        //         placeholder="Brand"
        //         className="input input-bordered w-full text-black input-sm"
        //       />
        //     </div>

        //     <div className="form-control w-full">
        //       <label className="label">
        //         <span className="label-text text-black">Nơi sản xuất:</span>
        //       </label>
        //       <input
        //         type="text"
        //         defaultValue={product.productionLocation}
        //         {...register("productionLocation")}
        //         placeholder="Production Location"
        //         className="input input-bordered w-full text-black input-sm"
        //       />
        //     </div>

        //     <div className="form-contro w-full">
        //       <label className="label">
        //         <span className="label-text text-black">Bảo quản:</span>
        //       </label>
        //       <input
        //         defaultValue={product.instructions}
        //         {...register("instructions")}
        //         placeholder="Instructions"
        //         type="text"
        //         className="w-full text-black input-sm input"
        //       />
        //     </div>

        //     <div className="w-full my-2">
        //       <input
        //         {...register("image")}
        //         type="file"
        //         className="file-input w-full max-w-xs"
        //       />
        //     </div>

        //     <button className="btn bg-green text-white px-6 hover:bg-green hover:opacity-80 border-none">
        //       Chỉnh sửa sản phẩm <FaUtensils />
        //     </button>
        //   </form>
        // </div>
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
                defaultValue={product.name}
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
                  defaultValue={product.category}
                >
                  <option value="">Chọn loại sản phẩm</option>
                  <option value="protein">THỊT, CÁ, TRỨNG, HẢI SẢN</option>
                  <option value="milk">SỮA CÁC LOẠI</option>
                  <option value="soup">MÌ, MIẾN, CHÁO, PHỞ</option>
                  <option value="vegetable">RAU CỦ, NẤM, TRÁI CÂY</option>
                  <option value="drinks">BIA, NƯỚC GIẢI KHÁT</option>
                  <option value="popular">NỔI BẬT</option>
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
                  defaultValue={product.price}
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
                  defaultValue={product.quantity}
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
                  defaultValue={product.brand}
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
                  defaultValue={product.productionLocation}
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
                  defaultValue={product.instructions}
                  placeholder="VD: Để với nhiệt độ dưới 20 độ C"
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
                defaultValue={product.recipe}
                onChange={(value) => setValue("recipe", value)}
              />
            </div>

            <div className="form-control w-40 mb-3">
              <label className="label">
                <span className="label-text text-black">
                  Hình ảnh sản phẩm(<span className="text-red">*</span>):
                </span>
              </label>
              <input
                {...register("image")}
                type="file"
                className="file-input w-full max-w-xs"
              />
            </div>

            <button className="btn bg-green text-white px-6 border-none hover:bg-green hover:opacity-80">
              Nhập kho <FaUtensils />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateItem;
