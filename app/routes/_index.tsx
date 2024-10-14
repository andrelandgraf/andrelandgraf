import type { HeadersFunction, LinksFunction, MetaFunction } from '@remix-run/node';
import { type LinkProps } from '@remix-run/react';
import clsx from 'clsx';
import { type HTMLAttributes, useEffect, useState } from 'react';
import { ButtonLink } from '~/components/buttons/index.tsx';
import { StyledLink, UnstyledLink } from '~/components/links.tsx';
import { Book3DScene } from '~/components/models/book.tsx';
import { PageTransitionProgressBar } from '~/components/progress.tsx';
import { getFocusClasses } from '~/utilities/ariaClasses.ts';
import { images } from '~/utilities/images.ts';
import { getMetaTags } from '~/utilities/metaTags.ts';
// @ts-ignore comment
import indexStyles from '~/styles/index.css?url';

export const config = { runtime: 'edge' };

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: indexStyles }];

export const headers: HeadersFunction = () => {
  return {
    'cache-control': 'public, max-age=3600',
  };
};

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'Homepage',
    description:
      'Hey there, this is my personal website & blog. I use this site to try out new things, share my knowledge, and document my journey. I hope you find something useful here!',
  });
};

export default function Component() {
  const stars = Array.from({ length: 300 }, () => ({
    w: Math.random() * 3,
    h: Math.random() * 3,
    t: Math.random() * 100,
    r: Math.random() * 100,
  }));
  return (
    <>
      <PageTransitionProgressBar
        toColor='to-allThingsWebOrange'
        fromColor='from-allThingsWebPurple'
        toColorDark='to-allThingsWebOrange'
        fromColorDark='from-allThingsWebPurple'
      />
      <main className='w-full bg-black scroll-smooth'>
        {stars.map((star, i) => <Star key={i} {...star} />)}
        <Frame className='frame-one text-center font-mono'>
          <div className='min-h-[100vh] whitespace-normal lg:whitespace-nowrap flex flex-col items-center justify-center gap-4 lg:gap-8'>
            <h1 className='frame-one-heading text-6xl lg:text-8xl xl:text-9xl text-allThingsWebPurple font-extrabold'>
              All Things Web
            </h1>
            <p className='frame-one-subheading text-2xl lg:text-3xl xl:text-4xl text-allThingsWebOrange font-extrabold'>
              Web Dev, <SubHeadingLink to='#book'>Book</SubHeadingLink>,{' '}
              <SubHeadingLink to='#talks'>Talks</SubHeadingLink>, <SubHeadingLink to='/blog'>Blog Posts</SubHeadingLink>
              , <SubHeadingLink to='#meetups'>Meetups</SubHeadingLink>
            </p>
            <div className='frame-one-subheading flex lg:flex-col items-center justify-center transform rotate-6 absolute top-8 lg:right-8'>
              <img
                alt="Andre smiles into the camera."
                src="img/public/profile.png?w=96&h=96"
                className='w-10 lg:w-24 rounded-full mr-4 lg:mb-4'
                width="96"
                height="96"
              />
              <p className='handwritten font-extrabold text-4xl text-primary'>By Andre Landgraf</p>
            </div>
          </div>
        </Frame>
        <Frame className='frame-two text-center font-mono' id='book'>
          <div className='min-h-[100vh] mx-4 lg:mx-[10vw] flex items-center justify-center flex-col-reverse lg:flex-row gap-16 lg:gap-[10vw]'>
            <div className='lg:max-w-[40vw] flex flex-col items-center justify-center gap-4 lg:gap-8'>
              <h2 className='text-2xl lg:text-4xl text-packtOrange font-extrabold'>
                Full Stack Web Development with Remix
              </h2>
              <p className='text-xl lg:text-2xl text-white font-bold'>
                Learn how to build better React apps and progressively enhance the user experience with my favorite web
                framework!
              </p>
              <ButtonLink
                target='_blank'
                rel='noopener noreferrer'
                to='https://www.amazon.com/Full-Stack-Development-Remix-production-ready/dp/1801075298'
                overrides={{
                  colorClassName:
                    'text-white bg-packtOrange transform hover:scale-[102%] transition-all duration-200 ease-in-out',
                  focusRingColorClassName: 'focus:ring-white',
                  hoverRingColorClassName: 'hover:ring-white',
                  textSizeClassName: 'text-2xl lg:text-4xl',
                }}
              >
                Check it out now!
              </ButtonLink>
            </div>
            <BookModel />
          </div>
        </Frame>
        <Frame className='text-center font-mono' id='talks'>
          <div className='min-h-[100vh] w-full flex items-center justify-center flex-col gap-16'>
            <div className='mx-4 lg:max-w-[800px] flex flex-col items-center justify-center gap-4 lg:gap-8'>
              <h2 className='text-2xl lg:text-4xl text-white font-bold'>Talks Playlist</h2>
            </div>
            <iframe
              className='w-full max-w-[1024px] aspect-video'
              src='https://www.youtube-nocookie.com/embed/videoseries?si=CMtx60tnTjTqIAUY&amp;controls=0&amp;list=PLdOXo8FX5YBRDh5uSYOsDIIXJaBtvVm51'
              title='YouTube video player with playlist'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            >
            </iframe>
          </div>
        </Frame>
        <Frame
          className='frame-four min-h-[100vh] text-center font-mono flex items-center justify-center flex-col gap-8 lg:gap-[10vh]'
          id='meetups'
        >
          <div className='mx-4 lg:max-w-[800px] flex flex-col items-center justify-center gap-4 lg:gap-8'>
            <h2 className='text-2xl lg:text-4xl text-white font-bold'>Bay Area Meetups</h2>
            <p className='text-white text-xl lg:text-2xl'>
              Join monthly events about All Things Web. We organize monthly React & Remix meetups, hackathons, and more.
              Don't miss out on the fun! Check out upcoming events on{' '}
              <StyledLink
                to='https://allthingsweb.dev?utm_source=andrelandgraf.dev'
                target='_blank'
                rel='noopener noreferrer'
              >
                allthingsweb.dev
              </StyledLink>{' '}
              or our{' '}
              <StyledLink
                to='https://lu.ma/allthingsweb?utm_source=andrelandgraf.dev'
                target='_blank'
                rel='noopener noreferrer'
              >
                Lu.ma calendar
              </StyledLink>
              .
            </p>
          </div>
          <div className='w-full mx-4 lg:mx-[10vw] flex items-center justify-center flex-col lg:flex-row gap-8 lg:gap-[10vh]'>
            <iframe
              src='https://lu.ma/embed/calendar/cal-3AAimKnRVQEId4r/events?'
              style={{ width: '100%', height: '400px', border: 'none' }}
              className='w-full h-[400px] lg:h-[800px] max-w-[1024px] rounded-md'
              aria-hidden='false'
            >
            </iframe>
          </div>
        </Frame>
      </main>
    </>
  );
}

function SubHeadingLink({ className = '', children, to, ...props }: LinkProps) {
  return (
    <UnstyledLink
      to={to}
      prefetch='intent'
      outline='none'
      {...props}
      className={clsx(
        'underline decoration-text-allThingsWebOrange hover:text-allThingsWebPurple focus:text-allThingsWebPurple',
        className,
        getFocusClasses(true, 'focus-visible:ring-allThingsWebPurple'),
      )}
    >
      {children}
    </UnstyledLink>
  );
}

type FrameProps = HTMLAttributes<HTMLDivElement>;

function Frame({ children, className, ...props }: FrameProps) {
  return (
    <section {...props} className={clsx('frame relative w-full p-2', className)}>
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
      className='star'
      style={{
        width: `${w}px`,
        height: `${h}px`,
        top: `${t}vh`,
        right: `${r}vw`,
      }}
    >
    </div>
  );
}

function BookModel() {
  const [is3DSupported, setIs3DSupported] = useState(false);

  useEffect(() => {
    setIs3DSupported(!!globalThis.WebGLRenderingContext);
  }, []);

  if (!is3DSupported) {
    return (
      <img
        className='max-w-[50vw] lg:max-w-[30vw] shadow-lg shadow-black'
        src="/img/public/full-stack-web-dev-with-remix-book-cover.png?w=562&h=694"
        alt="Full Stack Web Development with Remix book cover"
        width="562"
        height="1387"
        loading='lazy'
      />
    );
  }
  return (
    <div className='h-[40vh] lg:h-[30vh] xl:h-[60vh] wide:[80vh] max-h-[1200px] w-full'>
      <Book3DScene />
    </div>
  );
}
