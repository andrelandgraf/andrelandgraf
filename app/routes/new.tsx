import type { LinksFunction } from '@remix-run/node';
import type { LinkProps } from '@remix-run/react';
import { Link } from '@remix-run/react';
import clsx from 'clsx';
import type { HTMLAttributes } from 'react';
import { useEffect, useRef } from 'react';

import { ButtonLink } from '~/components/buttons';
import indexStyles from '~/styles/index.css';
import { images } from '~/utilities/images';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: indexStyles }];

function onScrollTrigger(target: HTMLElement, options?: IntersectionObserverInit) {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('observed');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  observer.observe(target);

  return () => {
    observer.unobserve(target);
  };
}

export default function Component() {
  const stars = Array.from({ length: 300 }, () => ({
    w: Math.random() * 3,
    h: Math.random() * 3,
    t: Math.random() * 100,
    r: Math.random() * 100,
  }));
  useEffect(() => {
    const onScroll = (e: Event) => {
      console.log(e);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  });
  return (
    <main className="w-full h-[100vh] bg-black">
      <Scene>
        <Frame className="frame-one text-center font-mono overflow-hidden">
          <div className="h-[100vh] whitespace-normal overflow-hidden lg:whitespace-nowrap flex flex-col items-center justify-center gap-4 lg:gap-8">
            <h1 className="frame-one-heading text-6xl lg:text-9xl text-allThingsWebPurple font-extrabold">
              All Things Web
            </h1>
            <p className="frame-one-subheading text-2xl lg:text-4xl text-allThingsWebOrange font-extrabold">
              Web Dev, Talks, <SubHeadingLink to="#tutoring">Tutoring</SubHeadingLink>,{' '}
              <SubHeadingLink to="/blog">Blog Posts</SubHeadingLink>,{' '}
              <SubHeadingLink to="#meetups">Meetups</SubHeadingLink>, and more. <br />
            </p>
          </div>
          {stars.map((star, i) => (
            <Star key={i} {...star} />
          ))}
        </Frame>
        <Frame className="frame-two text-center font-mono">
          <div className="h-[100vh] mx-4 lg:mx-[10vw] flex items-center justify-center flex-col-reverse lg:flex-row gap-16 lg:gap-[10vw]">
            <div className="lg:max-w-[40vw] flex flex-col items-center justify-center gap-4 lg:gap-8">
              <h2 className="text-4xl lg:text-8xl text-packtOrange font-extrabold">
                Full Stack Web Development with Remix
              </h2>
              <p className="text-2xl lg:text-4xl text-white font-bold">
                Learn how to build better React apps and progressively enhance the user experience with my favorite web
                framework!
              </p>
              <ButtonLink
                target="_blank"
                rel="noopener noreferrer"
                to="https://www.amazon.com/Full-Stack-Development-Remix-production-ready/dp/1801075298"
                overrides={{
                  colorClassName: 'text-white bg-packtOrange',
                  focusRingColorClassName: 'focus:ring-white',
                  hoverRingColorClassName: 'hover:ring-white',
                  textSizeClassName: 'text-2xl lg:text-4xl',
                }}
              >
                Check it out now!
              </ButtonLink>
            </div>
            <img
              className="lg:w-[30vw] max-h-[50vh] lg:max-h-[60vh] shadow-lg shadow-black"
              src={images.bookCoverImage.src}
              alt={images.bookCoverImage.alt}
            />
          </div>
        </Frame>
        <Frame className="frame-three text-center font-mono" id="tutoring">
          <div className="h-[100vh] mx-4 lg:mx-[10vw] flex items-center justify-center flex-col-reverse lg:flex-row gap-16 lg:gap-[10vw]">
            <img
              className="max-w-[80vw] max-h-[40vh] lg:w-[30vw] shadow-lg shadow-black"
              src={images.allThingsWebCoverImage.src}
              alt={images.allThingsWebCoverImage.alt}
            />
            <div className="lg:max-w-[40vw] flex flex-col items-center justify-center gap-4 lg:gap-8">
              <h2 className="text-4xl lg:text-8xl text-allThingsWebOrange font-extrabold">All Things Web</h2>
              <p className="text-2xl lg:text-4xl text-white font-bold">
                Join us on{' '}
                <SubHeadingLink target="_blank" rel="noopener noreferrer" to="https://discord.gg/TVAKCyKX6K">
                  Discord
                </SubHeadingLink>{' '}
                and for our{' '}
                <SubHeadingLink
                  target="_blank"
                  rel="noopener noreferrer"
                  to="https://www.meetup.com/all-things-web-react-html-css-javascript-tutoring/"
                >
                  weekly Meetups
                </SubHeadingLink>{' '}
                for HTML, CSS, and JavaScript tutoring!
              </p>
            </div>
          </div>
        </Frame>
        <Frame
          className="h-[100vh] frame-four text-center font-mono flex items-center justify-center flex-col gap-16 lg:gap-[10vh]"
          id="meetups"
        >
          <div className="lg:max-w-[800px] flex flex-col items-center justify-center gap-4 lg:gap-8">
            <h1 className="text-2xl lg:text-4xl text-white font-bold">Meetups</h1>
            <h1 className="text-white">
              Join us in person or virtually! I help organizing the Remix Bay Area meetup and I tutor up-and-coming devs
              every Monday on Zoom!
            </h1>
          </div>
          <div className="mx-4 lg:mx-[10vw] flex items-center justify-center flex-col lg:flex-row gap-16 lg:gap-[10vh]">
            <Link
              aria-label="Remix Bay Area Meetup"
              target="_blank"
              rel="noopener noreferrer"
              to="https://www.meetup.com/remix-bay-area/"
              className="shadow-lg shadow-black hover:transform-gpu hover:scale-105 transition-all duration-300 ease-in-out"
            >
              <img
                className="max-w-[80vw] max-h-[40vh] lg:w-[30vw]"
                src={images.remixBayAreaCoverImage.src}
                alt={images.remixBayAreaCoverImage.alt}
              />
            </Link>
            <Link
              aria-label="All Things Web, HTML, CSS, and JavaScript tutoring meetup"
              target="_blank"
              rel="noopener noreferrer"
              to="https://www.meetup.com/all-things-web-react-html-css-javascript-tutoring/"
              className="shadow-lg shadow-black hover:transform-gpu hover:scale-105 transition-all duration-300 ease-in-out"
            >
              <img
                className="max-w-[80vw] max-h-[40vh] lg:w-[30vw]"
                src={images.allThingsWebCoverImage.src}
                alt={images.allThingsWebCoverImage.alt}
              />
            </Link>
          </div>
        </Frame>
      </Scene>
    </main>
  );
}

function SubHeadingLink({ className = '', children, ...props }: LinkProps) {
  return (
    <Link
      {...props}
      className={clsx(
        'underline decoration-text-allThingsWebOrange hover:text-allThingsWebPurple focus:text-allThingsWebPurple',
        className,
      )}
    >
      {children}
    </Link>
  );
}

function Scene({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <section className={clsx('scene relative w-full h-[100vh] overflow-y-scroll', className)}>{children}</section>;
}

type FrameProps = HTMLAttributes<HTMLDivElement>;

function Frame({ children, className, ...props }: FrameProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sectionRef.current) return;
    return onScrollTrigger(sectionRef.current, { threshold: 0.84 });
  }, []);
  return (
    <section {...props} ref={sectionRef} className={clsx('frame relative w-full h-[100vh]', className)}>
      {children}
    </section>
  );
}

type StarProps = {
  w: number;
  h: number;
  t: number;
  r: number;
};

function Star({ w, h, t, r }: StarProps) {
  return (
    <div
      className="star"
      style={{
        width: `${w}px`,
        height: `${h}px`,
        top: `${t}vh`,
        right: `${r}vw`,
      }}
    ></div>
  );
}
