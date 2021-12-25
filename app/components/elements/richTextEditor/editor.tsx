import { modules } from "app/constants/constants";
import React from "react";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { Delta } from "quill";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";

interface Props {
  value: Delta;
  onChange: any;
}

const Editor = ({ value, onChange }: Props) => {
  return (
    <div>
      <ReactQuill
        theme="snow"
        modules={modules}
        onChange={(value, delta, user, editor) => {
          onChange(editor.getContents());
        }}
        defaultValue={value}
        placeholder={"Write a thorough description of the gig"}
      />
    </div>
  );
};

export default Editor;
