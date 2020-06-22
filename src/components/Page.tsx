import React, { useEffect, ReactElement } from 'react';

interface PageProps {
  name: string;
  children: ReactElement<any, any>;
}

const Page: React.FC<PageProps> = (props) => {
  const { name } = props;
  useEffect(() => {
    console.log('mount', name);
    return () => {
      console.log('unmount', name);
    };
  }, []);
  return props.children;
};

export default Page;
