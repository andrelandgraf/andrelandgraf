---
date: 2023-04-15
title: A business case for today's full stack web frameworks
description: Today's full stack web frameworks like Next.js and Remix provide application developers with primitives, conventions, and levers to build more performant web apps. This blog post outlines a business case for going full stack from a client-only SPA architecture.
categories: [React, Next.js, Remix.run, Web Development]
imageUrl: https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1682302824/andrelandgraf.dev/screenshot-web-page-test-lcp-client-side-vs-full-stack-apps.png
imageAltText: A screenshot of a diagram from WebPageTest results comparing different client-only and full stack app implementations. The full stack app implementations have lower Largest Contentful Paint (LCP) values.
---

## Motivation

Benjamin Franklin coined the phrase "time is money" which is still true today. Web performance directly impacts key business metrics such as bounce rate, engagement, conversions, page views, satisfaction, and revenue \[[1](https://developer.mozilla.org/en-US/docs/Learn/Performance/why_web_performance#improve_conversion_rates), [2](https://wpostats.com/)\].

Google reported that a half-second delay in page load time can result in a 20% drop in traffic \[[3](http://glinden.blogspot.com/2006/11/marissa-mayer-at-web-20.html)\]. A study by Renault shows that it is worth optimizing until the largest contentful paint (LCP) reaches below one second \[[4](https://web.dev/renault/)\].

Walmart saw a 2% increase in conversion rate for every one-second improvement in page load time \[[5](https://www.cloudflare.com/learning/performance/more/website-performance-conversion-rates), [6](https://www.slideshare.net/devonauerswald/walmart-pagespeedslide)\]. Similarly, Mobify reports a 1.11% increase in conversions for each 100ms improvement \[[5](https://www.cloudflare.com/learning/performance/more/website-performance-conversion-rates)\].

Slow websites surpass attention spans and break the flow state. This negatively impacts the user experience \[[7](https://www.smashingmagazine.com/2015/09/why-performance-matters-the-perception-of-time/)\]. Users are more likely to ditch your website if they get distracted or frustrated.

Optimizing web performance is not trivial and conflicts with other goals. Web apps provide highly dynamic and personalized experiences powered by thousands of lines of code and megabytes of content and user data. Optimizing highly dynamic applications is a challenging task, especially considering the fast pace of today's product development cycles.

Today's full stack web frameworks can be used to build state-of-the-art web apps. They provide application developers with primitives, conventions, and levers to build better web apps faster. Utilizing today's full stack web frameworks can improve the developer experience and productivity. The provided control over the web platform can further be used to build more performant user experiences.

This article documents a performance-based business case to go full stack and showcases how today's full stack web frameworks can improve performance by utilizing the tools of the web platform.

## Performance-based business case

This business case compares the performance of client-only single-page applications (SPAs) deployed on global CDNs with full stack web apps deployed on long-running server, serverless, and edge runtimes. The comparison includes lab tests using Lighthouse, PageSpeed Insights, and WebPageTest.

Across the board, the full stack web apps outperform the client-only SPAs. For instance, [this test run from WebPageTest](https://www.webpagetest.org/video/compare.php?tests=230424_AiDc85_2TT%2C230424_AiDc4M_2TV%2C230424_AiDc41_2TW%2C230424_BiDcJQ_2T5%2C230424_AiDcGW_2TX) showcases how both a Remix and a Next.js app outperform their SPA counterparts.

![Screenshot of the Largest Contentful Paint results of one WebPageTest visual comparison between different SPA and full stack versions](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1682302824/andrelandgraf.dev/screenshot-web-page-test-lcp-client-side-vs-full-stack-apps.png)

![Screenshot of the Time to Interactive results of one WebPageTest visual comparison between different SPA and full stack versions](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1682302824/andrelandgraf.dev/screenshot-web-page-test-tti-client-side-vs-full-stack-apps.png)

### The demo app

The apps used in this business case are demo applications. All implementations (client-only, Remix, Next.js) use the same component structure to render a grid of 80 movies fetched from [The Movie Database (TMDB) API](https://developers.themoviedb.org/3/getting-started/introduction).

As visible in the screenshot below, the page content mostly contains of movie images, titles, and some additional information.

![Screenshot of demo movies app showing an overview page of popular movies](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto,w_800/v1681611558/andrelandgraf.dev/movies-app-screenshot_i8ifkc.png)

The demo app only has one route. This business case only focuses on the lab test performance of the initial page load.

### Measurements

Lab tests of [web vitals](https://web.dev/user-centric-performance-metrics/#important-metrics-to-measure) were conducted to measure the performance of the apps. The lab tests simulate mobile devices via [Google Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/), [PageSpeed Insights](https://pagespeed.web.dev/) and [WebPageTest](https://www.webpagetest.org/).

For all comparisons, five runs were conducted, and the median is used as the result. All performed lab tests are documented in this [spreadsheet](https://docs.google.com/spreadsheets/d/1Pt2FP9lN0xYvvm3tyLoXhlC8jKyyh86FxuBtbryr1Nk/?usp=sharing).

The lab tests focus on the four web vitals First Contentful Paint (FCP), Largest Contentful Paint (LCP), Total Blocking Time (TBT), and Speed Index. FCP, LCP and the Speed Index are measured in seconds, TBT in milliseconds.

You can learn more about the different web vitals on the [web.dev](https://web.dev/vitals/) website.

### Lab test 1: Regionally deployed Remix app on long-running server

For this section, the client-only SPA is deployed on [render.com](https://render.com/) on a global CDN. The implementation can be found here: [(1) Client-only SPA](https://github.com/andrelandgraf/movies-react-spa).

The full stack web app uses Remix with the Express.js adapter and runs on a long-running server on render.com (Oregon, US). The implementation can be found here: [Full stack app using Remix with Express.js](https://github.com/andrelandgraf/movies-react-full-stack-app/tree/with-http-and-memory-caching).

#### Lighthouse

This lab test was conducted on a MacBook Pro in Cupertino, California using Lighthouse (Mobile) on Chrome (Guest Profile).

Five Lighthouse runs were conducted for both the client-side-only SPA and the Remix app and the medium was taken.

```table
<table class="border-collapse">
  <tr>
    <th class="p-2 border border-gray-300">Web Vitals</th>
    <th class="p-2 border border-gray-300">Client-only SPA</th>
    <th class="p-2 border border-gray-300">Full Stack App</th>
    <th class="p-2 border border-gray-300 font-bold">Difference</th>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">FCP</td>
    <td class="p-2 border border-gray-300">1.4</td>
    <td class="p-2 border border-gray-300">1.3</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.1</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">LCP</td>
    <td class="p-2 border border-gray-300">8.4</td>
    <td class="p-2 border border-gray-300">2.1</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-6.3</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">TBT</td>
    <td class="p-2 border border-gray-300">140</td>
    <td class="p-2 border border-gray-300">60</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-80</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">Speed Index</td>
    <td class="p-2 border border-gray-300">1.9</td>
    <td class="p-2 border border-gray-300">1.6</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.3</td>
  </tr>
</table>
```

As visible in the results, the regionally deployed full stack web app outperforms the client-only SPA in all four web vital measurements. It can be noted that the Largest Contentful Paint significantly improves by 6.3 seconds.

#### PageSpeed Insights

This lab test was conducted using PageSpeed Insights (Mobile). Five test runs were conducted for both the client-side-only SPA and the Remix app and the medium was taken.

```table
<table class="border-collapse">
  <tr>
    <th class="p-2 border border-gray-300">Web Vitals</th>
    <th class="p-2 border border-gray-300">Client-only SPA</th>
    <th class="p-2 border border-gray-300">Full Stack App</th>
    <th class="p-2 border border-gray-300 font-bold">Difference</th>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">FCP</td>
    <td class="p-2 border border-gray-300">1.3</td>
    <td class="p-2 border border-gray-300">1</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.3</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">LCP</td>
    <td class="p-2 border border-gray-300">7.1</td>
    <td class="p-2 border border-gray-300">6.5</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.6</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">TBT</td>
    <td class="p-2 border border-gray-300">280</td>
    <td class="p-2 border border-gray-300">170</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-110</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">Speed Index</td>
    <td class="p-2 border border-gray-300">2.5</td>
    <td class="p-2 border border-gray-300">1.9</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.6</td>
  </tr>
</table>
```

As visible in the results, the regionally deployed full stack web app outperforms the client-only SPA in all four web vital measurements.

#### WebPageTest

This lab test was conducted using WebPageTest (Mobile). The requests were performed from a mobile device in Virginia with a 4G network connection.

Five test runs were conducted for both the client-side-only SPA and the Remix app and the medium was taken.

```table
<table class="border-collapse">
  <tr>
    <th class="p-2 border border-gray-300">Web Vitals</th>
    <th class="p-2 border border-gray-300">Client-only SPA</th>
    <th class="p-2 border border-gray-300">Full Stack App</th>
    <th class="p-2 border border-gray-300 font-bold">Difference</th>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">FCP</td>
    <td class="p-2 border border-gray-300">2.256</td>
    <td class="p-2 border border-gray-300">2.198</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.058</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">LCP</td>
    <td class="p-2 border border-gray-300">6.228</td>
    <td class="p-2 border border-gray-300">3.699</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-2.529</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">TBT</td>
    <td class="p-2 border border-gray-300">591</td>
    <td class="p-2 border border-gray-300">0</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-591</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">Speed Index</td>
    <td class="p-2 border border-gray-300">4.824</td>
    <td class="p-2 border border-gray-300">2.542</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-2.282</td>
  </tr>
</table>
```

As visible in the results, the regionally deployed full stack web app outperforms the client-only SPA in all four web vital measurements. It can be noted that the Largest Contentful Paint and the Speed Index improved by over 2 seconds each.

### Lab test 2: Regionally deployed Remix app on serverless function

For this section, the client-only SPA is deployed on [Vercel](https://vercel.com/) on a global CDN. The implementation can be found here: [(1) Client-only SPA](https://github.com/andrelandgraf/movies-react-spa).

The full stack web app uses Remix with the Vercel adapter and runs on a serverless function on Vercel. The implementation can be found here: [Full stack app using Remix on Vercel](https://github.com/andrelandgraf/movies-react-full-stack-app/tree/everything-on-vercel).

#### PageSpeed Insights with function in Washington, US (iad1)

This lab test was conducted using PageSpeed Insights (Mobile). The serverless function on Vercel is deployed in Washington, US (iad1).

Five test runs were conducted for both the client-side-only SPA and the Remix app and the medium was taken.

```table
<table class="border-collapse">
  <tr>
    <th class="p-2 border border-gray-300">Web Vitals</th>
    <th class="p-2 border border-gray-300">Client-only SPA</th>
    <th class="p-2 border border-gray-300">Full Stack App</th>
    <th class="p-2 border border-gray-300 font-bold">Difference</th>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">FCP</td>
    <td class="p-2 border border-gray-300">1.4</td>
    <td class="p-2 border border-gray-300">1.1</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.3</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">LCP</td>
    <td class="p-2 border border-gray-300">5.8</td>
    <td class="p-2 border border-gray-300">7</td>
    <td class="p-2 border border-gray-300 font-bold text-red">1.2</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">TBT</td>
    <td class="p-2 border border-gray-300">430</td>
    <td class="p-2 border border-gray-300">210</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-220</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">Speed Index</td>
    <td class="p-2 border border-gray-300">1.9</td>
    <td class="p-2 border border-gray-300">1.5</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.4</td>
  </tr>
</table>
```

As visible in the results, the regionally deployed full stack web app has a better FCP, TBT and Speed Index. However, the client-only SPA shows a better medium LCP.

The full stack web app shows a LCP that is 1.2 seconds higher than the LCP of the client-side-only SPA, presumably because the regionally deployed full stack app is located further away.

#### PageSpeed Insights with function in San Francisco, US (sfo1)

This lab test was conducted using PageSpeed Insights (Mobile). The serverless function on Vercel is deployed in San Francisco, US (sfo1).

Five test runs were conducted for both the client-side-only SPA and the Remix app and the medium was taken.

```table
<table class="border-collapse">
  <tr>
    <th class="p-2 border border-gray-300">Web Vitals</th>
    <th class="p-2 border border-gray-300">Client-only SPA</th>
    <th class="p-2 border border-gray-300">Full Stack App</th>
    <th class="p-2 border border-gray-300 font-bold">Difference</th>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">FCP</td>
    <td class="p-2 border border-gray-300">1.4</td>
    <td class="p-2 border border-gray-300">1.4</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.4</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">LCP</td>
    <td class="p-2 border border-gray-300">8</td>
    <td class="p-2 border border-gray-300">8</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-1</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">TBT</td>
    <td class="p-2 border border-gray-300">480</td>
    <td class="p-2 border border-gray-300">480</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-220</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">Speed Index</td>
    <td class="p-2 border border-gray-300">2</td>
    <td class="p-2 border border-gray-300">2</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.6</td>
  </tr>
</table>
```

As visible in the results, the regionally deployed full stack web app outperforms the client-only SPA in all four web vital measurements.

### Lab test 3: Regionally deployed Next.js app on serverless function

For this section, the client-only SPA is deployed on [Vercel](https://vercel.com/) on a global CDN. The implementation can be found here: [(1) Client-only SPA](https://github.com/andrelandgraf/movies-react-spa).

The full stack web app uses Next.js with React Server Components runs on a serverless function on Vercel. The implementation can be found here: [Full stack app using Remix on Vercel](https://github.com/andrelandgraf/movies-react-full-stack-app-with-rsc).

#### PageSpeed Insights with function in Washington, US (iad1)

This lab test was conducted using PageSpeed Insights (Mobile). The serverless function on Vercel was deployed in Washington, US (iad1).

Five test runs were conducted for both the client-side-only SPA and the Next.js app and the medium was taken.

```table
<table class="border-collapse">
  <tr>
    <th class="p-2 border border-gray-300">Web Vitals</th>
    <th class="p-2 border border-gray-300">Client-only SPA</th>
    <th class="p-2 border border-gray-300">Full Stack App</th>
    <th class="p-2 border border-gray-300 font-bold">Difference</th>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">FCP</td>
    <td class="p-2 border border-gray-300">1.4</td>
    <td class="p-2 border border-gray-300">0.9</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.5</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">LCP</td>
    <td class="p-2 border border-gray-300">5.8</td>
    <td class="p-2 border border-gray-300">6.1</td>
    <td class="p-2 border border-gray-300 font-bold text-red">0.3</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">TBT</td>
    <td class="p-2 border border-gray-300">430</td>
    <td class="p-2 border border-gray-300">260</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-170</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">Speed Index</td>
    <td class="p-2 border border-gray-300">1.9</td>
    <td class="p-2 border border-gray-300">1.5</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.4</td>
  </tr>
</table>
```

As visible in the results, the regionally deployed full stack web app outperforms the client-only SPA in all but LCP. The worse LCP score can be explained by the distance to the serverless function. This matches the results from the same test setup using Remix.

#### PageSpeed Insights with function in San Francisco, US (sfo1)

This lab test was conducted using PageSpeed Insights (Mobile). The serverless function on Vercel was deployed in San Francisco, US (sfo1).

Five test runs were conducted for both the client-side-only SPA and the Next.js app and the medium was taken.

```table
<table class="border-collapse">
  <tr>
    <th class="p-2 border border-gray-300">Web Vitals</th>
    <th class="p-2 border border-gray-300">Client-only SPA</th>
    <th class="p-2 border border-gray-300">Full Stack App</th>
    <th class="p-2 border border-gray-300 font-bold">Difference</th>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">FCP</td>
    <td class="p-2 border border-gray-300">1.4</td>
    <td class="p-2 border border-gray-300">0.9</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.5</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">LCP</td>
    <td class="p-2 border border-gray-300">8</td>
    <td class="p-2 border border-gray-300">4.3</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-3.7</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">TBT</td>
    <td class="p-2 border border-gray-300">480</td>
    <td class="p-2 border border-gray-300">280</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-200</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">Speed Index</td>
    <td class="p-2 border border-gray-300">2</td>
    <td class="p-2 border border-gray-300">1.7</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.3</td>
  </tr>
</table>
```

As visible in the results, the regionally deployed full stack web app outperforms the client-only SPA in all four web vital measurements. The LCP is significantly improved by 3.7 seconds.

### Lab test 4: Globally deployed Remix app on Vercel edge network

For this section, the client-only SPA is deployed on [Vercel](https://vercel.com/) on a global CDN. The implementation can be found here: [(1) Client-only SPA](https://github.com/andrelandgraf/movies-react-spa).

The full stack web app uses Next.js with React Server Components runs on a serverless function on Vercel. The implementation can be found here: [Full stack app using Remix on Vercel Edge](https://github.com/andrelandgraf/movies-react-full-stack-app/tree/vercel-on-the-edge).

#### PageSpeed Insights

This lab test was conducted using PageSpeed Insights (Mobile). Five test runs were conducted for both the client-side-only SPA and the Next.js app and the medium was taken.

```table
<table class="border-collapse">
  <tr>
    <th class="p-2 border border-gray-300">Web Vitals</th>
    <th class="p-2 border border-gray-300">Client-only SPA</th>
    <th class="p-2 border border-gray-300">Full Stack App</th>
    <th class="p-2 border border-gray-300 font-bold">Difference</th>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">FCP</td>
    <td class="p-2 border border-gray-300">1.4</td>
    <td class="p-2 border border-gray-300">1</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.4</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">LCP</td>
    <td class="p-2 border border-gray-300">7.8</td>
    <td class="p-2 border border-gray-300">7.1</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.7</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">TBT</td>
    <td class="p-2 border border-gray-300">370</td>
    <td class="p-2 border border-gray-300">220</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-150</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">Speed Index</td>
    <td class="p-2 border border-gray-300">2</td>
    <td class="p-2 border border-gray-300">1.4</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.6</td>
  </tr>
</table>
```

As visible in the results, the regionally deployed full stack web app outperforms the client-only SPA in all four web vital measurements.

### Lab test 5: Globally deployed Next.js app on Vercel edge network

For this section, the client-only SPA is deployed on [Vercel](https://vercel.com/) on a global CDN. The implementation can be found here: [(1) Client-only SPA](https://github.com/andrelandgraf/movies-react-spa).

The full stack web app uses Next.js with React Server Components runs on a serverless function on Vercel. The implementation can be found here: [Full stack app using Next.js on Vercel Edge](https://github.com/andrelandgraf/movies-react-full-stack-app-with-rsc/tree/run-on-edge).

#### PageSpeed Insights

This lab test was conducted using PageSpeed Insights (Mobile). Five test runs were conducted for both the client-side-only SPA and the Next.js app and the medium was taken.

```table
<table class="border-collapse">
  <tr>
    <th class="p-2 border border-gray-300">Web Vitals</th>
    <th class="p-2 border border-gray-300">Client-only SPA</th>
    <th class="p-2 border border-gray-300">Full Stack App</th>
    <th class="p-2 border border-gray-300 font-bold">Difference</th>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">FCP</td>
    <td class="p-2 border border-gray-300">1.4</td>
    <td class="p-2 border border-gray-300">1</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.4</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">LCP</td>
    <td class="p-2 border border-gray-300">7.8</td>
    <td class="p-2 border border-gray-300">6.1</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-1.7</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">TBT</td>
    <td class="p-2 border border-gray-300">370</td>
    <td class="p-2 border border-gray-300">270</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-100</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">Speed Index</td>
    <td class="p-2 border border-gray-300">2</td>
    <td class="p-2 border border-gray-300">1.7</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.3</td>
  </tr>
</table>
```

As visible in the results, the regionally deployed full stack web app outperforms the client-only SPA in all four web vital measurements.

### Summary of lab tests

Using a full stack web framework can have significant performance improvements over a client-only SPA.

The documented lab tests were run both on [render.com](https://render.com/) and [Vercel](https://vercel.com/) and across different regions (Oregon, Washington, San Francisco) and different runtimes (long-running server, serverless, edge) to achieve diverse results.

Depending on runtime, region, and version, the full stack apps showed different performance results. However, the full stack apps outperformed the client-only SPA in most cases. The client-side SPA only showed faster LCP measurements when the full stack app was deployed to a region further away (Washington). There is an opportunity to further investigate performance-improvements in this case.

Taking the average of the averages (medium of medium) across the different test runs using Remix (long-running server, serverless Washington, serverless San Francisco, edge), we can document the following results.

```table
<table class="border-collapse">
  <tr>
    <th class="p-2 border border-gray-300">Web Vitals</th>
    <th class="p-2 border border-gray-300">Client-only SPA</th>
    <th class="p-2 border border-gray-300">Remix</th>
    <th class="p-2 border border-gray-300 font-bold">Difference</th>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">FCP</td>
    <td class="p-2 border border-gray-300">1.4</td>
    <td class="p-2 border border-gray-300">1</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.4</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">LCP</td>
    <td class="p-2 border border-gray-300">7.8</td>
    <td class="p-2 border border-gray-300">7</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.8</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">TBT</td>
    <td class="p-2 border border-gray-300">400</td>
    <td class="p-2 border border-gray-300">215</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-185</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">Speed Index</td>
    <td class="p-2 border border-gray-300">2</td>
    <td class="p-2 border border-gray-300">1.45</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.55</td>
  </tr>
</table>
```

Taking the average of the averages (medium of medium) across the different test runs using Next.js (serverless Washington, serverless San Francisco, edge), we can document the following results.

```table
<table class="border-collapse">
  <tr>
    <th class="p-2 border border-gray-300">Web Vitals</th>
    <th class="p-2 border border-gray-300">Client-only SPA</th>
    <th class="p-2 border border-gray-300">Next.js</th>
    <th class="p-2 border border-gray-300 font-bold">Difference</th>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">FCP</td>
    <td class="p-2 border border-gray-300">1.4</td>
    <td class="p-2 border border-gray-300">0.9</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.5</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">LCP</td>
    <td class="p-2 border border-gray-300">7.8</td>
    <td class="p-2 border border-gray-300">6.1</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-1.7</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">TBT</td>
    <td class="p-2 border border-gray-300">400</td>
    <td class="p-2 border border-gray-300">270</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-130</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">Speed Index</td>
    <td class="p-2 border border-gray-300">2</td>
    <td class="p-2 border border-gray-300">1.7</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.3</td>
  </tr>
</table>
```

## Background

Client-side-only SPAs consist of static files that can be hosted on a content delivery network (CDN). The static files are downloaded by the browser and rendered in the browser runtime.
Client-only SPA architectures give up control over the web server environment to focus on the browser runtime.

Full stack web apps run both on the client and a server environment. They give developers control over the request response flows and handling of the incoming HTTP requests.

![A diagram comparing a client-only SPA to a full stack web app](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto,w_800/v1682282664/andrelandgraf.dev/client-side-vs-full-stack-framework_dgepoy.png)

Downstream services and third-party APIs are used to provide data and functionality. The client-side app is responsible for fetching data from the APIs and rendering it in the browser.

In bigger organizations, downstream services and APIs are likely owned by other teams, departments, and suppliers. All API requests leave the frontend team’s control zone and are handled by third parties. Conclusively, the performance of the client-only SPA is dependent on the priorities and decisions of third parties.

![A diagram showing the control zone when working on a client-only SPA. The control zone includes the browser runtime and client-only app. It also includes the requests made from the frontend. However, all API requests leave the control zone and are handled by third-party APIs.](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto,w_500/v1682282727/andrelandgraf.dev/control-zone-client-side-spa_ct4ldm.png)

We can replace the client-only SPA with a full stack web app by using a full stack web framework like Next.js or Remix. Using a full stack app unlocks the tools of the backend of the web platform. With access to a server environment, we naturally implement the BFF (backend for frontend) pattern. We gain control over a server runtime and can use it to optimize the web performance.

You can read more about the benefits of owning the full stack of the web platform in this blog post: "[The full stack of the web platform](blog/2023-03-25_the_full_stack_of_the_web_platform.md)".

## Building the business case

The full stack web app used in this business case was iteratively developed and improved. The following section walks you through the step-by-step improvements which were conducted. Each section enhances the full stack web app and adds further performance optimizations. The final version is then used in the lab tests presented in the previous sections.

### Step-by-step improvements

For this section, the client-only SPA is deployed on [render.com](https://render.com/) on a global CDN. The implementation can be found here: [(1) Client-only SPA](https://github.com/andrelandgraf/movies-react-spa).

The full stack web app uses Remix with the Express.js adapter and runs on a long-running server on render.com (Oregon, US). The implementation can be found here: [Full stack app using Remix with Express.js](https://github.com/andrelandgraf/movies-react-full-stack-app).

The `main` branch includes all performance optimizations. The following branches include the performance optimizations step by step:

- [(2) with-client-side-data-fetching](https://github.com/andrelandgraf/movies-react-full-stack-app/tree/with-client-side-data-fetching)
- [(3) with-server-side-data-fetching](https://github.com/andrelandgraf/movies-react-full-stack-app/tree/with-server-side-data-fetching)
- [(4) with-filtering-overfetched-data](https://github.com/andrelandgraf/movies-react-full-stack-app/tree/with-filtering-overfetched-data)
- [(5) with-http-and-memory-caching](https://github.com/andrelandgraf/movies-react-full-stack-app/tree/with-http-and-memory-caching)

### Server-side rendering and streaming

#### Lighthouse

This lab test was conducted on a MacBook Pro in Cupertino, California using Lighthouse (Mobile) on Chrome (Guest Profile).

Five Lighthouse runs were conducted for both the client-side-only SPA and the Remix app and the medium was taken.

```table
<table class="border-collapse">
  <tr>
    <th class="p-2 border border-gray-300">Web Vitals</th>
    <th class="p-2 border border-gray-300">Client-only SPA</th>
    <th class="p-2 border border-gray-300">Full Stack App</th>
    <th class="p-2 border border-gray-300 font-bold">Difference</th>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">FCP</td>
    <td class="p-2 border border-gray-300">1.4</td>
    <td class="p-2 border border-gray-300">1.4</td>
    <td class="p-2 border border-gray-300 font-bold">0</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">LCP</td>
    <td class="p-2 border border-gray-300">8.4</td>
    <td class="p-2 border border-gray-300">7.1</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-1.3</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">TBT</td>
    <td class="p-2 border border-gray-300">140</td>
    <td class="p-2 border border-gray-300">150</td>
    <td class="p-2 border border-gray-300 font-bold text-red">10</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">Speed Index</td>
    <td class="p-2 border border-gray-300">1.9</td>
    <td class="p-2 border border-gray-300">1.6</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.3</td>
  </tr>
</table>
```

#### Walkthrough

Today's full stack web frameworks provide server-side rendering (SSR) and streaming with [React 18](https://react.dev/blog/2022/03/29/react-v18) out of the box.

Server-side rendering allows us to pre-render the HTML on the server and send it to the client. This allows the client to display the HTML immediately. With server-side rendering, we don't need to wait for JavaScript to load and execute on the client before the content is displayed.

HTTP streaming is a technique that allows the server to stream data to the client. This can be used to send data to the client as it becomes available, rather than waiting for the entire response to be ready. React 18 implements streaming together with server-side rendering to optimize the performance.

In this first step, the full stack web app still employs client-side data fetching. So far, we only server-side render the loading states and fetch the movies once React has re-hydrated on the client. This version of the full stack web app serves as the baseline.

![Screenshot of the visual comparison on WebPageTest showing how using server-side rendering and streaming reduces the Largest Contentful Paint by 0.5 seconds](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1682296021/andrelandgraf.dev/screenshot-web-page-test-client-only-spa-vs-full-stack-with-client-side-data-fetching.png)

A comparison on WebPageTest between the client-only SPA and the full stack app with client-side data fetching shows that server-side rendering and streaming provides comparable performance to the client-side SPA \[[1](https://www.webpagetest.org/video/compare.php?tests=230423_BiDcS2_7QH%2C230423_BiDcR6_7QJ&thumbSize=150&ival=500&end=visual)\].

However, server-side rendering really shows its value when adding server-side data fetching.

### Server-side data fetching

#### Lighthouse

This lab test was conducted on a MacBook Pro in Cupertino, California using Lighthouse (Mobile) on Chrome (Guest Profile).

Five Lighthouse runs were conducted for both the client-side-only SPA and the Remix app and the medium was taken.

```table
<table class="border-collapse">
  <tr>
    <th class="p-2 border border-gray-300">Web Vitals</th>
    <th class="p-2 border border-gray-300">Client-only SPA</th>
    <th class="p-2 border border-gray-300">Full Stack App</th>
    <th class="p-2 border border-gray-300 font-bold">Difference</th>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">FCP</td>
    <td class="p-2 border border-gray-300">1.4</td>
    <td class="p-2 border border-gray-300">1.4</td>
    <td class="p-2 border border-gray-300 font-bold">0</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">LCP</td>
    <td class="p-2 border border-gray-300">8.4</td>
    <td class="p-2 border border-gray-300">6.9</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-1.5</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">TBT</td>
    <td class="p-2 border border-gray-300">140</td>
    <td class="p-2 border border-gray-300">100</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-40</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">Speed Index</td>
    <td class="p-2 border border-gray-300">1.9</td>
    <td class="p-2 border border-gray-300">1.9</td>
    <td class="p-2 border border-gray-300 font-bold">0</td>
  </tr>
</table>
```

#### Walkthrough

During the initial page load, Remix and Next.js server-side render the page. Both frameworks provide primitives and conventions to fetch data on the server. This allows us to render dynamic content on the server before sending the HTML to the client.

The client-only SPA uses `react-query` to fetch data on the client. With client-side data fetching, the data fetching can only happen after the JavaScript bundle has been loaded and executed on the client. React renders an initial loading state until the data is available.

Server-side data fetching can improve web vitals by fetching data before the client-side JavaScript bundle is loaded and executed. By doing so, we avoid further client-server request round trips.

For instance, in [this particular test](https://www.webpagetest.org/video/compare.php?tests=230424_BiDcVN_HM%2C230424_BiDc0G_HN%2C230424_BiDcG9_HP&thumbSize=150&ival=500&end=visual) from WebPageTest, the following Largest Contentful Paint (LCP) times were measured:

- Client-only SPA (1): 5.2 seconds
- Full stack app with client-side data fetching (2): 5.1 seconds
- Full stack app with server-side data fetching (3): 3.0 seconds

The Time to Interactive (TTI) was also improved from 3.7 seconds to 2.6 seconds.

![Screenshot of the visual comparison on WebPageTest showing how using server-side data fetching reduces the Largest Contentful Paint by another 0.5 seconds](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1682297735/andrelandgraf.dev/screenshot-web-page-test-client-only-spa-vs-full-stack-apps-with-client-or-server-data-fetching.png)

Server-side data fetching also allows us to aggregate and filter the data on our server environment before forwarding it to the client. This unlocks further performance improvements.

### Avoiding overfetching

#### Lighthouse

This lab test was conducted on a MacBook Pro in Cupertino, California using Lighthouse (Mobile) on Chrome (Guest Profile).

Five Lighthouse runs were conducted for both the client-side-only SPA and the Remix app and the medium was taken.

```table
<table class="border-collapse">
  <tr>
    <th class="p-2 border border-gray-300">Web Vitals</th>
    <th class="p-2 border border-gray-300">Client-only SPA</th>
    <th class="p-2 border border-gray-300">Full Stack App</th>
    <th class="p-2 border border-gray-300 font-bold">Difference</th>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">FCP</td>
    <td class="p-2 border border-gray-300">1.4</td>
    <td class="p-2 border border-gray-300">1.3</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.1</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">LCP</td>
    <td class="p-2 border border-gray-300">8.4</td>
    <td class="p-2 border border-gray-300">3.8</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-4.6</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">TBT</td>
    <td class="p-2 border border-gray-300">140</td>
    <td class="p-2 border border-gray-300">100</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-40</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">Speed Index</td>
    <td class="p-2 border border-gray-300">1.9</td>
    <td class="p-2 border border-gray-300">1.5</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.4</td>
  </tr>
</table>
```

Note that the LCP improves by 3.1 seconds compared to the previous full stack app version.

#### Walkthrough

Overfetching happens if an application fetches more data than it requires. Overfetching increases the payload size and leads to slower load times, especially on mobile networks such as 3G.

For instance, the app renders the following `MovieCard` component for each movie:

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

We have to fetch the movie `id`, `title`, and `poster_path` attributes for each movie. By default, the TMDB API returns the following data for every movie:

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

Full stack web frameworks provide access to the web server. They naturally implement the BFF pattern \[[8](https://remix.run/docs/en/main/guides/bff)\] and allow us to fetch on the server and filter out unnecessary data before forwarding it to the client. For example, when only fetching the `id`, `title`, and `poster_path` attributes, the payload size is reduced from 15.3kB to 3kB for 80 movies (minified and gzipped).

```typescript
type Movie = {
  id: number;
  title: string;
  poster_path: string;
};
```

The real world performance impact of this optimization depends on the type and amount of data as network payloads are compressed, which already reduces the payload size. However, it is safe to assume that the performance changes will always be positive.

### Caching

#### Lighthouse

This lab test was conducted on a MacBook Pro in Cupertino, California using Lighthouse (Mobile) on Chrome (Guest Profile).

Five Lighthouse runs were conducted for both the client-side-only SPA and the Remix app and the medium was taken.

```table
<table class="border-collapse">
  <tr>
    <th class="p-2 border border-gray-300">Web Vitals</th>
    <th class="p-2 border border-gray-300">Client-only SPA</th>
    <th class="p-2 border border-gray-300">Full Stack App</th>
    <th class="p-2 border border-gray-300 font-bold">Difference</th>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">FCP</td>
    <td class="p-2 border border-gray-300">1.4</td>
    <td class="p-2 border border-gray-300">1.3</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.1</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">LCP</td>
    <td class="p-2 border border-gray-300">8.4</td>
    <td class="p-2 border border-gray-300">2.1</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-6.3</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">TBT</td>
    <td class="p-2 border border-gray-300">140</td>
    <td class="p-2 border border-gray-300">60</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-80</td>
  </tr>
  <tr>
    <td class="p-2 border border-gray-300">Speed Index</td>
    <td class="p-2 border border-gray-300">1.9</td>
    <td class="p-2 border border-gray-300">1.6</td>
    <td class="p-2 border border-gray-300 font-bold text-green">-0.3</td>
  </tr>
</table>
```

#### Walkthrough

When having control over the web server, you can implement caching strategies. This can improve the performance of your app by reducing the amount of data that needs to be transferred over the network.

Caching can be used to reduce request waterfalls introduced by data dependencies. There are several caching strategies that can be implemented on the server.

- HTTP caching headers
- In-memory caching
- Caching services such as Redis

This version of the full stack web app adds HTTP caching headers to the data fetching requests for the movies data and movie database config object. The movie database config is further not user-specific and stored in memory on the server.

### Additional improvements

The final version of the full stack web app further reduces the client bundle size by removing the dependency on `react-query` and by moving JavaScript modules to the server.

This enhancements happened as side-effects while moving the data fetching to the server. In the following, the two enhancements are described in more detail but without any Lighthouse test attributions.

### Moving libraries to the server

Using third-party libraries on the server can reduce the size of the client bundle. This can improve the performance of your app by reducing the amount of data that needs to be transferred over the network.

For instance, when moving the data fetching to the server, we can remove the `react-query` dependency from the client bundle. This reduces the bundle size by 12kb (minified and gzipped) \[[9](https://bundlephobia.com/package/@tanstack/react-query@4.29.3)\].

Similarly, we could move our GraphQL client or any other large library to the server and instead forward the data to the client using the full stack web framework's data fetching API.

### Moving JavaScript to the server

Moving our own JavaScript to the server can reduce the size of the client bundle. This can improve the performance of the app by reducing the amount of data that needs to be transferred over the network.

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

## Summary

This article documents lab tests of different full stack web app implementations and compares them to client-side-only SPAs. The test runs include deployments to different regions, runtime environments, and server-side optimizations.

This business case shows that using a full stack web framework can significantly improve the performance. Full stack web apps provide access to the backend of the web platform which provides us more tools we can use to make better trade-offs.

We can employ server-side rendering and streaming, avoid overfetching, execute JavaScript and third-party libraries, and add caching to improve the performance. Conclusively, a migration to a full stack web framework provides developers with the tools required to solve the performance-problems of today.

## Limitations

This business case compares a client-only SPA with a full stack web app. Downstream services are assumed to be owned by other teams or departments. Conclusively, most of the arguments are based on the assumption that the frontend team does not currently own the web server or a BFF API server environment.

The measurements in this business case are based on lab tests. Lab tests can be used as a baseline to compare different implementations. However, they do not reflect the real-world performance of your app. A more accurate way to measure the performance of your app is to run A/B tests in production. Running A/B tests allows you to measure the performance of your app in real-world conditions. On the other side, A/B tests are more complex to set up. They require that you deploy a production environment using the full stack web framework.

An iterative business case could make use of lab tests to achieve initial buy-in and then use A/B tests to measure the performance of a full stack app MVP in production. Hence, the scope and depth of this business case can only serve as a starting point for further analysis. The results should only be used to argue that its worth running experiments and evaluating potential performance wins. Conclusively, this business case should be used as a blueprint or baseline to conduct a personalized business case in your own organization, using your own applications and infrastructure.
