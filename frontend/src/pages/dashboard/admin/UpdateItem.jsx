import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaUtensils } from "react-icons/fa";
import inventoryAPI from "../../../api/inventoryAPI";
import menuAPI from "../../../api/menuAPI";
import React, { useEffect, useState } from "react";
import QuillEditor from "../../../ultis/QuillEditor";
import productsAPI from "../../../api/productsAPI";
import categoryAPI from "../../../api/categoryAPI";
import { Bounce, toast } from "react-toastify";
const UpdateItem = () => {
  const { register, handleSubmit, setValue } = useForm({ mode: "onChange" });
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const { id } = useParams();
  const { reset } = useForm();
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await inventoryAPI.getProductById(id);
        console.log(response);

        setProduct(response);
      } catch (error) {
        console.error("Error fetching product detail:", error);
      }
    };
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAllCategory();
        setCategories(response.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchProductDetail();
    fetchCategories();
  }, [id]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("category", data.category);
      formData.append("quantity", data.quantity);
      formData.append("price", parseFloat(data.price));
      formData.append("recipe", data.recipe);
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }
      formData.append("brand", data.brand);
      formData.append("productionLocation", data.productionLocation);
      formData.append("instructions", data.instructions);
      formData.append("weight", data.weight);
      formData.append("length", data.length);
      formData.append("width", data.width);
      formData.append("height", data.height);

      await productsAPI.updateProduct(product._id, formData);

      const updatedProduct = await inventoryAPI.getProductById(product._id);
      setProduct(updatedProduct);

      toast.success("Cập nhật thành công!", {
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

      const menuUpdateData = {
        name: updatedProduct.name,
        category: updatedProduct.category,
        price: updatedProduct.price,
        recipe: updatedProduct.recipe,
        image: updatedProduct.image,
        brand: updatedProduct.brand,
        height: updatedProduct.height,
        weight: updatedProduct.weight,
        length: updatedProduct.length,
        width: updatedProduct.width,
        expirationDate: updatedProduct.expirationDate,
        createdAt: updatedProduct.createdAt,
        productionLocation: updatedProduct.productionLocation,
        instructions: updatedProduct.instructions,
      };

      const productOnMenu = await menuAPI.getProductById(product._id);

      if (productOnMenu) {
        await menuAPI.updateProduct(product._id, menuUpdateData);
      }
    } catch (error) {
      console.error("Update failed", error);
    }
    reset();
  };
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        category: product.category._id,
        quantity: product.quantity,
        price: product.price,
        brand: product.brand,
        productionLocation: product.productionLocation,
        instructions: product.instructions,
        weight: product.weight,
        length: product.length,
        width: product.width,
        height: product.height,
        recipe: product.recipe,
      });
    }
  }, [product, reset]);

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4 text-black">
        Chỉnh sửa chi tiết <span className="text-green">sản phẩm</span>
      </h2>

      {product && (
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
                  <span className="label-text text-black">Danh mục:</span>
                </label>
                <select
                  {...register("category")}
                  defaultValue={product?.category?._id}
                  className="select select-bordered w-full text-black select-sm"
                >
                  <option value="" disabled>
                    Chọn danh mục
                  </option>
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
            <div className="flex gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-black">Độ dài: </span>
                </label>
                <input
                  type="text"
                  {...register("length")}
                  defaultValue={product.length}
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
                  defaultValue={product.weight}
                  placeholder="VD: 2"
                  className="input input-bordered w-full text-black input-sm"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-black">Độ cao: </span>
                </label>
                <input
                  defaultValue={product.height}
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
                  type="text"
                  {...register("width")}
                  defaultValue={product.width}
                  placeholder="VD: 5"
                  className="input input-bordered w-full text-black input-sm"
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
              Cập nhật <FaUtensils />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateItem;
