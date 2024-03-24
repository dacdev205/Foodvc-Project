/* eslint-disable react/prop-types */
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "../CssModule/ReactQuill.module.css";
const QuillEditor = ({ defaultValue, onChange }) => {
  return (
    <div className={styles.ql}>
      <ReactQuill defaultValue={defaultValue} onChange={onChange} />
    </div>
  );
};

export default QuillEditor;
