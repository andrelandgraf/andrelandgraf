import type { FC, PropsWithChildren } from 'react';
import DownloadButton from '~/components/download/download';
import Link from '~/components/UI/link/link';

const Layout: FC<PropsWithChildren<any>> = ({ children }) => {
  return (
    <div className="relative bg-gray-300 dark:bg-gray-900 text-gray-800 dark:text-white font-medium text-lg min-h-screen px-5 py-10 lg:p-10 2xl:p-16">
      <header className="w-full flex flex-col lg:flex-row items-center mb-5 lg:mb-10 2xl:mb-16">
        <div className="w-full flex flex-col lg:flex-row items-start gap-10 lg:ml-auto">
          <img
            className="w-60 xl:w-64 2xl:w-72 rounded-md"
            src="https://res.cloudinary.com/andre-landgraf/image/upload/c_scale,f_auto,q_auto,w_350/v1637689043/portrait.jpg"
            alt="Andre Landgraf smiling into the camera"
          />
          <div className="flex flex-col gap-5">
            <h2 className="font-bold text-2xl xl:text-4xl 2xl:text-6xl">Andre Landgraf</h2>
            <p className="text-xl xl:text-2xl 2xl:text-4xl font-semibold">
              A tech enthusiast and student who loves to develop fullstack software solutions.
            </p>
            <DownloadButton />
            <nav>
              <ul className="flex gap-5">
                <li>
                  <Link to="/" nav>
                    CV
                  </Link>
                </li>
                <li>
                  <Link to="/uses/" nav>
                    Tech
                  </Link>
                </li>
                <li>
                  <Link to="/100-days-of-code/" nav>
                    #100DaysOfCode
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <main className="py-20">{children}</main>
      <footer className="absolute bottom-0 p-5 w-full flex justify-center items-center">
        <small>Andre Landgraf © {new Date().getFullYear()}</small>
      </footer>
    </div>
  );
};

export default Layout;
