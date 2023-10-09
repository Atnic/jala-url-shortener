import * as React from "react";

interface BaseLayoutProps {
  children?: React.ReactNode;
}

export const Page: React.FC<BaseLayoutProps> = ({ children }) => {
  return (
    <section className="flex flex-col flex-1 pb-2 h-screen bg-white">
      {children}
    </section>
  );
};
