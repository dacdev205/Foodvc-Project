/* eslint-disable react/prop-types */
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const QuillEditor = ({ defaultValue, onChange }) => {
  return (
    <div className="text-black">
      <ReactQuill defaultValue={defaultValue} onChange={onChange} />
    </div>
  );
};

export default QuillEditor;
