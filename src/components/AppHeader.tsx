import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { Link } from "react-router-dom";
import FPHLogo from "@/assets/FPHLogo.svg?react";
import { Card } from "./ui/card";
import { useURLContext } from "@/context/URLContext";
const AppHeader: React.FC = () => {
  let selectedFamilyId = null;
  let selectedFamilyName = null;

  try {
    ({ selectedFamilyId } = useURLContext());
    ({ selectedFamilyName } = useFamilyDataContext());
  } catch {}

  return (
    <Card className="w-full flex justify-end rounded-t-none">
      <div
        className="whitespace-nowrap flex items-center px-2"
        id="app-header-text-container"
      >
        <Link
          to={`/app/family/${selectedFamilyId}`}
          className="text-xl font-bold text-primary-foreground"
        >
          {selectedFamilyName && `The ${selectedFamilyName} Family`}
        </Link>
      </div>
      <div
        className="whitespace-nowrap flex items-center px-2"
        id="app-header-text-container"
      >
        <Link to={`/app/family/${selectedFamilyId}`}>
          <FPHLogo className="text-primary-foreground shrink-0 max-h-[24px]" />
        </Link>
      </div>
    </Card>
  );
};

export default AppHeader;
