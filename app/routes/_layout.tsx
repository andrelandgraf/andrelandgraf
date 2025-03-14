import type { HeadersFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { Img } from 'openimg/react';
import { StyledLink } from '~/components/links.tsx';
import { PageTransitionProgressBar } from '~/components/progress.tsx';

export const headers: HeadersFunction = () => {
  return {
    'cache-control': 'public, max-age=7200',
  };
};

export default function Component() {
  return (
    <>
      <PageTransitionProgressBar />
      <div className="relative bg-white dark:bg-gray-800 lg:transition-colors lg:duration-1000 lg:bg-gradient-to-br lg:from-teal-50 lg:via-white lg:to-teal-100 lg:dark:from-stone-800 lg:dark:via-slate-800 lg:dark:to-gray-800 text-gray-800 dark:text-white font-medium text-lg min-h-screen w-screen overflow-x-hidden px-5 py-10 lg:p-10 2xl:p-16">
        <div className="w-full max-w-ultraWide ultraWide:m-auto flex flex-col">
          <header className="w-full flex flex-col lg:flex-row items-center mb-6 lg:mb-16">
            <div className="w-full flex flex-col lg:flex-row items-start gap-4 lg:gap-10 lg:ml-auto">
              <Img
                className="w-40 rounded-md"
                alt="Andre smiles into the camera."
                src="/profile.png"
                width="160"
                height="160"
              />
              <div className="flex flex-col gap-2 lg:gap-4">
                <h2 className="font-bold text-2xl xl:text-4xl">Andre Landgraf</h2>
                <p className="max-w-2xl text-xl xl:text-2xl font-semibold">
                  Web Dev, Blog, Book, Talks, Meetups, and more.
                </p>
                <nav>
                  <ul className="lg:mrl-auto flex gap-5">
                    <li>
                      <StyledLink to="/" nav>
                        Home
                      </StyledLink>
                    </li>
                    <li>
                      <StyledLink to="/blog/" nav>
                        Blog
                      </StyledLink>
                    </li>
                    <li>
                      <StyledLink to="/#book" nav>
                        Book
                      </StyledLink>
                    </li>
                    <li>
                      <StyledLink to="/#talks" nav>
                        Talks
                      </StyledLink>
                    </li>
                    <li>
                      <StyledLink to="/#meetups" nav>
                        Meetups
                      </StyledLink>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </header>
          <div className="pb-20 wide:m-auto w-full max-w-wide flex flex-col wide:items-center">
            <Outlet />
          </div>
          <footer className="absolute bottom-0 py-5 text-center left-0 right-0">
            <small>Andre Landgraf © {new Date().getFullYear()}</small>
          </footer>
        </div>
      </div>
    </>
  );
}
