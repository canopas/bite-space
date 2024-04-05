"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";
import { useTheme } from "next-themes";

const Header = () => {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);

    // Function to handle changes in the system color scheme
    const handleSystemThemeChange = (e: any) => {
      const newTheme = e.matches ? "dark" : "light";
      setTheme(newTheme);
    };

    // Create a media query to match the system color scheme
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)");

    // Initial check for the system color scheme
    handleSystemThemeChange(prefersDarkMode);

    // Listen for changes in the system color scheme
    // prefersDarkMode.addListener(handleSystemThemeChange);
    prefersDarkMode.addEventListener("change", handleSystemThemeChange);

    // Clean up the event listener on component unmount
    return () => {
      // prefersDarkMode.removeListener(handleSystemThemeChange);
      prefersDarkMode.removeEventListener("change", handleSystemThemeChange);
    };
  }, [setTheme]);

  const pathname = usePathname();
  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <>
      <header
        className={`header left-0 top-0 z-40 flex w-full items-center ${
          sticky
            ? "!fixed !z-[9999] !bg-white !bg-opacity-80 shadow-sticky backdrop-blur-xl !transition dark:!bg-black dark:!bg-opacity-20"
            : "absolute"
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-96 max-w-full px-4">
              <div
                className={`header-logo block w-full ${
                  sticky ? "py-5" : "py-8"
                } `}
              >
                <Link
                  target="_top"
                  href="/"
                  className="text-3xl font-extrabold text-primary"
                >
                  <span
                    className={`${
                      sticky || (pathname !== "/" && pathname !== "/about")
                        ? "text-black dark:text-white"
                        : "text-white"
                    } ${
                      sticky || !pathname?.includes("/menu")
                        ? "text-black dark:text-white"
                        : "text-white"
                    }`}
                  >
                    Bite
                  </span>{" "}
                  Space
                </Link>
              </div>
            </div>
            <div className="flex w-20 items-center justify-end px-4 sm:w-full">
              <div>
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="absolute right-4 top-1/2 block translate-y-[-50%] px-2 py-[6px] ring-primary lg:hidden"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${
                      sticky || pathname != "/"
                        ? "bg-black dark:bg-white"
                        : "bg-white"
                    } ${navbarOpen ? " top-[7px] rotate-45" : ""} ${
                      sticky ||
                      (pathname !== "/" &&
                        pathname !== "/about" &&
                        !pathname?.includes("/menu"))
                        ? "bg-black dark:bg-white"
                        : "bg-white"
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${
                      sticky || pathname != "/"
                        ? "bg-black dark:bg-white"
                        : "bg-white"
                    } ${navbarOpen ? "opacity-0 " : ""} ${
                      sticky ||
                      (pathname !== "/" &&
                        pathname !== "/about" &&
                        !pathname?.includes("/menu"))
                        ? "bg-black dark:bg-white"
                        : "bg-white"
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${
                      sticky || pathname != "/"
                        ? "bg-black dark:bg-white"
                        : "bg-white"
                    } ${navbarOpen ? " top-[-8px] -rotate-45" : ""} ${
                      sticky ||
                      (pathname !== "/" &&
                        pathname !== "/about" &&
                        !pathname?.includes("/menu"))
                        ? "bg-black dark:bg-white"
                        : "bg-white"
                    }`}
                  />
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar absolute right-0 z-30 w-[250px] mr-5 lg:mr-0 rounded px-6 py-4 duration-300 bg-white dark:bg-black border dark:border-gray-800 lg:border-0 lg:visible lg:static lg:w-auto lg:!bg-transparent lg:opacity-100 ${
                    navbarOpen
                      ? "visibility top-full opacity-100"
                      : "invisible top-[120%] opacity-0"
                  }`}
                >
                  <ul className="block lg:flex lg:space-x-12">
                    {menuData.map((menuItem, index) => (
                      <li key={"menu-" + menuItem.id}>
                        {menuItem.path ? (
                          <Link
                            target="_top"
                            href={menuItem.path}
                            className={`flex py-2 text-base group-hover:opacity-70 lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 text-black dark:text-white ${
                              pathname == menuItem.path ? "font-extrabold" : ""
                            } ${
                              sticky ||
                              (pathname !== "/" &&
                                pathname !== "/about" &&
                                !pathname?.includes("/menu"))
                                ? "text-black dark:text-white"
                                : navbarOpen
                                ? "text-black dark:text-white"
                                : "text-white"
                            }`}
                          >
                            {menuItem.title}
                          </Link>
                        ) : (
                          <>
                            <a
                              onClick={() => handleSubmenu(index)}
                              className="flex cursor-pointer items-center justify-between py-2 text-base text-black group-hover:opacity-70 dark:text-white lg:mr-0 lg:inline-flex lg:px-0 lg:py-6"
                            >
                              {menuItem.title}
                              <span className="pl-3">
                                <svg width="15" height="14" viewBox="0 0 15 14">
                                  <path
                                    d="M7.81602 9.97495C7.68477 9.97495 7.57539 9.9312 7.46602 9.8437L2.43477 4.89995C2.23789 4.70308 2.23789 4.39683 2.43477 4.19995C2.63164 4.00308 2.93789 4.00308 3.13477 4.19995L7.81602 8.77183L12.4973 4.1562C12.6941 3.95933 13.0004 3.95933 13.1973 4.1562C13.3941 4.35308 13.3941 4.65933 13.1973 4.8562L8.16601 9.79995C8.05664 9.90933 7.94727 9.97495 7.81602 9.97495Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </span>
                            </a>
                          </>
                        )}
                      </li>
                    ))}
                    <li className="my-2">
                      <Link
                        href="https://admin.bitespace.in/signin"
                        target="_blank"
                        className="text-center bg-primary dark:bg-primary/70 transition duration-500 w-full block py-3 text-base font-bold text-white rounded-xl lg:hidden hover:bg-transparent hover:dark:bg-transparent hover:text-primary border-2 border-transparent hover:border-primary"
                      >
                        Partner With Us
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
              <div className="flex items-center justify-end pr-16 lg:pr-0">
                <Link
                  href="https://admin.bitespace.in/signin"
                  target="_blank"
                  className={`hidden bg-primary dark:bg-primary/70 transition duration-500 px-7 py-3 text-base font-bold text-white rounded-xl lg:block hover:bg-transparent hover:dark:bg-transparent hover:text-primary border-2 border-transparent hover:border-primary ${
                    !sticky && !pathname?.includes("/category")
                      ? "bg-primary/70"
                      : ""
                  }`}
                >
                  Partner With Us
                </Link>
                {/* <div>
                  <ThemeToggler sticky={sticky} />
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
