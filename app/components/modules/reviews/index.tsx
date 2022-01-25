import { animationVariant } from "app/constants/constants";
import { Gig } from "app/types";
import { motion } from "framer-motion";
import { useProfile } from "pages/profile/[username]";
import React, { useEffect, useState } from "react";
import { useMoralisCloudFunction } from "react-moralis";
import ReviewSummary from "../reviewSummary";

type Props = {};

const Reviews = (props: Props) => {
  const { profileUser: userInfo } = useProfile();
  const [gigs, setGigs] = useState<Gig[]>([] as Gig[]);

  const { fetch: getUserFeedback } = useMoralisCloudFunction(
    "getUserFeedback",
    {
      limit: 1,
    },
    { autoFetch: false }
  );
  useEffect(() => {
    getUserFeedback({
      onSuccess: (res: Gig[]) => {
        console.log(res);
        res = res.slice().reverse();
        setGigs(res);
      },
      params: {
        username: userInfo.get("spectUsername"),
      },
    });
  }, []);

  return (
    <motion.main
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={animationVariant}
    >
      <div className="mt-2">
        {gigs.map((gig, index) => (
          <ReviewSummary gig={gig} key={index} />
        ))}
      </div>
    </motion.main>
  );
};

export default Reviews;
