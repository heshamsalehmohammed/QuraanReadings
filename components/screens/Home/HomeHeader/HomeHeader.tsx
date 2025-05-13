import GeneralHeader from "@/components/common/GeneralHeader";
import HomeHeaderLeftButton from "./HomeHeaderLeftButton";
import HomeHeaderRightButton from "./HomeHeaderRightButton";

function HomeHeader() {
  return (
    <GeneralHeader>
      <HomeHeaderLeftButton />
      <HomeHeaderRightButton />
    </GeneralHeader>
  );
}

export default HomeHeader;
