import NextHead from 'next/head';

interface HeadProps {
  title: string;
}

const Head: React.FC<HeadProps> = ({ title }) => {
  return (
    <NextHead key="title">
      <title>{title}</title>
    </NextHead>
  );
};

export default Head;
