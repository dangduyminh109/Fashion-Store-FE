import { createContext, useState } from "react";

interface SidebarContextType {
  isShow: boolean;
  ToggleSidebar: () => void;
  CloseSidebar: () => void;
  OpenSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isShow: true,
  ToggleSidebar: () => {},
  CloseSidebar: () => {},
  OpenSidebar: () => {},
});

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [show, setShow] = useState(JSON.parse(localStorage.getItem("ShowSidebar") || "false"));

  const ToggleSidebar = () => {
    setShow(!show);
    localStorage.setItem("ShowSidebar", `${!show}`);
  };
  const CloseSidebar = () => {
    setShow(false);
    localStorage.setItem("ShowSidebar", "false");
  };
  const OpenSidebar = () => {
    setShow(true);
    localStorage.setItem("ShowSidebar", "true");
  };
  return (
    <SidebarContext.Provider value={{ isShow: show, ToggleSidebar, CloseSidebar, OpenSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarContext;
