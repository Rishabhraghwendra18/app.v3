import { animationVariant } from "app/constants/constants";
import { motion } from "framer-motion";
import SubmissionForm from "./submissionForm";

interface Props {}

const Submission = (props: Props) => {
  return (
    <motion.main
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={animationVariant}
    >
      <SubmissionForm />
    </motion.main>
  );
};

export default Submission;
