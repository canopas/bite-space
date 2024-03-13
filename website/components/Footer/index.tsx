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
                <Link href="/" className="mb-8 inline-block">
                  {/* <Image
                    src="images/logo/logo-2.svg"
                    alt="logo"
                    className="w-full dark:hidden"
                    width={140}
                    height={30}
                  />
                  <Image
                    src="images/logo/logo.svg"
                    alt="logo"
                    className="hidden w-full dark:block"
                    width={140}
                    height={30}
                  /> */}
                  <p className="text-3xl font-extrabold text-primary">
                    <span className="text-black dark:text-white">Bite</span>{" "}
                    Space
                  </p>
                </Link>
                <p className="mb-9 text-base font-medium leading-relaxed text-body-color">
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
                    <a
                      href="/"
                      className="mb-4 inline-block text-base font-medium text-body-color hover:text-primary"
                    >
                      {" "}
                      Privacy Policy{" "}
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="mb-4 inline-block text-base font-medium text-body-color hover:text-primary"
                    >
                      {" "}
                      Terms of Use{" "}
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="mb-4 inline-block text-base font-medium text-body-color hover:text-primary"
                    >
                      {" "}
                      About{" "}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="py-8 bg-white dark:bg-black">
          <div className="container">
            <p className="text-center text-base text-body-color dark:text-white">
              Copyright by &nbsp;
              <a
                href="https://canopas.com"
                className="font-bold"
                target="blank"
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
