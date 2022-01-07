import { animationVariant } from "app/constants/constants";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useGig } from "pages/gig/[id]";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface Props {}

const Dispute = (props: Props) => {
  const { evidence } = useGig();

  return (
    <motion.main
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={animationVariant}
    >
      <div>
        <div className="mt-4">
          <span className="text-xl text-blue-bright w-1/2 my-4">
            Description
          </span>
          <ReactQuill
            value={evidence?.disputeReason}
            readOnly={true}
            theme={"bubble"}
          />
        </div>
      </div>
    </motion.main>
  );
};

export default Dispute;
