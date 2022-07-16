---
date: 2022-06-05
title: How Remix is positioned to drive the future of the web
description: Remix is a full stack web framework that both embraces web fundamentals and cutting-edge technologies. In this post, I want to summarize my own thoughts about why I believe that Remix is very well suited to drive the future of the web.
categories: [Remix.run]
---

Remix is a full stack web framework that both embraces web fundamentals and cutting-edge technologies. In this post, I want to summarize my own thoughts about why I believe that Remix is very well suited to be part of the future of the web and why it might even accelerate some trends.

There are a lot of great tools out there, and people have [great careers](https://twitter.com/taylorotwell/status/1534178479201259520?lang=en) all around web dev! When it comes to React-land, Remix, Gatsby, and Next.js are all great tools to build applications. On top of that, there are so many other tools that I won't mention here due to my lack of awareness and experience. My goal with this blog post is to articulate some of the nuances that make me so excited about Remix. Thus, just a quick disclaimer that this blog post is biased based on my own experiences and preferences.

It's intuitive to compare Remix to Next.js and Gatsby, and to treat it as another React apps framework. The Remix team has done its best to objectively compare Remix to Next.js [in this blog post](https://remix.run/blog/remix-vs-next). However, the Remix team also stresses that Remix is not a React framework but a 🌟 full stack web framework 🌟 - an important distinction.

## Remix is a web framework

There are a couple of reasons why Remix is best described as a web framework. For one, Remix tries to be frontend library/framework agnostic and aims to support Preact, Vue, and other React alternatives in the future. However, I don't think that's what it's really about.

The main reason I believe Remix is a web framework is its deep embrace of the web platform. Remix's goal is to enable ["fast, slick, and resilient"](https://remix.run/#:~:text=fast%2C%20slick%2C%20and%20resilient) user experiences by using the platform ([#useThePlatform](https://twitter.com/search?q=%23useThePlatform&src=typed_query&f=top)). Search parameters, cookies, meta tags, HTML forms, HTTP headers, and the web fetch API are all first-class citizens in Remix. Remix's conventions, levers, and primitives are thoughtfully designed abstraction layers of existing web APIs and standards. This sets Remix apart from other popular frameworks that feel more decoupled from the web platform.

`statement: Remix embraces the web platform and provides thoughtfully designed conventions, levers, and primitives for existing web APIs and standards.`

React still plays an important role in Remix and its origin story. After all, Remix comes from the same folks that created React Router - Ryan Florence and Michael Jackson - and can be seen as its next evolutionary step. However, when working with Remix, React only feels like one puzzle piece of the bigger picture of creating fast, slick, and resilient user experiences. Remix pushes me to think about HTTP caching, session cookies, the URL bar, the network tab, and so much more. Remix is a web framework.

## Remix is full stack

Remix also describes itself as full stack. Now it gets a bit tricky. What makes Remix full stack? Next.js renders React applications on the server and includes API routes; does that mean Next.js is full stack? I would argue that Remix plays in its own league here but let's start from the beginning...

If anything, I want to express how HUGE Remix is for this whole frontend/backend divide. There are so many different perspectives to this, and I want to make sure to address as many as possible.

### The PHP/Rails perspective

Web developers have always worked on both the client and the server. Think [LAMP](<https://en.wikipedia.org/wiki/LAMP_(software_bundle)>) stack or Rails: you build your business logic in PHP or Ruby (server side) and add some JavaScript to make your site dynamic (client side). Unfortunately, the integration between client (JavaScript) and server (PHP/Ruby) is limited by the language divide. In Remix, both your server and client code is just JavaScript/TypeScript. Reusing types and utility functions between client and server code becomes trivial. Additionally, Remix's router has a client and a server-side part to it, meaning that it can close the network gap and enable progressive enhancement, prefetching, and a rich SPA-like experience out of the box. This sets Remix apart from PHP, Rails, and so on.

Developing with Remix also has some similarties with PHP and Rails development. I remember having PHP files that included HTML, CSS, JavaScript, SQL, and PHP code. I would invoke database queries from within HTML. Straight-up madness that leads to crazy spaghetti but nicely co-located code. In Remix, API endpoints and request handlers (loaders & actions) live in the same file-based route modules as the routes' components (files in the `/routes` folder), giving me that same feeling of proximity of everything important. Not to mention that Remix promotes the usage of form elements to trigger data mutations. Much PHP vibes, very old school. Funny enough, this gave Remix the stigma of being a boomer framework. I would much rather phrase it this way: from a PHP/Rails perspective, Remix feels familiar but comes with all the advancements of the JavaScript ecosystem.

`statement: I think Remix is a healthy combination of what works (the web platform) and new ideas, trends, and technologies.`

### The JavaScript perspective

There are a lot of different approaches and stacks in JavaScript-land. I want to compare Remix with the things I know and have used myself: single-page applications (SPAs), the MERN (MongoDB, Express, React, and Node.js) stack, and Jamstack.

#### SPAs

[Create React App](https://create-react-app.dev/) was, for a long time, the go-to starting point to create rich client-side applications - no server involved other than handling the static requests to send out the JavaScript bundle. However, we all learned the hard way that SPAs come with some significant downsides. SPAs might negatively affect search rankings, often mess with scroll positions when using the browser's back and forward buttons, produce spinner-gedon due to client-side fetch waterfalls, slow down the inital page load times due to hydration time and big bundle sizes, and are not interactive until JavaScript has loaded. From an SPA perspective, Remix fulfills the same job as Next.js by utilizing the latest improvements in React to improve performance and take advantage of server-side rendering (SSR).

From a SPA perspective, Remix might also seem like just another pendulum swing in the never-ending back and forth between server-side and client-side heavy apps. But I believe Remix is the evolutionary step that takes advantage of the best of both worlds.

For bigger organizations, the rise of SPAs has certainly made the divide between frontend and backend bigger by separating the frontend and the backend code into two separate applications. Instead of using PHP to render the website and using JavaScript to enhance the experience, one now renders the application on the client with JavaScript. Moreover, organizations use enterprise backend technologies such as Java Spring to create scalable systems. Inherently, different teams are now working on the frontend and backend code. A full vertical divide across the stack.

I think for most complex systems, Remix will not be used as a backend server that connects to databases, but instead be used as an SPA replacement that comes with progressive enhancement and its own thin server layer. Remix apps thrive in microservice architectures where they fetch and aggregate data from different backends **on the server** and implement the business logic before returning the data to the client (avoiding over-fetching as well). Moreover, Remix apps can easily forward client-requests to other backends and act as adapters without the complexity of client-side fetching - resilient error boundaries included.

`statement: Remix is a perfect replacement for an SPA and works well in microservice architectures as it can aggregate data on the server and avoid overfetching.`

Data aggregation is a huge topic and one of the main reasons that GraphQL is so successful. I would argue that if you are just developing a website/webapp and thinking about using GraphQL to aggregate data, use Remix instead. If your organization is using GraphQL, you can also easily integrate with GraphQL in Remix's loaders and actions withouth shipping a heavy GraphQL client to the user's browser.

#### MERN stack

I worked with MySQL, PHP5, and jQuery for a year or so, but I really got started with web development in college. I had a bunch of innovation/protoyping courses and the MERN stack was the go-to suggestion to use for our imaginary startup ideas. The mantra was: "MERN is great for rapid prototyping". We would spin up two apps: one Create React App frontend application and one Express backend application. If I scroll through my GitHub projects, there is a long list of long forgotten uni projects that all consist of two separate repositories with the following naming convention:

- `[cool-startup-name]-frontend`
- `[cool-startup-name]-backend`

Yes, everything is JavaScript but what does it help when the JavaScript lives in two separate repositories? Monorepo support has significantly improved in the past few years with tools like [pnpm](https://pnpm.io/). Alternatively, you can use git submodules and other shenanigans to re-use code between your Express app and React app. However, in both cases there is a lot of custom tooling and boilerplate code involved to make everything work nicely. From a MERN-stack perspective, Remix's biggest plus is the increased developer experience. Remix provides the glue between the frontend and backend code.

Remix brings many quality-of-life improvements, such as out-of-the-box support for prefetching, progressive enhancement, and file-based API and document request routing. Just think about all the Express router and React Router boilerplate code you can get rid of by using Remix's file-based routing for both your API and document routes. You also get server-side React rendering, error and catch boundaries, and a bunch of other APIs that increase the overall developer experience and reduce boilerplate code.

`twitterEmbed: https://twitter.com/ryanflorence/status/1534928868154433536`

**Note:** I think from a MERN perspective, Remix and Next.js kind of solve the same pain points. Personally, I just prefer Remix's developer experience and philosophy.

`statement: Coming from MERN, Remix provides insane quality-of-life improvements and a better user experience out of the box.`

#### Jamstack

In 2020, I built [my first real website](https://velapilates.de/) with Gatsby. Coming from MERN, the speed of the initial page load blew my mind! The philosophy behind [Jamstack](https://jamstack.org/) has changed over time but Gatsby's approach is to server-side render React at build time - this is known as static-side generation (SSG). Jamstack heavily promotes the separation of frontend and backend.

`quote: Jamstack is an architectural approach that decouples the web experience layer from data and business logic, improving flexibility, scalability, performance, and maintainability. cite: jamstack.org`

For my first website (a pilates course platform), I chose Gatsby because I perceived the course data as static. However, for a business, I also required a backend to process the payments and provide admin functionalities. Coming from MERN, I chose Express, MongoDB, and Node.js. Since then, Gatsby and Next.js have both added serverless functions to accomodate for the need for server-side logic. Unfortunately, one Gatsby application now consists of three environments: the client-side SPA, the serverless/lambda functions, and the build environment which runs on the server once during build time.

Remix and Jamstack have different philosophies about web development and aim to achieve different things. Similar to MERN, I think that Remix makes things easier and hence improves the overall developer experience. One could definetly use Remix with a Jamstack mindset: add a CDN in front of your Remix website and add very long-lasting cache headers. Then bust the CDN cache during redeploy, and you've got yourself static-site generation. Remix's philosophy is about providing levers that allow developers to target different key performance indicators.

I was at Reactathon this year, and Ryan Florence gave [a great talk](https://www.youtube.com/watch?v=95B8mnhzoCM) about "When To Fetch". Please watch the talk if you haven't. It really shows how much thought the Remix team puts into its APIs that allow you to use Remix to prioritize the key performance indicators of your choice. Not to say that the people behind Next.js and Gatsby don't do that, but then we go back to the "web framework" part and my previous statement: Remix feels less decoubled from the web platform.

## Remix runs everywhere

Remix is full stack but it is also capable of running in places where your typical MERN stack, LAMP stack, or Jamstack website cannot run. Remix runs with Deno, Node.js, Netlify, Vercel, Cloudflare Workers and Pages, and much more. Remix runs everywhere.

Remix is capable of running on long-running servers, serverless environments, and the edge. This alone provides so much flexibility. Remix is capable of adapting to your use case much better than other frameworks. For instance, I believe Remix is currently the easiest way to deploy a simple REST API to the edge. Speaking of the edge, I believe the edge is one of the areas where Remix is currently accelerating a trend by making it so accessible.

`statement: Remix's ability to run anywhere adds to its flexibility. Remix can be used serverless, on a server, or even on the edge. Remix's adapters provide more levers to choose from.`

## API-first

To add to Remix being full stack, I truly believe that Remix could be used to create standalone APIs. At the very least, Remix provides the means to create applications that consist of both API endpoints and document routes. In contrast to Gatsby and Next.js, Remix's API routes live in the same routes folder as the route components, which creates this feeling of proximitiy and co-location. Remix is a full stack web framework that creates **one app** in **one programming language** for the web.

## Conclusion

`twitterEmbed: https://twitter.com/mjackson/status/1529643758966386688`

It's great to see how far Remix has come since its launch, but its future is even more exciting. The team behind Remix frequently emphasizes that it has great plans for the future of Remix. I believe that Remix is greatly positioned to drive the future of the web, and I hope that I was able to convey my enthusiasm in this blog post.

Take care & happy coding!
