import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <footer
        className="wow fadeInUp relative z-10 bg-primary bg-opacity-10 pt-16 md:pt-20 lg:pt-24"
        data-wow-delay=".1s"
      >
        <div className="container">
          <div className="-mx-4 md:flex md:justify-between">
            <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-5/12">
              <div className="mb-12 max-w-[360px] lg:mb-16">
                <Link target="_top" href="/" className="mb-8 inline-block">
                  <p className="text-3xl font-extrabold text-primary">
                    <span className="text-black dark:text-white">Bite</span>{" "}
                    Space
                  </p>
                </Link>
                <p className="mb-9 text-base leading-relaxed text-gray-600 dark:text-gray-300">
                  Where passion meets the palate – Welcome to a world of
                  culinary delight!
                </p>
              </div>
            </div>

            <div className="px-4">
              <div className="mb-12 lg:mb-16">
                <h2 className="mb-10 text-xl font-bold text-black dark:text-white">
                  Support & Help
                </h2>
                <ul>
                  <li>
                    <Link
                      href="/"
                      className="mb-4 inline-block text-base text-gray-600 dark:text-gray-300 hover:text-primary"
                    >
                      {" "}
                      Contact Us{" "}
                    </Link>
                  </li>
                  <li>
                    <Link
                      target="_top"
                      href="/about"
                      className="mb-4 inline-block text-base text-gray-600 dark:text-gray-300 hover:text-primary"
                    >
                      {" "}
                      About{" "}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="py-8 bg-white dark:bg-black">
          <div className="container">
            <p className="text-center text-base text-gray-600 dark:text-white">
              © {""}
              <a
                href="https://canopas.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold"
              >
                Canopas
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
