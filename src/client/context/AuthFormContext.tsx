import { createContext, useState } from "react";

interface AuthFormContextType {
  isShow: boolean;
  CloseAuthForm: () => void;
  OpenAuthForm: () => void;
}

const AuthFormContext = createContext<AuthFormContextType>({
  isShow: true,
  CloseAuthForm: () => {},
  OpenAuthForm: () => {},
});

export const AuthFormProvider = ({ children }: { children: React.ReactNode }) => {
  const [show, setShow] = useState(false);

  const CloseAuthForm = () => {
    setShow(false);
  };
  const OpenAuthForm = () => {
    setShow(true);
  };
  return (
    <AuthFormContext.Provider value={{ isShow: show, CloseAuthForm, OpenAuthForm }}>
      {children}
    </AuthFormContext.Provider>
  );
};

export default AuthFormContext;
