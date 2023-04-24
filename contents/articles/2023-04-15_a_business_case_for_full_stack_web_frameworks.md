---
date: 2023-04-15
title: A business case for today's full stack web frameworks
description: Today's full stack web frameworks like Next.js and Remix provide application developers with primitives, conventions, and levers to build better web apps faster. This blog post lays out a business case for moving from a client-side SPA architecture to a full stack web framework.
categories: [React, Next.js, Remix.run, Web Development]
imageUrl: https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1682302824/andrelandgraf.dev/screenshot-web-page-test-lcp-client-side-vs-full-stack-apps.png
imageAltText: A screenshot of a diagram from WebPageTest results comparing different client-only and full stack app implementations. The full stack app implementations have lower Largest Contentful Paint (LCP) values.
---

## Motivation

Benjamin Franklin coined the phrase "time is money" and this phrase is still true today. Web performance directly impacts key business metrics such as bounce rates, engagement, conversions, page views, satisfaction, and revenue \[[1](https://developer.mozilla.org/en-US/docs/Learn/Performance/why_web_performance#improve_conversion_rates), [2](https://wpostats.com/)\].

Google reported that a half-second delay in page load time can result in a 20% drop in traffic \[[1](http://glinden.blogspot.com/2006/11/marissa-mayer-at-web-20.html)\]. A study by Renault shows that it is worth optimizing until the largest contentful paint (LCP) reaches below one second \[[1](https://web.dev/renault/)\].

Walmart saw a 2% increase in conversion rate for every one second improvement in page load time \[[1](https://www.cloudflare.com/learning/performance/more/website-performance-conversion-rates), [2](https://www.slideshare.net/devonauerswald/walmart-pagespeedslide)\]. Similarly, Mobify reports a 1.11% increase in conversion for each 100ms improvement \[[1](https://www.cloudflare.com/learning/performance/more/website-performance-conversion-rates)\].

Slow websites surpass attention spans and break the flow state. This negatively impacts the user experience and perception of time \[[1](https://www.smashingmagazine.com/2015/09/why-performance-matters-the-perception-of-time/)\].

Optimizing web performance is not trivial and conflicts with other goals. Web apps provide highly dynamic and personalized experiences and make heavy usage of image and video content. Today's web apps are powered by thousands of lines of code and megabytes of content and data. Optimizing these highly dynamic applications is a challenging task, especially considering the fast pace of today's product development cycles.

Today's full stack web frameworks can be used to build state-of-the-art web apps. They provide application developers with primitives, conventions, and levers to build better web apps faster.

Utilizing today's full stack web frameworks can improve the developer experience and productivity. The provided control over the web platform can further be used to build better user experiences.

## Performance-based analysis

This business case compares two React applications. One client-only single-page application (SPA) and one full stack web application.

![A diagram comparing a SPA architecture to a full stack web app](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto,w_800/v1682282664/andrelandgraf.dev/client-side-vs-full-stack-framework_dgepoy.png)

Both apps use the same component structure to render a list of movies fetched from [The Movie Database (TMDB) API](https://developers.themoviedb.org/3/getting-started/introduction). Both apps fetch 80 movies across different categories.

As visible in the screenshot below, the page content mostly contains of the movie images and some added text.

![Screenshot of demo movies app showing an overview page of popular movies](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto,w_800/v1681611558/andrelandgraf.dev/movies-app-screenshot_i8ifkc.png)

When working on a client-side only SPA, we have limited control over the web platform. We can only control the browser runtime and the client-side app. All API requests leave the control zone and are handled by third-party APIs. This means our web performance depends on other teams, departments, and companies.

![A diagram showing the control zone when working on a client-only SPA. The control zone includes the browser runtime and client-only app. It also includes the requests made from the frontend. However, all API requests leave the control zone and are handled by third-party APIs.](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto,w_500/v1682282727/andrelandgraf.dev/control-zone-client-side-spa_ct4ldm.png)

We argue that the full stack app unlocks the tools of the backend of the web platform. We further can access to a BFF (backend for frontend) environment that allows us to fetch data on the server and forward it to the client.

### Methodology

The business case compares the performance of a client-only SPA and a full stack web app.

The business case is divided into six sections. Each section focuses on a different dimension of how full stack web frameworks can improve performance.

The sections are:

1. Server-side rendering (SSR) and streaming
2. Server-side data fetching
3. Avoid overfetching
4. Use libraries to the server
5. Move JavaScript to the server
6. Caching

Each section compares the full stack and the SPA implementations by using the browser developer tools and lab tests of [core web vitals](https://web.dev/user-centric-performance-metrics/#important-metrics-to-measure). Each section contains a summary of the findings and documents how the measurements were taken.

For each section, a new version of the full stack app was created and compared to the client-side SPA. The new version was further compared to the previous version. This allows us to see the impact of each change.

Lab tests of web vitals were conducted to measure the performance of the apps. The lab tests were conducted for mobile both on localhost and by using [PageSpeed Insights](https://pagespeed.web.dev/) and [WebPageTest](https://www.webpagetest.org/). For all comparisons, five runs were conducted and the median was used as the result.

For every comparison, the client-only SPA was run five times again to ensure the measurements are taken at the same time. In total, the client-only SPA performance was measured on 20 runs on PageSpeed Insights and five runs on localhost.

The full stack app was run five times for five different versions on localhost (20 runs in total) and additionally five times each for eight different versions on PageSpeed Insights (40 runs in total).

All lab tests are documented in this [spreadsheet](https://res.cloudinary.com/andre-landgraf/raw/upload/v1682302186/andrelandgraf.dev/Client-side_vs._full_stack_React_apps_web_vital_tests_1_kjv695.xlsx).

All app versions are listed below:

- [(1) Client-only SPA](https://github.com/andrelandgraf/movies-react-spa)
- [Full stack app using Remix with Express.js](https://github.com/andrelandgraf/movies-react-full-stack-app):
  - [(2) Using client-side data fetching](https://github.com/andrelandgraf/movies-react-full-stack-app/tree/with-client-side-data-fetching)
  - [(3) Using server-side data fetching](https://github.com/andrelandgraf/movies-react-full-stack-app/tree/with-server-side-data-fetching)
  - [(4) With avoid overfetching](https://github.com/andrelandgraf/movies-react-full-stack-app/tree/with-filtering-overfetched-data)
  - [(5) With caching](https://github.com/andrelandgraf/movies-react-full-stack-app/tree/with-http-and-memory-caching)

The final version of the full stack app (5) with server-side data fetching, avoidance of overfetching, and caching is deployed on [render.com](https://render.com/) on a long-running server (Oregon, US) and compared to the client-only SPA on render's global CDN.

Version 5 was also deployed on [Vercel](https://vercel.com/) and compared to the client-only SPA on Vercel's global CDN using Remix's Vercel adapter: [(6) Full stack app using Remix with Vercel adapter](https://github.com/andrelandgraf/movies-react-full-stack-app/tree/everything-on-vercel). The Vercel version of the app was deployed on Vercel serverless and edge runtimes and compared to the client-only SPA on Vercel's global CDN.

Version 5 was also deployed together with Cloudflare's global CDN: [(7) With domain and cloudflare CDN in front of render.com](https://github.com/andrelandgraf/movies-react-full-stack-app/tree/main) and compared to render's global CDN deployment of the client-only SPA.

Version 5 was also re-implemented using Next.js and React Server Components: [(8) Full stack app using Next.js and React Server Components](https://github.com/andrelandgraf/movies-react-full-stack-app-with-rsc). The Next.js version was deployed on Vercel serverless and edge runtimes and compared to the client-only SPA on Vercel's global CDN.

Conclusively, lab tests were run both on [render.com](https://render.com/) and [Vercel](https://vercel.com/) and across different regions (Oregon, Washington, San Francisco) and different runtimes (long-running server, serverless, edge) to achieve more diverse results.

Depending on runtime, region, and version, the full stack apps showed different performance results. However, the full stack apps consistently outperformed the client-only SPA.

In the following, we will discuss the results of the lab tests and the findings of the business case.

### Server-Side rendering (SSR) and streaming

Today's full stack web frameworks provide server-side rendering (SSR) and streaming out of the box.

Server-side rendering allows us to pre-render the HTML on the server and send it to the client. This allows the client to render the HTML immediately and display the content to the user. With server-side rendering, we don't need to wait for the JavaScript to load and execute on the client before the content is displayed.

HTTP streaming is a technique that allows the server to stream data to the client. This can be used to send data to the client as it becomes available, rather than waiting for the entire response to be ready. This can improve the performance of your app by reducing the amount of time that the client needs to wait for data.

SSR and streaming may already significantly improve the performance of a web app.

![Screenshot of the visual comparison on WebPageTest showing how using server-side rendering and streaming reduces the Largest Contentful Paint by 0.5 seconds](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1682296021/andrelandgraf.dev/screenshot-web-page-test-client-only-spa-vs-full-stack-with-client-side-data-fetching.png)

A comparison on WebPageTest between the client-only SPA (1) and the full stack app with client-side data fetching (2) shows that server-side rendering and streaming may already reduce the Largest Contentful Paint (LCP) by as much as 0.5 seconds - from 5.7 seconds to 5.1 seconds \[[1](https://www.webpagetest.org/video/compare.php?tests=230423_BiDcS2_7QH%2C230423_BiDcR6_7QJ&thumbSize=150&ival=500&end=visual)\].

### Server-side data fetching

During the initial page load, Remix and Next.js server-side render the page. Both frameworks allow to fetch data on the server before rendering the page. This allows us to render dynamic content on the server before sending the HTML to the client.

The client-only SPA and version 2 of the full stack app use client-side data fetching with `react-query`. Here, the data fetching can only happen after the JavaScript bundle has been loaded and executed on the client. React renders an initial loading state until the data is available.

Server-side data fetching can improve web vitals by fetching data before the client-side JavaScript bundle is loaded and executed.

For instance, in [this particular test](https://www.webpagetest.org/video/compare.php?tests=230424_BiDcVN_HM%2C230424_BiDc0G_HN%2C230424_BiDcG9_HP&thumbSize=150&ival=500&end=visual) from WebPageTest, the following Largest Contentful Paint (LCP) times were measured:

- Client-only SPA (1): 5.2 seconds
- Full stack app with client-side data fetching (2): 5.1 seconds
- Full stack app with server-side data fetching (3): 3.0 seconds

The Time to Interactive (TTI) was also improved from 3.7 seconds to 2.6 seconds.

![Screenshot of the visual comparison on WebPageTest showing how using server-side data fetching reduces the Largest Contentful Paint by another 0.5 seconds](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1682297735/andrelandgraf.dev/screenshot-web-page-test-client-only-spa-vs-full-stack-apps-with-client-or-server-data-fetching.png)

When comparing the lab tests from this and the previous section, you may notice that the performance varies between different runs. There are a lot of factors that influence the performance of a web app. However, the full stack apps consistently outperformed the client-only SPA as visible in the average results \[[1](https://res.cloudinary.com/andre-landgraf/raw/upload/v1682288744/andrelandgraf.dev/Client-side_vs._full_stack_React_apps_web_vital_tests_u3kw4s.xlsx)\].

### Avoiding overfetching

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

For example, when only fetching the `id`, `title`, and `poster_path` attributes, the payload size is reduced from 15.3kB to 3kB for 80 movies (minified and gzipped).

```typescript
type Movie = {
  id: number;
  title: string;
  poster_path: string;
};
```

When applying the same optimization to all data fetching requests, the Largest Contentful Paint (LCP) time on localhost was reduced by 0.2 seconds on average.

The real world performance impact of this optimization depends on the type and amount of data as network payloads are compressed, which already reduces the payload size. However, it is safe to assume that the performance changes will always be positive.

### Moving libraries to the server

Moving large libraries to the server can reduce the size of the client bundle. This can improve the performance of your app by reducing the amount of data that needs to be transferred over the network.

For instance, when moving the data fetching to the server, we can remove the `react-query` dependency from the client bundle. This reduces the bundle size by 12kb (minified and gzipped) \[[1](https://bundlephobia.com/package/@tanstack/react-query@4.29.3)\].

Similarly, we can could move our GraphQL client or any other large library to the server and instead forward the data to the client using the full stack web framework's data fetching API.

### Moving JavaScript to the server

Moving JavaScript to the server can reduce the size of the client bundle. This can improve the performance of your app by reducing the amount of data that needs to be transferred over the network.

Servers are also generally more powerful than client devices. This means that they can perform more complex computations faster.

Additionally, for security and privacy reasons, it may be desirable to move some computations to the server. For instance, consider the following function that filters adult movies from a list of movies:

```javascript
export function filterAdultMovies(movies: Movie[]): Movie[] {
  return movies.filter((movie) => !movie.adult);
}
```

Should this function be executed on the user's device or on the server? We can avoid overfetching by filtering the data on the server before forwarding it to the client. Additionally, we can avoid downloading adult content to the user's device. Finally, we can avoid adding the JavaScript code to the client bundle.

The code base for this example app is rather small. However, in a real-world application, the code base can grow to hundreds of thousands of lines of code. We can avoid downloading unnecessary code to the client by moving the execution to the server.

When utilizing a full stack web framework to run JavaScript on the server, we stay in control of the business logic and avoid moving it to another team's downstream service.

### Caching

When having control over the web server, you can implement caching strategies. This can improve the performance of your app by reducing the amount of data that needs to be transferred over the network.

Caching can be used to reduce request waterfalls introduced by data dependencies.

There are several caching strategies that can be implemented on the server.

- HTTP caching headers
- In-memory caching
- Caching services such as Redis

Version 5 of the full stack web app adds HTTP caching headers to the data fetching requests for the movies data and movie database config object.

The movie database config is further not user-specific and also stored in-memory on the server.

Mostly, caching may improve performance for repeat visits. However, in-memory caching and caching via CDN can also improve the performance of the first visit.

![Screenshot of the visual comparison on WebPageTest showing how using caching reduces the Largest Contentful Paint by another ca. 0.1 seconds](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1682300794/andrelandgraf.dev/screenshot-web-page-test-client-only-spa-vs-full-stack-apps-with-and-without-caching.png)

In this example, the performance improvements are rather small \[[1](https://www.webpagetest.org/video/compare.php?tests=230424_AiDcZ8_QK%2C230424_BiDcRF_QQ%2C230424_AiDcZT_QM&thumbSize=150&ival=500&end=visual)\]. In a real-world application, the performance improvements can be more significant.

## Summary

Using a full stack web framework can have significant performance improvements over a client-only SPA. Employing server-side rendering, streaming, and data fetching in particular can heavily improve the performance of your app.

Depending on your application, avoidance of overfetching, moving libraries to the server, moving JavaScript to the server, and caching can further improve the performance of your app.

This business case compares client-only SPAs deployed on global CDNs with full stack web apps deployed in different regions and globally on the edge. The comparison further includes lab tests using different full stack web frameworks (Next.js and Remix). The lab tests were conducted on localhost, PageSpeed Insights, and WebPageTest. The full stack apps were deployed on long-running servers, serverless, and edge runtimes.

In all cases, the full stack web apps outperform the client-only SPAs \[[1](https://www.webpagetest.org/video/compare.php?tests=230424_AiDc85_2TT%2C230424_AiDc4M_2TV%2C230424_AiDc41_2TW%2C230424_BiDcJQ_2T5%2C230424_AiDcGW_2TX)\].

![Screenshot of the Largest Contentful Paint results of one WebPageTest visual comparison between different SPA and full stack versions](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1682302824/andrelandgraf.dev/screenshot-web-page-test-lcp-client-side-vs-full-stack-apps.png)

![Screenshot of the Time to Interactive results of one WebPageTest visual comparison between different SPA and full stack versions](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1682302824/andrelandgraf.dev/screenshot-web-page-test-tti-client-side-vs-full-stack-apps.png)

Taking the median across all locations and runtimes, the full stack web apps (Remix, Next.js) achieved 0.8 and 1.7 seconds faster Largest Contentful Paint (LCP) times than the client-only SPAs. They (Remix, Next.js) further achieved an improvement of the Lighthouse Speed Index of 0.55 and 0.3 seconds.

Conclusively, a migration to a full stack web framework can improve the performance of your app significantly. Deploying server-side rendering and streaming (which comes out of the box) alone may provide performance benefits. Fetching data on the server further significantly improves the performance.

When considering that

## Limitations

A business case should always be take your own organization's structure, use cases, current stacks, and infrastructure into account.

This business case compares a client-only SPA with a full stack web app. Downstream services are assumed to be owned by other teams or departments. Conclusively, most of the arguments base on the assumption that the frontend team does not currently own the web server or a BFF API server environment.

The measurements in this business case are based on lab tests. Lab tests can be used as a baseline to compare different implementations. However, they do not reflect the real-world performance of your app.

A more accurate way to measure the performance of your app is to run A/B tests in production. This allows you to measure the performance of your app in real-world conditions.

On the other side, A/B tests are more complex to set up. They require that you deploy a production environment using the full stack web framework.

An iterative business case could make use of lab tests to achieve initial buy-in and then use A/B tests to measure the performance of a full stack app MVP in production.

Conclusively, this business case should be used as a blueprint or baseline to conduct a personalized business case in your own organization, using your own applications and infrastructure.

## Further reading

You can learn more about web vitals on the [web.dev](https://web.dev/vitals/) website.

You can read more about the benefits of owning the full stack of the web platform in this blog post: "[The full stack of the web platform](blog/2023-03-25_the_full_stack_of_the_web_platform.md)".

I discuss the benefits of full stack web frameworks in more detail in "[The time to go full stack is now!](blog/2023-03-26_the_time_to_go_full_stack_is_now.md)".
