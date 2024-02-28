import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaUtensils } from "react-icons/fa";
import inventoryAPI from "../../../api/inventoryAPI";
import menuAPI from "../../../api/menuAPI";
import React, { useEffect, useState } from "react";
import QuillEditor from "../../../components/QuillEditor";

const UpdateMenu = () => {
  const { register, handleSubmit, setValue } = useForm({ mode: "onChange" });
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const { reset } = useForm();

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

      // Update product in the inventory
      await inventoryAPI.updateProduct(product._id, formData);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Food updated on the menu.",
        showConfirmButton: false,
        timer: 1000,
      });
      // Update product on the menu
      const updatedProduct = await inventoryAPI.getProductById(product._id);
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
        // Update the product on the menu
        await menuAPI.updateProduct(product._id, menuUpdateData);
      }

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Food updated on the menu.",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.log("Update menu failed", error);
    }
    reset();
  };

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4">
        Chỉnh sửa chi tiết <span className="text-green">sản phẩm</span>
      </h2>

      {product && (
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* ... other form controls ... */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Recipe Name*</span>
              </label>
              <input
                type="text"
                defaultValue={product.name}
                {...register("name", { required: true })}
                placeholder="Recipe Name"
                className="input input-bordered w-full "
              />
            </div>

            {/* 2nd row */}
            <div className="flex items-center gap-4">
              {/* categories */}
              <div className="form-control w-full my-6">
                <label className="label">
                  <span className="label-text">Category*</span>
                </label>
                <select
                  {...register("category", { required: true })}
                  className="select select-bordered"
                  defaultValue={product.category}
                >
                  <option disabled value="default">
                    Select a category
                  </option>
                  <option value="vegetable">RAU CỦ, NẤM, TRÁI CÂY</option>
                  <option value="protein">THỊT, CÁ, TRỨNG, HẢI SẢN</option>
                  <option value="soup">MÌ, MIẾN, CHÁO, PHỞ</option>
                  <option value="milk">SỮA CÁC LOẠI</option>
                  <option value="drinks">BIA, NƯỚC GIẢI KHÁT</option>
                  <option value="popular">Popular</option>
                </select>
              </div>

              {/* prices */}
              <div className="form-control w-50">
                <label className="label">
                  <span className="label-text">Price*</span>
                </label>
                <input
                  type="number"
                  defaultValue={product.price}
                  {...register("price", { required: true })}
                  placeholder="Price"
                  className="input input-bordered w-full"
                />
              </div>
              {/* quantity */}
              <div className="form-control w-50">
                <label className="label">
                  <span className="label-text">Quantity*</span>
                </label>
                <input
                  type="number"
                  defaultValue={product.quantity}
                  {...register("quantity", { required: true })}
                  placeholder="Quantity"
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            {/* 3rd row - Use QuillEditor component */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Recipe Details</span>
              </label>
              <QuillEditor
                defaultValue={product.recipe}
                onChange={(value) => setValue("recipe", value)}
              />
            </div>

            {/* 4th row */}
            <div className="form-control w-full my-6">
              <label className="label">
                <span className="label-text">Brand</span>
              </label>
              <input
                type="text"
                defaultValue={product.brand}
                {...register("brand")}
                placeholder="Brand"
                className="input input-bordered w-full"
              />
            </div>

            {/* 5th row */}
            <div className="form-control w-full my-6">
              <label className="label">
                <span className="label-text">Production Location</span>
              </label>
              <input
                type="text"
                defaultValue={product.productionLocation}
                {...register("productionLocation")}
                placeholder="Production Location"
                className="input input-bordered w-full"
              />
            </div>

            {/* 6th row */}
            <div className="form-contro w-full">
              <label className="label">
                <span className="label-text">Instructions</span>
              </label>
              <input
                defaultValue={product.instructions}
                {...register("instructions")}
                placeholder="Instructions"
                className="textarea textarea-bordered w-full"
              />
            </div>

            {/* 7th row */}
            <div className="w-full my-6">
              <input
                {...register("image")}
                type="file"
                className="file-input w-full max-w-xs"
              />
            </div>

            <button className="btn bg-green text-white px-6">
              Update Item <FaUtensils />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateMenu;
