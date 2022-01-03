import OptionFilter from "app/components/elements/filters/OptionFilter";
import TextFilter from "app/components/elements/filters/TextFilter";
import { LightTooltip } from "app/components/elements/styledComponents";
import { exploreHelperTexts } from "app/constants/constants";
import { Gig } from "app/types";
import { filterByDate } from "app/utils/utils";
import { useExplore } from "pages";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

interface Props {}

const ExploreFilter: React.FC<Props> = (props: Props) => {
  const [collateralOptionSelected, setCollateralOptionSelected] = useState(0);
  const [deadlineOptionSelected, setDeadlineOptionSelected] = useState(0);
  const { isInitialized } = useMoralis();
  const {
    setLoaded,
    filterGigs,
    setGigs,
    minCollateral,
    maxCollateral,
    minDeadline,
    maxDeadline,
  } = useExplore();
  useEffect(() => {
    if (isInitialized) {
      setLoaded(false);
      filterGigs({
        onSuccess: (res: Gig[]) => {
          setGigs(filterByDate(res, [minDeadline, maxDeadline]));
          setLoaded(true);
        },
        params: {
          tags: [],
          lockedStake: [minCollateral, maxCollateral],
          sortBy: "reward",
          sortOrder: "asc",
        },
      });
    }
  }, [isInitialized]);

  return (
    <div className="mb-16">
      <div>
        <div className="mt-4">
          <TextFilter label="Required Skills" />
        </div>

        <div className="m-8 mb-2 flex flex-row">
          <LightTooltip
            arrow
            placement="top"
            title={exploreHelperTexts["minStake"]}
          >
            <span className="text-base text-blue-light">
              Collateral required
            </span>
          </LightTooltip>
        </div>
        <OptionFilter
          checked={collateralOptionSelected === 0}
          option={0}
          setOptionSelected={setCollateralOptionSelected}
          text={"Show All"}
          minFilter={0}
          maxFilter={Number.MAX_SAFE_INTEGER}
          groupName="collateral"
        />
        <OptionFilter
          checked={collateralOptionSelected === 1}
          option={1}
          setOptionSelected={setCollateralOptionSelected}
          text={"100 or lower"}
          minFilter={0}
          maxFilter={0.01}
          groupName="collateral"
        />
        <OptionFilter
          checked={collateralOptionSelected === 2}
          option={2}
          setOptionSelected={setCollateralOptionSelected}
          text={"100 - 500"}
          minFilter={0.02}
          maxFilter={1}
          groupName="collateral"
        />
        <OptionFilter
          checked={collateralOptionSelected === 3}
          option={3}
          setOptionSelected={setCollateralOptionSelected}
          text={"Above 500"}
          minFilter={1}
          maxFilter={Number.MAX_SAFE_INTEGER}
          groupName="collateral"
        />
      </div>

      <div>
        <div className="m-8 mb-2 flex flex-row">
          <LightTooltip
            arrow
            placement="top"
            title={exploreHelperTexts["deadline"]}
          >
            <span className="text-base text-blue-light">Deadline</span>
          </LightTooltip>
        </div>
        <OptionFilter
          checked={deadlineOptionSelected === 0}
          option={0}
          setOptionSelected={setDeadlineOptionSelected}
          text={"None"}
          minFilter={0}
          maxFilter={365}
          groupName="deadline"
        />
        <OptionFilter
          checked={deadlineOptionSelected === 1}
          option={1}
          setOptionSelected={setDeadlineOptionSelected}
          text={"0-3 days"}
          minFilter={0}
          maxFilter={3}
          groupName="deadline"
        />
        <OptionFilter
          checked={deadlineOptionSelected === 2}
          option={2}
          setOptionSelected={setDeadlineOptionSelected}
          text={"More than 3 days"}
          minFilter={3}
          maxFilter={365}
          groupName="deadline"
        />
      </div>
    </div>
  );
};

export default ExploreFilter;
