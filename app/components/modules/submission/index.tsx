import { PrimaryButton } from "app/components/elements/buttons/primaryButton";
import { animationVariant } from "app/constants/constants";
import { useGlobal } from "app/context/web3Context";
import { motion } from "framer-motion";
import { useGig } from "pages/gig/[id]";
import ReadSubmission from "./readSubmission";
import SubmissionForm, { ISubmissionFormInput } from "./submissionForm";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { ConfirmModal } from "./confirmModal";
import { useState } from "react";

interface Props {}

const Submission = (props: Props) => {
  const {
    state: { userInfo },
  } = useGlobal();
  const { gig } = useGig();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.main
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={animationVariant}
    >
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
      {gig.proposal[0].freelancer === userInfo?.get("spectUsername") &&
        gig.status === 201 && <SubmissionForm />}
      {gig.status !== 201 && <ReadSubmission />}
      {gig.status === 202 &&
        gig.clientUsername === userInfo?.get("spectUsername") && (
          <div className="w-1/4 my-4">
            <PrimaryButton
              variant="outlined"
              size="large"
              fullWidth
              type="submit"
              endIcon={<CheckCircleIcon />}
              onClick={() => {
                setIsOpen(true);
              }}
            >
              Accept Submission
            </PrimaryButton>
          </div>
        )}
    </motion.main>
  );
};

export default Submission;
