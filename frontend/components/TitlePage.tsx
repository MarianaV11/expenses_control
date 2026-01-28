interface TitlePageProps {
  name: string;
}

const TitlePage = ({ name }: TitlePageProps) => {
  return (
    <>
      <h1 className="text-3xl text-secondary mb-4">{name}</h1>
    </>
  );
};

export default TitlePage;
