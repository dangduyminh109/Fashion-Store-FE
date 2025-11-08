import { createContext, useState } from "react";
import type { listBreadcrumb } from "../components/Breadcrumb";

interface BreadcrumbContextType {
  breadcrumb: listBreadcrumb[];
  setBreadcrumb: React.Dispatch<React.SetStateAction<listBreadcrumb[]>>;
}

const BreadcrumbContext = createContext<BreadcrumbContextType>({
  breadcrumb: [],
  setBreadcrumb: () => {},
});

export const BreadcrumbProvider = ({ children }: { children: React.ReactNode }) => {
  const [breadcrumb, setBreadcrumb] = useState<listBreadcrumb[]>([]);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumb, setBreadcrumb }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export default BreadcrumbContext;
