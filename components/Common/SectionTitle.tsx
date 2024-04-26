const SectionTitle = ({
  title,
  paragraph,
  customClass,
  center,
}: {
  title: string;
  paragraph: string;
  customClass?: string;
  center?: boolean;
}) => {
  return (
    <>
      <div
        className={`wow fadeInUp w-full ${
          center ? "mx-auto text-center" : ""
        } ${customClass}`}
        data-wow-delay=".1s"
      >
        <h2 className="mb-4 text-3xl font-bold !leading-tight text-black dark:text-white sm:text-4xl md:text-[45px]">
          {title}
        </h2>
        <p className="text-base !leading-relaxed text-gray-500 dark:text-gray-400 md:text-lg">
          {paragraph}
        </p>
      </div>
    </>
  );
};

export default SectionTitle;
