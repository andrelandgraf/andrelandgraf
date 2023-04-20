---
date: 2023-04-15
title: A business case for today's full stack web frameworks
description: Web performance directly impacts key business metrics. Today's full stack web frameworks provide application developers with primitives, conventions, and levers to build better web apps faster. This blog post lays out a business case for today's full stack web frameworks.
categories: [React, Next.js, Remix.run, Web Development]
ignore: true
---

## Motivation

Benjamin Franklin coined the phrase "time is money". This phrase is still true today.

Web performance directly impacts key business metrics such as bounce rates, engagement, conversions, page views, satisfaction, and revenue \[[1](https://developer.mozilla.org/en-US/docs/Learn/Performance/why_web_performance#improve_conversion_rates), [2](https://wpostats.com/)\].

Slow websites surpass attention spans and break the flow state. This negatively impacts the user experience and perception of time \[[1](https://www.smashingmagazine.com/2015/09/why-performance-matters-the-perception-of-time/)\].

Google reported that a half-second delay in page load time can result in a 20% drop in traffic \[[1](http://glinden.blogspot.com/2006/11/marissa-mayer-at-web-20.html)\].

On the flip side, Walmart saw a 2% increase in conversion rate for every 1 second improvement in page load time \[[1](https://www.cloudflare.com/learning/performance/more/website-performance-conversion-rates), [2](https://www.slideshare.net/devonauerswald/walmart-pagespeedslide)\]. Similarly, Mobify reports a 1.11% increase in conversion for each 100ms improvement \[[1](https://www.cloudflare.com/learning/performance/more/website-performance-conversion-rates)\].

A study by Renault shows that it is worth optimizing until the largest contentful paint (LCP) reaches below 1 second \[[1](https://web.dev/renault/)\].

It is worth it to optimize web performance. Unfortunately, optimizing web performance is not trivial and conflicts with other goals. Web apps provide highly dynamic and personalized experiences and make heavy usage of image and video content. Today's web apps are powered by thousands of lines of code and megabytes of content. Optimizing these highly dynamic applications is a challenging task, especially considering the fast pace of today's product development cycles.

Today's full stack web frameworks can be used to build state-of-the-art web apps. They provide application developers with primitives, conventions, and levers to build better web apps faster.

Utilizing today's full stack web frameworks can improve the developer experience and productivity. The provided control over the web platform can further be used to build better user experiences.

Full stack web apps provide a great amount of flexibility and can be used to build a wide range of apps.

## Performance-based analysis

### Disclaimer

This business case is intended to provide performance-based business incentives for adopting full stack web frameworks. You can use this business case in case you think you would benefit from the performance improvements that full stack web frameworks provide.

This business case is meant to be generic so it is helpful to more developers. However, it is important to highlight that there are many ways to build for the web and there is no one-size-fit-all solution. Many of the performance benefits discussed in this blog post can also be achieved with other technologies and tech stacks.

There are many great frameworks and libraries to choose from. As always, it comes down to the tradeoffs you're willing to make and the use case you're trying to solve.

### Methodology

This business case compares two React applications. One client-only single-page application (SPA) and one full stack web application.

![A diagram comparing a SPA architecture to a full stack web app](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1681607560/andrelandgraf.dev/client-side-vs-full-stack-framework_c3htgx.png)

Both apps use the same component structure to render a list of movies fetched from [The Movie Database (TMDB) API](https://developers.themoviedb.org/3/getting-started/introduction).

![Screenshot of demo movies app showing an overview page of popular movies](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1681611558/andrelandgraf.dev/movies-app-screenshot_i8ifkc.png)

The business case is divided into seven sections that each focus on a different dimension of how full stack web frameworks can improve the performance.

Each section compares the full stack and the SPA implementations by using lighthouse scores of [core web vitals](https://web.dev/user-centric-performance-metrics/#important-metrics-to-measure) gathered on localhost. For each comparison, 5 lighthouse scores are averaged.

The identified performance improvements are tied to business metrics that can be used to make a business case for today's full stack web frameworks.

### Overfetching

Overfetching happens if an application fetches more data than it requires. Overfetching increases the payload size and leads to slower load times, especially on mobile networks such as 3G.

For instance, when rendering movie cards on a movie overview page,

```javascript
export function MovieCard({ id, title, imageProps }) {
    return (
        <li>
            <Link to={`/movies/${id}`}>
                <img {...imageProps}>
                {title}
            </Link>
        </li>
    )
}
```

We have to fetch the movie `id`, `title`, and `poster_path` attributes for each movie.

By default, the TMDB API returns the following data for every movie:

```typescript
type Movie = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};
```

Overfetching can be avoided by filtering the data on the server before forwarding it to the client or by using a query language such as GraphQL to only fetch what is needed.

Full stack web frameworks provide access to the web server. They naturally implement the BFF (backend for frontend) pattern \[[1](https://remix.run/docs/en/main/guides/bff)\] and allow us to fetch on the server and filter out unnecessary data before forwarding it to the client.

Today's full stack web frameworks allow the frontend team to own the decision what data to fetch without the need to introduce GraphQL to all downstream services or to maintain a separate BFF API server environment.

### Reduce request waterfalls

**Description**

Request waterfalls occur when requests are blocked by other requests. This can happen when fetching data on a component-by-component basis. Nested components may get blocked by their parent components.

**Metrics**

**Movies App Example**

**Steps to evaluate**

**Impact on business metrics**

### Moving heavy computation to the server

**Description**

Servers are generally more powerful than client devices. This means that they can perform more complex computations faster.

### Moving large libraries to the server

**Description**

Moving large libraries to the server can reduce the size of the client bundle. This can improve the performance of your app by reducing the amount of data that needs to be transferred over the network.

### Take advantage of HTTP streaming

**Description**

HTTP streaming is a technique that allows the server to stream data to the client. This can be used to send data to the client as it becomes available, rather than waiting for the entire response to be ready. This can improve the performance of your app by reducing the amount of time that the client needs to wait for data.

### Avoid client-side redirects

**Description**

Client-side redirects can be used to redirect the user to a different page without reloading the page. This can be useful for improving the user experience, but it can also be a performance problem. Client-side redirects can cause the browser to make additional requests to the server, which can slow down the app.

### Cache on the server

**Description**

When having control over the web server, you can use it to implement caching strategies. This can improve the performance of your app by reducing the amount of data that needs to be transferred over the network.

## Limitations

This business case is meant to be generic to serve as a baseline for as many developers as possible. However, the results gathered in this business case should merley be seen as an illustration for how full stack web frameworks can improve performance.

The lighthouse scores have been gathered on localhost. The goal was to isolate the comparisions as much as possible and not to compare different hosting providers. However, the choice of hosting provider and environment probably has a much more severe impact on the web performance than the points outlined in this blog post.

Conclucivly, this business case should be used as a blueprint or baseline to conduct a personalized business case in your own organization, using your own infrastructure options, and keeping your own use case in mind.

## Further reading

You can read more about the benefits of owning the full stack of the web platform in this blog post: "[The full stack of the web platform](blog/2023-03-25_the_full_stack_of_the_web_platform.md)".

I discuss the benefits of full stack web frameworks in more detail in "[The time to go full stack is now!](blog/2023-03-26_the_time_to_go_full_stack_is_now.md)".
