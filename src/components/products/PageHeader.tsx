import { FC } from "react";

interface PageHeaderProps {
  title: string;
}

const PageHeader: FC<PageHeaderProps> = ({ title }) => {
  return (
    <h1 className="text-3xl font-bold">{title}</h1>
  );
};

export default PageHeader;