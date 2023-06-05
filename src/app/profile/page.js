import Link from "next/link";
import ConnectButton from "../components/ConnectButton";
import MintBody from "../components/MintBody";
import { SiVitest } from "react-icons/si";

const Profile = () => {
  return (
    <div className="flex flex-col w-full md:px-[20%] px-[5%]">
      <div className="flex flex-row w-full items-center justify-between py-[3%]">
        <div className="flex flex-row">
          <Link
            href="/"
            className="text-xl tracking-[5px] flex-row flex items-center gap-[5px]"
          >
            <SiVitest className="flex text-[50px]" />
            TITEST
          </Link>
        </div>
        <ConnectButton />
      </div>
      <div className="flex flex-col w-full items-center justify-between py-[3%] rounded-[15px] border-white bg-slate-300 border-[2px] text-slate-900">
        <p className=" w-full text-center items-center text-[30px] uppercase tracking-[3px] px-[15px]">
          PROFILE
        </p>
        <div className="w-full flex items-center justify-center">
          <MintBody />
        </div>
      </div>
    </div>
  );
};

export default Profile;
