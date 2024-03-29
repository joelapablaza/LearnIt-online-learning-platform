import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="border border-[#0000000e] dark:border-[#ffffff1e]" />
      <br />
      <div className="w-[95%] 800px:w-full 800px:max-w-[85%] mx-auto px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-[20px] font-[600] text-black dark:text-white">
              About
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href={'/about'}
                  className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                >
                  Nuestra Historia
                </Link>
              </li>
              <li>
                <Link
                  href={'/privacy-policy'}
                  className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                >
                  Politica de Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href={'/faq'}
                  className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-[20px] font-[600] text-black dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href={'/courses'}
                  className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                >
                  Cursos
                </Link>
              </li>
              <li>
                <Link
                  href={'/profile'}
                  className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                >
                  Mi cuenta
                </Link>
              </li>
              <li>
                <Link
                  href={'/course-dashboard'}
                  className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                >
                  Panel del Curso
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-[20px] font-[600] text-black dark:text-white">
              Social Links
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href={'/#'}
                  className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                >
                  YouTube
                </Link>
              </li>
              <li>
                <Link
                  href={'/#'}
                  className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  href={'https://github.com/joelapablaza'}
                  className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                >
                  Github
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[20px] font-[600] text-black dark:text-white">
              Informacion de contacto
            </h3>
            <p className="text-base text-black dark:text-gray-300 dark:hover:text-white pb-2">
              Tel: +54 9 343 5074458
            </p>
            <p className="text-base text-black dark:text-gray-300 dark:hover:text-white pb-2">
              Email: joelapablaza@gmail.com
            </p>
          </div>
        </div>
        <br />

        <p className="mt-2 text-center text-black dark:text-white">
          Copyright © 2023 LearnIt | Desarrollado por Joel Apablaza
        </p>
      </div>
      <br />
    </footer>
  );
};

export default Footer;
