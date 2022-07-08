---
date: 2022-06-05
title: How Remix is positioned to drive the future of the web
description: Remix is a full-stack web framework that both embraces web fundamentals and cutting-edge technologies. In this post, I want to summarize my own thoughts about why I believe that Remix is very well suited to drive the future of the web.
categories: [Remix.run, AI/ML, edge computing, VR/AR, 3D, offline, IoT]
---

Remix is a full-stack web framework that both embraces web fundamentals and cutting-edge technologies. In this post, I want to summarize my own thoughts about why I believe that Remix is very well suited be part of the future of the web, and, even more though, drive the future of the web and accelerating trends.

My goal with this blog post is mostly to talk about exciting tech but also to properly articulate some of the nuances that make me so excited about Remix that sometimes get lost when we try to boil down the features of Remix to "just" compare it to Next.js. I think Remix is so much more.

First, I want to go over the things that I think make Remix future proof. After that, I will go over the latest trends in tech - topic by topic - to emphasize why I believe that Remix is going to be a perfect match for those trends and might even accelerate some of them.

# From a Remix perspective

Last year, Remix was mostly compared to Next.js and Gatsby and treated as another framework that uses React on the client. However, the Remix team stresses that Remix is not a React framework but a **full stack web framework** - an important distinction.

## Remix is Full Stack

I think I could write a long blog post just about how HUGE Remix is for this whole frontend/backend divide. There is so much perspective to this. I want to emphasize at least two point of views here. First, I want to motivate Remix from a PHP/Rails perspective, then I am going to go over the wins from a JavaScript perspective.

### The PHP/Rails perspective

Web developers have always worked on both the client and the server. Say PHP or Rails: you build your business logic in PHP or Ruby (server side) and add some JavaScript to make your site dynamic (client side). One might think server-side React and Remix are just another pendulum swing in the back and forth of the JavaScript ecosystem between server-side and client-side apps. I disagree. Remix is the next iteration, the next evolutionary step that takes the best of both worlds. Remix closes the network gap between the front- and backend by wrapping both in one JavaScript-based framework. In Remix, both your server and client code is just JavaScript/TypeScript and lives in the same file-based route modules (files in the `/routes` folder). Things like reusing types and utility functions between client and server code becomes trivial. This sets Remix projects apart from projects written with PHP, Rails, and so on.

But Remix also shares similarities with PHP and Rails trains of thoughts as it only provides a thin abstraction layer to the web platform. Funny enough, this gave Remix the stigma of beeing a boomer framework, a nod to the similiartiies between Remix and Rails and PHP. I think Remix is a healthy combination of what works (the web platform) and new (cutting-edge technologies & lessons learned) of both the PHP and Rails ecosystem and the JavaScript ecosystem.

### The JavaScript Perspective

The rise of SPAs made the divide between frontend and backend bigger by separating the frontend and the backend code into two separate applications and moving more logic towards the client. This led to SPAs and the JamStack. Frontend developers implement business logic on the client and use third-party services to replace a backend. Now, we had to add serverless functions as we realized we need some server-side environment. Thus, the JavaScript ecosystem learned that every frontend still requires a backend to abstract business logic. You cannot store your secrets and all your computations and verifications on the client. You need a backend. That's also why the MERN stack exist. Web developers have always been full stack. That's the environment, which most aspiring devs these days are exposed to. MongoDB, express, React, and Node.js - two apps, one for the server, and one for the client, all JavaScript but divided into two projects. With Remix, there is no need for git submodules or other shinenigans to re-use code between your express app and React app, just one app (to rule them all) that knows both your server and your client-side. That's the perspective that makes many compare Remix to Next.js. They both fit into the same spot of this JavaScript perspective: We need a server and server-side rendering has it's advantages but we also want a client-side React application. But I believe there is even more to it. Remix is more.

Today's React frameworks focus on app development. Both Gatsby and Next.js just recently introduced serverless/lambda functions to be integrated into the framework but they live in a separate folder and require a separate route structure. Remix integrates your API routes into the same router used by your application. API routes can be used for form submit, as webhooks, or as an open REST API. Remix is fully full stack and since Remix knows both your server and client code, it enables progressive enhancements and optimizes for the network tab / the request waterfall in a way that is truly more than just server-side rendering React.

Remix is full stack but it is also capable of running in places where your typical MERN stack or PHP website cannot run. Remix runs with Deno, Node.js, Netlify, Vercel, Cloudflare Workers and Pages, and much more. Remix runs everywhere.

## Remix runs everywhere

Remix is capable of running on long-running servers, serverless environments, and the edge. Hence, Remix is capable of adapting to your use case much better than any other framework. I believe Remix is currently the easiest way to build a simple REST API and deploy it to the edge.

The edge is one of the areas where I believe that Remix is really accelerating a trend by making the edge accessible to frontend and backend developers alike. I believe that Remix is the next evoluational step from everything we learned through the JamStack, SRR React frameworks, and SPAs. Remix combines serverless and edge environments, server-side capabilities, and the full power of client-side React in one framework. You can still use all JamStack third-party services and take advantage of lambda but you don't loose the server part, instead you get rid of frustratingly long build times of JamStack. So when I say "Remix runs everywhere", I virtually mean everywhere: your client-side app, your server-side logic, on long-running and serverless and edge environments, with Deno, Node.js, and cloudflare workers, with Netlify, Vercel, fly.io and much more. No other API nor web framework shows that kind of adaptability by also providing such a high-level abstraction.

## API-first

Remix can also be used to create standalone APIs or both a REST API and a web app **both through the same file-based router**. Hence, Remix is a framework to build for the web and provides the means to create integrated services that can have both client and server-side capabilities. This sets it apart from Next.js and Gatsby that would struggle to be used other than to build React apps.

I fully think that Remix is capable as an backend framework to replace express or fastify to create REST APIs. I truly believe, Remix can be used to build API-first, app-second. The other way around is obviously more common, UI-first but even then it is trivial with Remix to open up some ressource routes as an open API for third-party requests or webhooks - all within the same file-based router. No `functions/` folder with a duplicated folder structure required, no new request/response API, the same primitives for both document and API/REST/ressource requests.

Remix is full stack and has made me more productive through intuitive mental models and conventions that allow me to create API routes (ressource routes) and nested layouts for my web apps in **one app** and in **one language** without leaving my route module files.

Conclusively, You can build RESTful APIs with Remix without ever adding a web UI. But you can also quickly add a UI to an existing API made with Remix. With Remix, you can easily deploy your APIs at the edge.

## Abstraction layer

I am currently working as a frontend developer. It turns out bigger coorporations have separete teams for frontend and backend code.

Remix enables frontend/web devs to handle the backend in JavaScript. Intuitive (HTTP/RESTful-ish) backend abstraction.

Remix enables backend/API devs to work close to the frontend (touch the same codebase) or even enable backend devs to quickly add a frontend to their APIs.

- Remix enables frontend devs to touch the backend and for backend/API devs to build frontends for their APIs

Remix apps thrive in microservice architectures where they fetch and aggregate data from different backends _on the server_ and implement the business logic before returning the data to the client (avoiding over-fetching as well). Remix apps can easily forward client-requests to other backends and act as adapters but without the complexity of client-side fetching.

## Remix supports Real-Time

Remix's fetch API implements server-sent events (alternative to webosckets) and it also easily integrable with websockets (like socket.io) through the express adapter.

## Router-first render-anything

Remix is a compiler for its underlying routing system. There has been much work recently to abstract React from the Remix router. Hence, Remix is able to integrate with other frontend libraries/frameworks. I believe Remix could successfully be used together with templating engines and render things such as PDFs, emails, or even voice (SSML) either as part of a web app or standalone. Remix can be used to create state-of-the-art web apps but it embraces the full potential of the web platform including the HTTP protocol (headers, cookies), progressive enhancements, browser APIs (fetch, Response, Request), and a more frontend framework/library agnostic view with Vue & Svelte support in development.

`twitterEmbed: https://twitter.com/crim_codes/status/1542684471195045889`

## Levers

## Use the platform

A thin abstraction level ensures that new browser features will be easily integratable in Remix apps.

## Progressive enhancement

Support old environments while still ensure that new environments have the latest features.

# Future trends

Future trends and what attributes of Remix make it so promising for the future:

## Edge

I mentioned before that Remix runs everywhere. That includes the newest edge environemnts such as Deno Deploy, Cloudflare pages and workers, and Netlify edge functions. Compute on the edge is the latest development in cloud computing (after the success of serverless) and promises to greatly reduce round-trip times. I frimly believe that Remix is one of the reason why the edge has seen so much attention from web developers this year. Remix hardcore promotes platforms such as cloudflare workers and Deno deploy. Remix is accelerating the edge by making it easy for web developers to take advantage of the edge.

## VR/AR

There is [a push](https://www.w3.org/TR/webxr/) to bring VR/AR to the web platform and the browser. A lot of [cool people](https://twitter.com/sarah_edo/status/813150071558651908) are working on it! Maybe will be as easy as integrating media queries in the CSS and progressive enhancement on the JavaScript-side. Either way, there will be more devices with different needs and requirements. Remix is built from the ground up to use the platform to progressively enhance experience.

## 3D

Same as for VR/AR, 3D is going to be a bigger thing in the future. More and more sites integrate 3D assets into their sites (check out the globe [on the stripe landing page](https://stripe.com/)). I believe Remix is going to be in a prime position to make 3D rendering efficient (network-wise) but also make it integrate nicely with existing code (we saw a great demo at Remix conf).

## Offline

I can imagine that in the future - even though everything is going to be more online - there will also be a greater need for local data (aka. offline) that is synched with the cloud. The annoying buzzword is fog computing... Let's just say because of distributed computing, peer-to-peer systems, privacy concerns, and performance reasons there might be times where data should be stored solely offline or in a hybrid fashion. I believe that the latest react-router changes and Remix show a lot of potential for a router that can work as an abstraction for offline, online, and hybrid data manipulation use-cases.

## Data-driven and AI

> "Data is the new (s)-oil"

-> I have to find a reference for that quote.

More and more websites drive growth through data-driven solutions (recommender systems, analytics) or integrate some sort of AI-based system (chat bots, search). Remix allows route-based loading of scripts (handle export), allows for server-side tracking, easy integration of cookie data and sessions that allow easy integrations with AI backends.

https://twitter.com/swyx/status/1528906372917604352

## Interconnected / (IoT, Microservices)

Websites communicate with more and more third-party and micro services. Remix backend loaders and actions act as filters and abstraction layers that securely communicate with those services and keep them (and their secrets) away from the client. Avoid overfetching. Composition-based business logic.

=> This is all work in progress and I would love to hear some feedback! Just some initial thoughts! :)

# Conclusion

It's great to see how far Remix has come since its launch and there is more to come. The team behind Remix frequently emphasizes that they have great plans for the future of Remix and that there is so much more potential. I agree and I am super excited for the future of the web with Remix. I believe that Remix is greatly positioned to drive the future of the web and I hope I was able to convey my enthusiasm in this blog post. Take care!

https://twitter.com/ryanflorence/status/1539039725029183489

Happy coding!
