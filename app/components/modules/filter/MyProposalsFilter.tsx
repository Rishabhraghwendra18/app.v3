import OptionFilter from "app/components/elements/filters/OptionFilter";
import TextFilter from "app/components/elements/filters/TextFilter";
import { statusToStatusIdMap } from "app/constants/constants";
import { ProposalStatus } from "app/types";
import { useRouter } from "next/router";
import { useMyGigs } from "pages/myGigs";
import { useMyProposals } from "pages/myProposals";
import { useEffect, useState } from "react";

interface Props {}

const MyProposalsFilter: React.FC<Props> = (props: Props) => {
  const [status, setStatus] = useState<ProposalStatus | undefined>();
  const router = useRouter();
  const statusParam = router.query.status as string;
  const { getMyProposals, setMyProposals, setLoaded } = useMyProposals();
  useEffect(() => {
    if (statusParam) {
      setStatus(statusToStatusIdMap[statusParam]);
      setLoaded(false);
      getMyProposals({
        onSuccess: (res) => {
          setMyProposals(res);
          setLoaded(true);
        },
        params: {
          status: statusToStatusIdMap[statusParam],
        },
      });
    }
  }, [statusParam]);
  return (
    <div>
      <div>
        <div className="m-8 mb-2 flex flex-row">
          <span className="font-semibold text-sm text-blue-light">Status</span>
        </div>
        <OptionFilter
          checked={status === undefined}
          option={100}
          setOptionSelected={setStatus}
          text={"Show All"}
          groupName="proposalStatus"
        />
        <OptionFilter
          checked={status === 101}
          option={101}
          setOptionSelected={setStatus}
          text={"Open"}
          groupName="proposalStatus"
        />
        <OptionFilter
          checked={status === 102}
          option={102}
          setOptionSelected={setStatus}
          text={"Shortlisted"}
          groupName="proposalStatus"
        />
        <OptionFilter
          checked={status === 103}
          option={103}
          setOptionSelected={setStatus}
          text={"Accepted"}
          groupName="proposalStatus"
        />
        <OptionFilter
          checked={status === 401}
          option={401}
          setOptionSelected={setStatus}
          text={"Rejected"}
          groupName="proposalStatus"
        />
      </div>
    </div>
  );
};

export default MyProposalsFilter;
