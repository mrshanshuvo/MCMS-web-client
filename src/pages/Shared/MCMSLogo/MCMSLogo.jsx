import { NavLink } from "react-router";

const MCMSLogo = () => {
  return (
    <NavLink to="/" className="flex items-center gap-3 group">
      <div className="w-10 h-10 bg-gradient-to-br from-[#F5F7F8] to-[#495E57]/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm border border-[#495E57]/10">
        <img
          src="/mcmsLogo.png"
          alt="MCMS Logo"
          className="w-full h-full rounded-full"
        />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-xl text-[#45474B] leading-tight group-hover:text-[#495E57] transition-colors">
          MCMS
        </span>
        <span className="text-xs text-[#495E57]/60 leading-tight">
          Medical Camp
        </span>
      </div>
    </NavLink>
  );
};

export default MCMSLogo;
