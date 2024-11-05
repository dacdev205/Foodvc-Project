import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { toast, Bounce } from "react-toastify";
import categoryAPI from "../../../api/categoryAPI";
import { FaUtensils } from "react-icons/fa";

const EditCategory = () => {
  const { id } = useParams();
  const { register, handleSubmit, setValue, reset } = useForm();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchCategoryDetail = async () => {
      try {
        const response = await categoryAPI.getCategoryById(id);
        setCategory(response);
      } catch (error) {
        console.error("Error fetching category detail:", error);
      }
    };
    fetchCategoryDetail();
  }, [id]);

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description,
      });
    }
  }, [category, reset]);

  const onSubmit = async (data) => {
    try {
      await categoryAPI.updateCategory(id, data);
      toast.success("Cập nhật danh mục thành công!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
    } catch (error) {
      console.error("Cập nhật thất bại", error);
    }
  };

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4 text-black">
        Chỉnh sửa <span className="text-green">Danh mục</span>
      </h2>

      {category && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-black">
                Tên danh mục (<span className="text-red">*</span>):
              </span>
            </label>
            <input
              type="text"
              {...register("name", { required: true })}
              placeholder="VD: Đồ uống"
              className="input input-bordered w-full text-black input-sm"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-black">Mô tả:</span>
            </label>
            <textarea
              {...register("description")}
              placeholder="VD: Các loại đồ uống tươi ngon"
              className="textarea textarea-bordered w-full text-black textarea-sm"
            ></textarea>
          </div>

          <button className="btn bg-green text-white px-6 border-none hover:bg-green hover:opacity-80 mt-4">
            Cập nhật <FaUtensils />
          </button>
        </form>
      )}
    </div>
  );
};

export default EditCategory;
