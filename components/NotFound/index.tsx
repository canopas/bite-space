const NotFound: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-black  text-white">
      <div className="flex">
        <span className="text-2xl font-bold">404</span>
        <span className="mx-5 border-l-2 border-graydark"></span>
        <span className="flex items-center">This page could not be found.</span>
      </div>
    </div>
  );
};

export default NotFound;
