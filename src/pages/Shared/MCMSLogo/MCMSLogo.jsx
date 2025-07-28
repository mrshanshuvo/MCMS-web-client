import { NavLink } from "react-router";

const MCMSLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xl font-bold">
        <img src="/logo.png" alt="MCMS Logo" className="w-8 h-8 rounded-full" />
      </span>
    </div>
  );
};

export default MCMSLogo;
