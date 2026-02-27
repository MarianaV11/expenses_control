interface TitlePageProps {
  name: string;
}

const TitlePage = ({ name }: TitlePageProps) => {
  return (
    <>
      <h1 className="text-3xl mb-4 font-medium">{name}</h1>
    </>
  );
};

export default TitlePage;
