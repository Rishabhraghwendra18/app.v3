import { Button } from "@mui/material";
import { useGig } from "pages/gig/[id]";
import React from "react";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import { downloadImage } from "app/utils/moralis";
import dynamic from "next/dynamic";

interface Props {}

const ReadSubmission = (props: Props) => {
  const { submission } = useGig();
  return (
    <div>
      <div className="dark:text-grey-light mt-4">
        <span className="text-xl text-blue-bright w-1/2 my-4">Links</span>
        {submission &&
          submission.links?.map((link, idx) => {
            return (
              <li key={idx} className="flex flex-row text-base">
                <span className="mr-2">{link.name}</span>
                <a
                  className="hover:text-blue-bright transition transform duration-1000 underline"
                  href={link.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.link}
                </a>
              </li>
            );
          })}
        {submission?.submissionFile && (
          <div className="mt-4 flex flex-col">
            <span className="text-xl text-blue-bright w-1/2 my-1">Files</span>
            <div className="flex flex-row items-center">
              <span className="mr-2 text-base">
                <FilePresentIcon />
                {submission.submissionFilename}
              </span>
              <div className="w-1/6 mx-2">
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  sx={{ textTransform: "none" }}
                  endIcon={<FileDownloadIcon />}
                  onClick={() =>
                    downloadImage(
                      submission.submissionFile,
                      submission.submissionFilename
                    )
                  }
                >
                  {"Download File"}
                </Button>
              </div>
            </div>
          </div>
        )}
        {submission?.submissionText && (
          <div className="mt-4">
            <span className="text-xl text-blue-bright w-1/2 my-4">
              Comments
            </span>
            <ReactQuill
              value={submission?.submissionText}
              readOnly={true}
              theme={"bubble"}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadSubmission;
