/* eslint-disable react/prop-types */
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "../CssModule/ReactQuill.module.css";
const QuillEditor = ({ defaultValue, onChange }) => {
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["bold", "italic", "underline"],
      ["link"],
      ["image"],
    ],
  };
  return (
    <div className={styles.ql}>
      <ReactQuill
        modules={modules}
        defaultValue={defaultValue}
        onChange={onChange}
      />
    </div>
  );
};

export default QuillEditor;
