'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { Img } from 'openimg/react';
import { type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode, useEffect, useMemo, useState } from 'react';
import { Book3DScene } from '~/components/models/book.tsx';
import { getFocusClasses } from '~/utilities/ariaClasses.ts';

type SubHeadingLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

function SubHeadingLink({ className = '', children, href, ...props }: SubHeadingLinkProps) {
  const classes = clsx(
    'underline decoration-text-allThingsWebOrange hover:text-allThingsWebPurple focus:text-allThingsWebPurple',
    className,
    getFocusClasses(true, 'focus-visible:ring-allThingsWebPurple'),
  );

  if (href.startsWith('#')) {
    return (
      <a href={href} {...props} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...props} className={classes}>
      {children}
    </Link>
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

type Star = {
  w: number;
  h: number;
  t: number;
  r: number;
};

function makeDeterministicStars(): Star[] {
  return Array.from({ length: 300 }, (_, index) => {
    const base = index + 1;
    const width = ((base * 17) % 30) / 10;
    const height = ((base * 23) % 30) / 10;
    const top = (base * 37) % 100;
    const right = (base * 53) % 100;

    return {
      w: width || 1,
      h: height || 1,
      t: top,
      r: right,
    };
  });
}

function Star({ w, h, t, r }: Star) {
  return (
    <div
      className="star"
      style={{
        width: `${w}px`,
        height: `${h}px`,
        top: `${t}vh`,
        right: `${r}vw`,
      }}
    />
  );
}

function BookModel() {
  const [is3DSupported, setIs3DSupported] = useState(false);

  useEffect(() => {
    setIs3DSupported(Boolean(globalThis.WebGLRenderingContext));
  }, []);

  if (!is3DSupported) {
    return (
      <Img
        className="max-w-[50vw] lg:max-w-[30vw] shadow-lg shadow-black"
        src="/full-stack-web-dev-with-remix-book-cover.png"
        alt="Full Stack Web Development with Remix book cover"
        width="562"
        height="694"
      />
    );
  }
  return (
    <div className="h-[40vh] lg:h-[30vh] xl:h-[60vh] wide:[80vh] max-h-[1200px] w-full">
      <Book3DScene />
    </div>
  );
}

type MeetupEvent = {
  id: string;
  name: string;
  description: string | null;
  url: string;
  startAt: string;
  endAt: string | null;
  timezone: string | null;
  coverUrl: string | null;
  location: string | null;
  isVirtual: boolean;
};

type MeetupsApiResponse = {
  events?: MeetupEvent[];
  error?: string;
};

function formatEventDate(event: MeetupEvent): string {
  const startAt = new Date(event.startAt);
  if (Number.isNaN(startAt.getTime())) {
    return 'Date to be announced';
  }

  const timeZone = event.timezone || 'America/Los_Angeles';
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
  });

  return `${dateFormatter.format(startAt)} at ${timeFormatter.format(startAt)}`;
}

function truncateDescription(description: string): string {
  if (description.length <= 160) {
    return description;
  }

  return `${description.slice(0, 157)}...`;
}

function MeetupEventCard({ event }: { event: MeetupEvent }) {
  return (
    <article className="w-full max-w-[560px] rounded-xl border border-white/20 bg-white/5 text-left overflow-hidden">
      {event.coverUrl ? (
        <img
          src={event.coverUrl}
          alt={event.name}
          className="h-48 w-full object-cover"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
      ) : null}
      <div className="p-4 lg:p-5 flex flex-col gap-3">
        <p className="text-allThingsWebOrange text-sm lg:text-base font-bold">{formatEventDate(event)}</p>
        <h3 className="text-xl lg:text-2xl text-white font-bold">{event.name}</h3>
        {event.location ? (
          <p className="text-white/80 text-sm lg:text-base">
            {event.location}
            {event.isVirtual ? ' (online)' : ''}
          </p>
        ) : null}
        {event.description ? <p className="text-white/70 text-sm lg:text-base">{truncateDescription(event.description)}</p> : null}
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className={clsx(
            'w-fit underline decoration-primary hover:decoration-secondary focus:decoration-secondary decoration-4 underline-offset-2 hover:underline-offset-1 text-white',
            getFocusClasses(true),
          )}
        >
          View event details
        </a>
      </div>
    </article>
  );
}

function MeetupEventsGrid({ title, events, emptyMessage }: { title: string; events: MeetupEvent[]; emptyMessage: string }) {
  return (
    <section className="w-full flex flex-col gap-4">
      <h3 className="text-white text-xl lg:text-2xl font-bold">{title}</h3>
      {events.length === 0 ? (
        <p className="text-white/70 text-base lg:text-lg">{emptyMessage}</p>
      ) : (
        <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-5">
          {events.map((event) => (
            <MeetupEventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}

export function HomePage() {
  const stars = useMemo(makeDeterministicStars, []);
  const [meetupEvents, setMeetupEvents] = useState<MeetupEvent[]>([]);
  const [isLoadingMeetups, setIsLoadingMeetups] = useState(true);
  const [meetupError, setMeetupError] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true;
    const abortController = new AbortController();

    async function fetchMeetups() {
      try {
        const response = await fetch('/api/luma/events', {
          method: 'GET',
          signal: abortController.signal,
          cache: 'no-store',
        });
        const data = (await response.json()) as MeetupsApiResponse;
        if (!response.ok) {
          throw new Error(data.error || `Failed to load events (${response.status})`);
        }

        if (!isSubscribed) {
          return;
        }
        setMeetupEvents(data.events ?? []);
        setMeetupError(null);
      } catch (error: unknown) {
        if (!isSubscribed || abortController.signal.aborted) {
          return;
        }
        const errorMessage = error instanceof Error ? error.message : 'Failed to load events';
        setMeetupError(errorMessage);
      } finally {
        if (isSubscribed) {
          setIsLoadingMeetups(false);
        }
      }
    }

    fetchMeetups();

    return () => {
      isSubscribed = false;
      abortController.abort();
    };
  }, []);

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = Date.now();
    const sortedEvents = [...meetupEvents].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

    return {
      upcomingEvents: sortedEvents.filter((event) => new Date(event.endAt || event.startAt).getTime() >= now),
      pastEvents: sortedEvents.filter((event) => new Date(event.endAt || event.startAt).getTime() < now).reverse(),
    };
  }, [meetupEvents]);

  return (
    <main className="w-full bg-black scroll-smooth">
      {stars.map((star, i) => (
        <Star key={i} {...star} />
      ))}
      <Frame className="frame-one text-center font-mono">
        <div className="min-h-[100vh] whitespace-normal lg:whitespace-nowrap flex flex-col items-center justify-center gap-4 lg:gap-8">
          <h1 className="frame-one-heading text-6xl lg:text-8xl xl:text-9xl text-allThingsWebPurple font-extrabold">
            All Things Web
          </h1>
          <p className="frame-one-subheading text-2xl lg:text-3xl xl:text-4xl text-allThingsWebOrange font-extrabold">
            Web Dev, <SubHeadingLink href="#book">Book</SubHeadingLink>, <SubHeadingLink href="#talks">Talks</SubHeadingLink>,{' '}
            <SubHeadingLink href="/blog">Blog Posts</SubHeadingLink>, <SubHeadingLink href="#meetups">Meetups</SubHeadingLink>
          </p>
          <div className="frame-one-subheading flex lg:flex-col items-center justify-center transform rotate-6 absolute top-8 lg:right-8">
            <Img
              alt="Andre smiles into the camera."
              src="/profile.png"
              className="w-10 lg:w-24 rounded-full mr-4 lg:mb-4"
              width="96"
              height="96"
            />
            <p className="handwritten font-extrabold text-4xl text-primary">By Andre Landgraf</p>
          </div>
        </div>
      </Frame>

      <Frame className="frame-two text-center font-mono" id="book">
        <div className="min-h-[100vh] mx-4 lg:mx-[10vw] flex items-center justify-center flex-col-reverse lg:flex-row gap-16 lg:gap-[10vw]">
          <div className="lg:max-w-[40vw] flex flex-col items-center justify-center gap-4 lg:gap-8">
            <h2 className="text-2xl lg:text-4xl text-packtOrange font-extrabold">Full Stack Web Development with Remix</h2>
            <p className="text-xl lg:text-2xl text-white font-bold">
              Learn how to build better React apps and progressively enhance the user experience with my favorite web
              framework!
            </p>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.amazon.com/Full-Stack-Development-Remix-production-ready/dp/1801075298"
              className={clsx(
                'w-full md:w-fit flex gap-2 justify-center items-center transform motion-safe:active:translate-y-px text-center font-semibold shadow-lg rounded-lg px-4 py-2 leading-relaxed text-2xl lg:text-4xl text-white bg-packtOrange transition-all duration-200 ease-in-out hover:scale-[102%]',
                getFocusClasses(true, 'focus:ring-white'),
              )}
            >
              Check it out now!
            </a>
          </div>
          <BookModel />
        </div>
      </Frame>

      <Frame className="text-center font-mono" id="talks">
        <div className="min-h-[100vh] w-full flex items-center justify-center flex-col gap-16">
          <div className="mx-4 lg:max-w-[800px] flex flex-col items-center justify-center gap-4 lg:gap-8">
            <h2 className="text-2xl lg:text-4xl text-white font-bold">Talks Playlist</h2>
          </div>
          <iframe
            className="w-full max-w-[1024px] aspect-video"
            src="https://www.youtube-nocookie.com/embed/videoseries?si=CMtx60tnTjTqIAUY&amp;controls=0&amp;list=PLdOXo8FX5YBRDh5uSYOsDIIXJaBtvVm51"
            title="YouTube video player with playlist"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </Frame>

      <Frame
        className="frame-four min-h-[100vh] text-center font-mono flex items-center justify-center flex-col gap-8 lg:gap-[10vh]"
        id="meetups"
      >
        <div className="mx-4 lg:max-w-[800px] flex flex-col items-center justify-center gap-4 lg:gap-8">
          <h2 className="text-2xl lg:text-4xl text-white font-bold">Bay Area Meetups</h2>
          <p className="text-white text-xl lg:text-2xl">
            Join monthly events about All Things Web. We organize monthly React and Remix meetups, hackathons, and more.
            Do not miss out on the fun! Check out more details on{' '}
            <a
              href="https://allthingsweb.dev?utm_source=andrelandgraf.dev"
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                'underline decoration-primary hover:decoration-secondary focus:decoration-secondary decoration-4 underline-offset-2 hover:underline-offset-1',
                getFocusClasses(true),
              )}
            >
              allthingsweb.dev
            </a>{' '}
            or our{' '}
            <a
              href="https://lu.ma/allthingsweb?utm_source=andrelandgraf.dev"
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                'underline decoration-primary hover:decoration-secondary focus:decoration-secondary decoration-4 underline-offset-2 hover:underline-offset-1',
                getFocusClasses(true),
              )}
            >
              Lu.ma calendar
            </a>
            .
          </p>
        </div>
        <div className="w-full mx-4 lg:mx-[10vw] max-w-[1280px]">
          {isLoadingMeetups ? <p className="text-white text-lg lg:text-xl">Loading events...</p> : null}
          {meetupError ? (
            <p className="text-white text-lg lg:text-xl">
              Could not load events right now. Check the{' '}
              <a
                href="https://lu.ma/allthingsweb?utm_source=andrelandgraf.dev"
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(
                  'underline decoration-primary hover:decoration-secondary focus:decoration-secondary decoration-4 underline-offset-2 hover:underline-offset-1',
                  getFocusClasses(true),
                )}
              >
                Lu.ma calendar
              </a>
              .
            </p>
          ) : null}
          {!isLoadingMeetups && !meetupError ? (
            <div className="w-full flex flex-col gap-8">
              <MeetupEventsGrid
                title="Upcoming events"
                events={upcomingEvents}
                emptyMessage="No upcoming events have been announced yet."
              />
              <MeetupEventsGrid title="Past events" events={pastEvents} emptyMessage="No past events were found." />
            </div>
          ) : null}
        </div>
      </Frame>
    </main>
  );
}
