/* eslint-disable @next/next/no-img-element */
import { useGlobal } from "app/context/web3Context";

interface Props {}

const Portfolio = (props: Props) => {
  const {
    state: { userInfo, loading },
  } = useGlobal();
  return (
    <div className="my-8">
      <div className="text-2xl font-bold text-blue-bright">Portfolio</div>
      <div className="grid gap-8 grid-cols-3 my-12">
        {userInfo?.get("portfolio").map((value, index) => (
          <button
            className="shadow-2xl w-full h-64 transition duration-1000 ease-in-out transform hover:-translate-y-1 border-blue-border rounded-xl bg-transparent"
            key={index}
          >
            <a href={value.link} target="_blank" rel="noreferrer">
              <img
                className="w-full h-4/5 object-cover rounded-t-lg"
                src={value.ipfs}
                alt="Portfolio1"
              />
            </a>
            <div className="h-1/5 text-base xl:text-lg py-4 text-center leading-tight rounded-b-lg font-bold whitespace-normal">
              {value.title}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
