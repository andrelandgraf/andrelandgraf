---
date: 2023-03-25
title: Using the full stack of the web platform
description: What is the full stack of the web platform and why does it matter?
categories: [React, Remix.run, Web Development]
imageUrl: https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1679782741/andrelandgraf.dev/full-stack-of-web-platform_hajxuw.png
imageAltText: A diagram showcasing client-server communication. A client requests a resource from a server. The server responds with the resource.
---

I previously wrote about [how Remix is a full stack framework for the web](blog/2022-07-16_why_remix_is_not_a_react_framework_but_a_full_stack_web_framework). In this article, I want to explain what the full stack of the web is and why I believe it matters to understand what the full stack of the web is.

## Websites and web servers

If we generalize a bunch, we can say that a website is a collection of files served by a web server. Browsers are clients that request resources from web servers.

![A diagram showcasing client-server communication. A client requests a resource from a server. The server responds with the resource.](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1679782741/andrelandgraf.dev/full-stack-of-web-platform_hajxuw.png)

It doesn't matter what stack you use to build a website or web app, it will always build on top of the client-server architecture of the web platform.

## The tools of the web platform

The web platform consists of protocols, standards, and APIs that we use to build our applications.

On the client, we may use DOM and browser APIs, HTML, CSS, and JavaScript to build our user interfaces. On the server, we use the web's Fetch API and the HTTP protocol to communicate with the client.

The web platform offers tools on both the client and the server.

## Giving up the server

The web platform has always included a web server. However, when building out an application, we can always give up control of the web server and use a third-party service to host our application.

Client-side React apps (such as [Create React App](https://create-react-app.dev/)) consist only of static files and don't need to be hosted on a web server. A third-party CDN (Content Delivery Network) is sufficient to host the files.

![Diagram showcasing a React app running on a browser being served by a third-party CDN.](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1679784116/andrelandgraf.dev/client-side-react-via-cdn_xm1vn7.png).

For any required backend capabilities, we can also implement a GraphQL or REST API server. These are backend servers, but do not have to be hosted on a web server. We can use a third-party service to host our API server. We see this kind of architecture when using the [MERN (MongoDB, Express, React, Node) stack](https://www.mongodb.com/mern-stack).

![Diagram showcasing a React app served by a third-party CDN communicating with an Express.js backend connected to a MongoDB database.](https://res.cloudinary.com/andre-landgraf/image/upload/v1679784376/andrelandgraf.dev/full-stack-mern-app_yioyrc.png).

Similarly, [Jamstack](https://jamstack.org/) promotes the usage of third-party providers to replace traditional web servers.

![A diagram showcasing the Jamstack architecture. Third-party CDNs, CMSs, and APIs are used. The web app only consists of a frontend connected to these third-party services.](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1679783629/andrelandgraf.dev/jamstack-architecture_o70ffh.png)

In both cases, we are giving up control of the web server and missing out on the tools of the web platform that are available on the server.

## Full stack apps

Full stack is a broad term. In the context of web apps, the full stack usually refers to the client, the server, and potentially a database.

Jamstack and MERN stack apps are full stack applications. However, when implementations give up control of the web server, they are missing out on the tools of the web platform that are available on the server.

In this case, these full stack apps do not have access to the full stack of the web platform.

![A diagram showcasing a full stack web app that consists of a web frontend, a backend running on the web server, and a database.](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1679784628/andrelandgraf.dev/a-full-stack-web-app_jhdcup.png)

This is a subtle but important distinction. A MERN-app - when serving the frontend React SPA from a third-party CDN - has no access to the web server that receives the requests for the files of the frontend.

Of course, this is not a problem if we don't need the tools of the web platform that are available on the server. However, tools such as HTTP caching headers, cookies, and HTTP redirects can be very useful.

## Full stack web apps

Our MERN app can be refactored to serve the frontend from the Express.js backend which then is promoted from standalone API backend to a web server with API capabilities.

```javascript
app.use(express.static(path.join(__dirname, '../client/build')));
```

Just like that, we regain access to the tools of the web platform that are available on the server. Now we can add middlewares to the Express.js backend to add HTTP caching headers, cookies, and HTTP redirects.

## You can't not have a framework

In 2014, Ryan Florence wrote a [blog post](https://blog.ryanflorence.com/you-cant-not-have-a-framework.html) titled "You can't not have a framework".

If we try to use React's latest features without a framework, we end up building our own custom one. There is no way around it (we can't not have a framework).

## Full stack web frameworks

Full stack web frameworks are a new category of frameworks that span across both the client and the frontend and give us access to the tools of the web server. They usually control our app's build process, routing, and runtime.

Full stack web frameworks provide a lot of functionality out of the box that go far beyond rendering React on the server. Kent C. Dodds calls these framworks [the web's next transition](https://www.epicweb.dev/the-webs-next-transition).

![Diagram showcasing a Next.js and a Remix.run application that span across the full stack of the web platform.](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1679785492/andrelandgraf.dev/nextjs-remix-full-stack-examples_x1ns9y.png)

## Owning the full stack of the web platform

When owing the full stack of the web platform, we have access to all the tools the web platform provides. This usually allows us to build more performant and flexible applications.

Instead of having to do everything on the client, we can span across the full stack of the web platform.

## X + web server

We don't have to give anything up in return for owning the web server. When using the latest web frameworks, we basically get the web server for free, while still enjoying the benefits of React, easy hosting solutions, and third-party services.

It might have been different a few years ago, but today, hosting and maintaining a web server using one of the latest web frameworks is a breeze.

Today's hosting providers provide amazing developer experiences and make it easy to deploy our apps to the edge, serverless functions, or a traditional web server. You can refer to [this blog post](https://andre-landgraf.dev/blog/2022-12-03_different-dimensions-of-remix-deploy-targets) about the sheer amount of hosting options for apps built with Remix.

## Conclusion

Apps can be full stack web apps without having access to the full stack of the web platform. However, it is the access to the full stack of the web platform that allows us to access all the tools of the web platform.

The web server is half of the web platform and lets us access tools of the web that the client has no access to. When giving up control of the web server, we loose access to these tools.

The latest web frameworks span across the full stack of the web platform and give us access to the tools of the web server.
