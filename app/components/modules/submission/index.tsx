import { PrimaryButton } from "app/components/elements/buttons/primaryButton";
import { animationVariant } from "app/constants/constants";
import { useGlobal } from "app/context/globalContext";
import { motion } from "framer-motion";
import { useGig } from "pages/gig/[id]";
import ReadSubmission from "./readSubmission";
import SubmissionForm, { ISubmissionFormInput } from "./submissionForm";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FmdBadIcon from "@mui/icons-material/FmdBad";
import { ConfirmModal } from "./confirmModal";
import { useState } from "react";
import DisputeModal from "./disputeModal";
import { ConfirmViolationModal } from "./confirmViolation";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import RevisionModal from "./revisionModal";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import dynamic from "next/dynamic";

interface Props {}

const Submission = (props: Props) => {
  const {
    state: { userInfo },
  } = useGlobal();
  const { gig, contractGig, revisionInstructions, submissions } = useGig();
  const [isOpen, setIsOpen] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [confirmViolationOpen, setConfirmViolationOpen] = useState(false);
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  return (
    <motion.main
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={animationVariant}
    >
      {isOpen && (
        <ConfirmModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          values={{} as ISubmissionFormInput}
          confirmText1="Are you sure you want to accept this submission"
          confirmText2="Gig will be considered complete after this!"
          finishText1={`Work accepted and completed succesfully!`}
          finishText2={`${gig.reward} WMatic reward has been transferred to ${gig.proposal[0].freelancer}`}
          confirmType={2}
        />
      )}
      {disputeOpen && (
        <DisputeModal isOpen={disputeOpen} setIsOpen={setDisputeOpen} />
      )}
      {confirmViolationOpen && (
        <ConfirmViolationModal
          isOpen={confirmViolationOpen}
          setIsOpen={setConfirmViolationOpen}
        />
      )}
      {revisionModalOpen && (
        <RevisionModal
          isOpen={revisionModalOpen}
          setIsOpen={setRevisionModalOpen}
        />
      )}
      {revisionInstructions &&
        revisionInstructions?.length > 0 &&
        revisionInstructions.map((instruction, index) => (
          <div key={index}>
            <div className="text-blue-bright font-bold w-1/2 mt-4">{`Revision 0${
              index + 1
            }`}</div>
            <ReactQuill
              value={instruction.revisionComments}
              readOnly={true}
              theme={"bubble"}
            />
          </div>
        ))}

      {gig.proposal[0].freelancer === userInfo?.get("spectUsername") &&
        gig.status === 201 && <SubmissionForm />}
      {gig.proposal[0].freelancer === userInfo?.get("spectUsername") &&
        gig.status === 204 && <SubmissionForm />}
      {gig.status !== 201 &&
        submissions
          ?.reverse()
          .map((submission, index) => (
            <ReadSubmission
              submission={submission}
              key={index}
              index={submissions.length - (index + 1)}
            />
          ))}
      {gig.status === 201 &&
        userInfo?.get("spectUsername") === gig.clientUsername && (
          <div>
            <div className="my-4 text-xl">No Submission Received yet!</div>

            <div className="w-1/4">
              {contractGig.deadline.submissionDeadline <
                Math.floor(Date.now() / 1000) && (
                <PrimaryButton
                  variant="outlined"
                  size="large"
                  fullWidth
                  type="submit"
                  endIcon={<FmdBadIcon />}
                  onClick={() => {
                    setConfirmViolationOpen(true);
                  }}
                >
                  Call Deadline Violation
                </PrimaryButton>
              )}
            </div>
          </div>
        )}
      {gig.status === 202 &&
        gig.clientUsername === userInfo?.get("spectUsername") && (
          <div className="flex flex-row">
            <div className="w-1/5 my-4 mr-2">
              <PrimaryButton
                variant="contained"
                size="large"
                fullWidth
                type="submit"
                endIcon={<CheckCircleIcon />}
                id="bAcceptSubmission"
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                Accept Submission
              </PrimaryButton>
            </div>
            {contractGig.numRevisionsRemaining === 0 && (
              <div className="w-1/5 my-4">
                <PrimaryButton
                  variant="outlined"
                  size="large"
                  fullWidth
                  type="submit"
                  endIcon={<FmdBadIcon />}
                  onClick={() => {
                    setDisputeOpen(true);
                  }}
                >
                  Raise Dispute
                </PrimaryButton>
              </div>
            )}
            {contractGig.numRevisionsRemaining !== 0 && (
              <div className="w-1/5 my-4">
                <PrimaryButton
                  variant="outlined"
                  size="large"
                  fullWidth
                  type="submit"
                  endIcon={<SettingsBackupRestoreIcon />}
                  onClick={() => {
                    setRevisionModalOpen(true);
                  }}
                >
                  Request Revision
                </PrimaryButton>
              </div>
            )}
          </div>
        )}
    </motion.main>
  );
};

export default Submission;
