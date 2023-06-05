import Link from "next/link";
import ConnectButton from "./components/ConnectButton";
import DashboardStats from "./components/DashboardStats";
import { SiVitest } from "react-icons/si";

const Home = () => {
  return (
    <div className="flex flex-col w-full md:px-[20%] px-[5%]">
      <div className="flex flex-row w-full items-center justify-between py-[3%]">
        <Link
          href="/"
          className="text-xl tracking-[5px] flex-row flex items-center gap-[5px]"
        >
          <SiVitest className="flex text-[50px]" />
          TITEST
        </Link>
        <ConnectButton />
      </div>
      <div className="flex flex-col w-full items-center justify-between py-[3%] rounded-[15px] border-white bg-slate-300 border-[2px] text-slate-900">
        <p className=" w-full text-center items-center text-[30px] uppercase tracking-[3px]">
          DASHBOARD
        </p>
        <DashboardStats />
      </div>
    </div>
  );
};

export default Home;
