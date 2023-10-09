interface BaseLayoutProps {
  children?: React.ReactNode;
}

export const PageContent: React.FC<BaseLayoutProps> = ({ children }) => {
  return <div className="flex-1">{children}</div>;
};
