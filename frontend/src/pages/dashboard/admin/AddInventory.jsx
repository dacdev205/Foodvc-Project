import React from "react";
import { FaUtensils } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import inventoryAPI from "../../../api/inventoryAPI";
import QuillEditor from "../../../components/QuillEditor";

const AddInventory = () => {
  const { register, handleSubmit, setValue, reset } = useForm({
    mode: "onChange",
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
      await inventoryAPI.addProduct(formData);
      reset();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Food added to the menu.",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.log("Add menu failed", error);
    }
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
              <span className="label-text text-black">Tên sản phẩm*</span>
            </label>
            <input
              type="text"
              {...register("name", { required: true })}
              placeholder="VD: Gà ủ muối"
              className="input input-bordered w-full text-black"
            />
          </div>

          <div className="flex gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label- text-black">Loại sản phẩm*</span>
              </label>
              <select
                {...register("category", { required: true })}
                className="select select-bordered w-full"
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
                <span className="label-text text-black">Giá*</span>
              </label>
              <input
                type="number"
                {...register("price", { required: true })}
                placeholder="VD: 200000"
                className="input input-bordered w-full text-black "
              />
            </div>

            <div className="form-control w-1/2">
              <label className="label">
                <span className="label-text text-black">Số lượng*</span>
              </label>
              <input
                type="number"
                {...register("quantity", { required: true })}
                placeholder="VD: 1"
                className="input input-bordered w-full text-black"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-black">Thương hiệu</span>
              </label>
              <input
                type="text"
                {...register("brand")}
                placeholder="VD: CÔNG TY TNHH EMIVEST FEEDMILL VIỆT NAM"
                className="input input-bordered w-full text-black"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-black">Nơi sản xuất</span>
              </label>
              <input
                type="text"
                {...register("productionLocation")}
                placeholder="VD: Việt Nam"
                className="input input-bordered w-full text-black"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-black">Hướng dẫn sử dụng</span>
              </label>
              <input
                {...register("instructions")}
                placeholder="VD: Để với nhiệt độ dưới 20 độ C"
                className="input input-bordered w-full text-black"
                type="text"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-black">Thông tin sản phẩm</span>
            </label>
            <QuillEditor
              defaultValue=""
              onChange={(value) => setValue("recipe", value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-black">Hình ảnh sản phẩm*</span>
            </label>
            <input
              {...register("image", { required: true })}
              type="file"
              className="file-input"
            />
          </div>

          <button className="btn bg-green text-white px-6">
            Nhập kho <FaUtensils />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddInventory;
