/* eslint-disable react/prop-types */
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const QuillEditor = ({ defaultValue, onChange }) => {
  return <ReactQuill defaultValue={defaultValue} onChange={onChange} />;
};

export default QuillEditor;
