---
date: 2023-03-25
title: Taking advantage of the full stack of the web platform
description: In this article, I explain in more detail what I mean by the full stack of the web platform. I make a case that having access to both the client and server runtime matters.
categories: [React, Remix.run, Web Development]
imageUrl: https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1679795914/andrelandgraf.dev/full-stack-of-web-platform_ykh5pg
imageAltText: A diagram showcasing the different tools the web platform offers across the client and the server. On the client, the web platform provides standards such as HTML, CSS, and JavaScript and APIs such as the DOM and browser APIs. On the server, we have access to the HTTP request-response cycle and server-only capabilities of HTTP.
---

![A diagram showcasing the different tools the web platform offers across the client and the server. On the client, the web platform provides standards such as HTML, CSS, and JavaScript and APIs such as the DOM and browser APIs. On the server, we have access to the HTTP request-response cycle and server-only capabilities of HTTP.](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1679795914/andrelandgraf.dev/full-stack-of-web-platform_ykh5pg.png)

I previously wrote about [how Remix is a full stack web framework](blog/2022-07-16_why_remix_is_not_a_react_framework_but_a_full_stack_web_framework). I argued that Remix gives you access to the full stack of the web platform. In this article, I want to explain in more detail what I mean by the full stack of the web platform. I want to make a case that having access to both the client and server runtime matters.

## Websites and web servers

Let's start by reviewing the architecture of the web platform.

![A diagram showcasing the client-server model. A client requests a resource from a server. The server responds with the resource.](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1679795190/andrelandgraf.dev/client-server-model_rotjin.png)

The web is a distributed platform and works on a client-server model.

- Websites are a collection of files that are hosted on web servers.
- Web browsers request resources over the internet from web servers.
- Web servers respond with the requested resources (or other HTTP responses).

When building for the web, it always comes down to the client-server model. We can't build a web application without a client and a server.

{% statement %}
It doesn't matter which tech stack we use to build our app, there will always be a web server, even if we don't have access to it.
{% /statement %}

## The tools of the web platform

The web platform consists of protocols, standards, and APIs that we use to build our applications. Since the web platform is a distributed system where the client and server are separate entities with different responsibilities, we have access to different tools on the client and server.

- Browsers parse HTML and CSS to render our UI to the screen. We further have access to the DOM and browser APIs to enhance the user experience with JavaScript.
- On the web server, we handle incoming HTTP requests. The web server controls the request-response cycle and can use the HTTP protocol to communicate with the client.

We can summarize that the web platform always includes a client and a server and that both have access to different tools of the web platform.

## Giving up the server

The web platform has always included a web server. However, when building an application, we can make the decision to give up control of the web server and use third-party services to host our application.

For instance, client-side React apps (such as [Create React App](https://create-react-app.dev/)) consist only of static files and can be hosted on a CDN (Content Delivery Network).

![Diagram showcasing a React app running on a browser being served by a third-party CDN.](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1679799531/andrelandgraf.dev/client-side-react-via-cdn_eidpxt.png).

When hosting a React app on a CDN, we give up control of the web server. It's now the CDN who is in charge of serving our app!

There are many reasons why a big part of the industry decided to give up control of the web server and focus on client-side-only apps. As always, it comes down to trade-offs.

## Client-side-heavy apps

Popular architectures such as the [Jamstack](https://jamstack.org/) or [MERN (MongoDB, Express, React, Node)](https://www.mongodb.com/mern-stack) promote the implementation of client-side React apps that fetch data from REST and GraphQL APIs.

![Diagram showcasing the Jamstack and MERN architectures. In both cases, a React app is served by a third-party CDN communicating with backend APIs.](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1679797361/andrelandgraf.dev/jamstack-and-mern_mmtkqy.png).

When focusing on client-side-heavy apps, we might decide to give up the tools of the web server as we focus on the client runtime.

## Full stack apps

Full stack is an overloaded term. When talking about web apps, full stack usually refers to an application that consists both a of client and a server environment.

MERN apps involve both a client-side React app and a standalone Express.js REST or GraphQL API server. Similarly, Jamstack promotes client-side apps that fetch data from REST and GraphQL APIs.

Both architectures are clearly full stack. Conclusively, an application can be a full stack app without a web server.

That's where I want to emphasize the difference between full stack (has a frontend and a backend) and having access to the full stack of the web platform (owning the client and the web server runtime).

This is a subtle but important distinction. A MERN or Jamstack app - when serving the frontend React SPA from a third-party CDN - has no access to the web server that receives the document requests.

Of course, this is not a problem if we don't need the tools available on the server or if the CDN provides configuration options for the tools we need. However, maybe it's time to reconsider the trade-offs of giving up the web server.

## Full stack apps + web server

MERN is not opinionated about how to serve the client-side React app. We can choose to serve the app from a third-party CDN or from our own web server.

Promoting our standalone Express.js API server to a web server is as simple as adding a single line of code to our Express.js app:

```javascript
app.use(express.static(path.join(__dirname, '../client/build')));
```

Just like that, we use Express.js to serve our React app. From here, we can regain access to the tools of the web platform that are available on the server. For instance, we could add Express.js middlewares to add HTTP caching headers, work with cookies, and utilize HTTP redirects.

{% statement %}
By implementing our own web server, we gain access to the full stack of the web platform.
{% /statement %}

## You can't not have a framework

In 2014, Ryan Florence wrote a [blog post](https://blog.ryanflorence.com/you-cant-not-have-a-framework.html) titled "You can't not have a framework".

Imagine we continue to build our MERN app without a framework. We would have to implement a lot of boilerplate code to reach the same level of functionality as today's frameworks provide.

Even worse, if we try to use React's latest features without a framework, we end up building our own custom framework! There is no way around it, we can't not have a framework.

## Full stack web frameworks

Full stack web frameworks are a new category of frameworks that span across both the browser and the server runtime.

Full stack web frameworks offer tons of functionality out of the box to build great user experiences. Also, features such as client-server type inference and code co-location provide an amazing developer experience. Kent C. Dodds calls these frameworks [the web's next transition](https://www.epicweb.dev/the-webs-next-transition).

Coming from MERN, it is mind-blowing to see how much functionality we can get out of the box with a full stack web framework and how much boilerplate we can avoid. But most importantly, in the context of this article, these frameworks give us access to the tools of the web server.

## Owning the full stack of the web platform

When owning the full stack of the web platform, we have access to all the tools the web platform provides.

The web server provides access to the HTTP request object. On incoming request, we can determine the user's language, light/dark mode preference, and more. We also have access to HTTP cookies and redirects to manage user sessions.

These tools allow us to enhance the user experience, avoid unnecessary network requests, and improve the performance of our application.

When deciding if something should be implemented on the client or on the server, we should always consider the trade-offs. Some things are better off implemented on the server and some other things can simply not be done on the client. Having access to both sides of the web platform gives us the flexibility to make the right decision.

For instance, when using large libraries, it might be better to use them on the server to avoid bloating the client bundle.

Or when fetching data, we might want to fetch data on the server to filter out unused fields before sending the data to the client to avoid overfetching.

## X + web server

I think it is important to understand that we don't have to give up anything when owning the full stack of the web platform. Especially when using the latest web frameworks, we basically get access to the web server for free.

It might have been different a few years ago, but deploying a web server today is as simple as deploying static files to a CDN.

Today's hosting providers provide amazing developer experiences and make it easy to deploy to the edge, serverless functions, or traditional web servers.

## Conclusion

The full stack of the web platform includes the client (web browser) and server (web server). Websites and web apps have always been full stack; however, we saw a shift in the industry towards focusing on the client runtime.

Giving up control of the web server means missing out on the tools of the web platform that are available on the server.

Today's full stack web frameworks, such as Remix and Next.js, make working with a web server as easy as working with a client-side React app. Conclusively, there is no reason to give up control of the web server anymore. Instead, the latest frameworks let us take advantage of the full stack of the web platform.
