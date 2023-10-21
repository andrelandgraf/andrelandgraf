import type { HeadersFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

import { StyledLink } from '~/components/links';
import { PageTransitionProgressBar } from '~/components/progress';
import { images } from '~/utilities/images';

export const headers: HeadersFunction = () => {
  return {
    'cache-control': 'public, max-age=3600',
  };
};

export default function Component() {
  return (
    <>
      <PageTransitionProgressBar />
      <div className="relative bg-white dark:bg-gray-900 text-gray-800 dark:text-white font-medium text-lg min-h-screen w-screen overflow-x-hidden px-5 py-10 lg:p-10 2xl:p-16">
        <header className="w-full flex flex-col lg:flex-row items-center mb-5 lg:mb-10 2xl:mb-16">
          <div className="w-full flex flex-col lg:flex-row items-start gap-10 lg:ml-auto">
            <img
              className="w-60 xl:w-64 2xl:w-72 rounded-md"
              src={images.resumeImage.src}
              alt={images.resumeImage.alt}
              width={images.resumeImage.width}
              height={images.resumeImage.height}
            />
            <div className="flex flex-col gap-5">
              <h2 className="font-bold text-2xl xl:text-4xl 2xl:text-6xl">Andre Landgraf</h2>
              <p className="max-w-2xl text-xl xl:text-2xl 2xl:text-4xl font-semibold">
                A tech enthusiast and student who loves to develop fullstack software solutions.
              </p>
              <nav>
                <ul className="lg:mrl-auto flex gap-5">
                  <li>
                    <StyledLink to="/" nav>
                      Home
                    </StyledLink>
                  </li>
                  <li>
                    <StyledLink to="/cv/" nav>
                      CV
                    </StyledLink>
                  </li>
                  <li>
                    <StyledLink to="/blog/" nav>
                      Blog
                    </StyledLink>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>
        <main className="py-20">
          <Outlet />
        </main>
        <footer className="absolute bottom-0 p-5 w-full flex justify-center items-center">
          <small>Andre Landgraf © {new Date().getFullYear()}</small>
        </footer>
      </div>
    </>
  );
}
