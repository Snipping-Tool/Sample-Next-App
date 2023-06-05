import StatBox from "./StatsBox";

const DashboardStats = () => {
  return (
    <>
      <div className="flex flex-row flex-wrap justify-center gap-[20px] w-full">
        <StatBox
          title={"Total NFTs"}
          data={100}
          lateData={90}
          lastUpdated={Date.now()}
        />
        <StatBox
          title={"Total Distributed"}
          data={100}
          lateData={90}
          lastUpdated={Date.now()}
        />
      </div>
      <div className="flex flex-row flex-wrap justify-center gap-[20px] w-full">
        <StatBox
          title={"Undistributed Reward"}
          data={100}
          lateData={90}
          lastUpdated={Date.now()}
        />
        <StatBox
          title={"Next Payout"}
          data={100}
          lateData={90}
          lastUpdated={Date.now()}
        />
      </div>
    </>
  );
};

export default DashboardStats;
