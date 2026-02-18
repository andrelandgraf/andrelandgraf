import Link from 'next/link';
import type { ReactNode } from 'react';
import { getFocusClasses } from '~/utilities/ariaClasses.ts';

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={`underline decoration-primary hover:decoration-secondary focus:decoration-secondary text-lg xl:text-xl 2xl:text-2xl decoration-4 underline-offset-4 hover:underline-offset-2 ${getFocusClasses(true)}`}
    >
      {children}
    </Link>
  );
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative bg-white dark:bg-gray-800 lg:transition-colors lg:duration-1000 lg:bg-gradient-to-br lg:from-teal-50 lg:via-white lg:to-teal-100 lg:dark:from-stone-800 lg:dark:via-slate-800 lg:dark:to-gray-800 text-gray-800 dark:text-white font-medium text-lg min-h-screen w-screen overflow-x-hidden px-5 py-10 lg:p-10 2xl:p-16">
      <div className="w-full max-w-ultraWide ultraWide:m-auto flex flex-col">
        <header className="w-full flex flex-col lg:flex-row items-center mb-6 lg:mb-16">
          <div className="w-full flex flex-col lg:flex-row items-start gap-4 lg:gap-10 lg:ml-auto">
            <img
              className="w-40 rounded-md"
              alt="Andre smiles into the camera."
              src="/profile.png"
              width="160"
              height="160"
              loading="lazy"
            />
            <div className="flex flex-col gap-2 lg:gap-4">
              <h2 className="font-bold text-2xl xl:text-4xl">Andre Landgraf</h2>
              <p className="max-w-2xl text-xl xl:text-2xl font-semibold">Web Dev, Blog, Book, Talks, Meetups, and more.</p>
              <nav>
                <ul className="lg:mrl-auto flex gap-5">
                  <li>
                    <NavLink href="/">Home</NavLink>
                  </li>
                  <li>
                    <NavLink href="/blog">Blog</NavLink>
                  </li>
                  <li>
                    <NavLink href="/#book">Book</NavLink>
                  </li>
                  <li>
                    <NavLink href="/#talks">Talks</NavLink>
                  </li>
                  <li>
                    <NavLink href="/#meetups">Meetups</NavLink>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>
        <div className="pb-20 wide:m-auto w-full max-w-wide flex flex-col wide:items-center">{children}</div>
        <footer className="absolute bottom-0 py-5 text-center left-0 right-0">
          <small>Andre Landgraf (c) {new Date().getFullYear()}</small>
        </footer>
      </div>
    </div>
  );
}
