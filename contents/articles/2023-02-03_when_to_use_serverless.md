---
date: 2023-01-07
title: When to use serverless
description: In this post, I want to answer the question when you might want to avoid serverless for your web applications.
categories: [App Deployment]
ignore: true
---

Serverless is a powerful cloud computing model used to tackle scale. By now, serverless is more mature than ever, but it
may also be overprescribed. In this post, I want to discuss when to use serverless and when it may do more harm than
good.

## What is serverless

Serverless is a cloud computing model developed to enable a new kind of scalability. In serverless, your code runs in a
virtual environment orchestrated by a serverless platform. The serverless platform treats your application as a function
that is called on incoming requests and shuts down after a dedicated timeout.

In serverless, your code lives in containers (some kind of isolated virtual environment that can be started and
terminated quickly). The serverless platform orchestrates your container together with all the other containers hosted
on the same platform.

Once your code is uploaded, it is bundled in the container and awaits execution. On an incoming request, the serverless
platform identifies which container to start and calls your code like a function to fulfill the request. Your code is
executed and expected to return a response in a specific execution window.

The serverless platform can multiply your application if required and spawn multiple serverless function instances in
parallel. This makes serverless highly scalable.

Serverless also scales down. If your application receives no traffic, your code will never run. This usually also means
zero costs. Many cloud providers, such as AWS, offer pay-per-use pricing for serverless functions. This makes using
serverless functions incredibly cheap or even free on low traffic.

## Serverless today

The cheap pricing is one of the reasons serverless has gained popularity. Today’s hosting providers, such as Netlify and
Vercel don't offer long-running servers. Why would you need a web server anyway when you can have pay-as-you-go pricing
with serverless functions?

Netifly and Vercel build on top of AWS Lambda to offer competitive offerings for cheap. I assume these offerings would
not be possible without the pay-per-use pricing of AWS Lambda and other serverless platforms.

Serverless is used for many different application architectures. One popular architecture implemented with serverless is
the microservice architecture. With serverless, each microservice can be implemented as a serverless function and
started upon request.

Through providers such as Netlify and Vercel, serverless is also used to run server-side web application code, which
historically was hosted on long-running web servers.

## The old days

Web development historically included maintaining a web server. A computer somewhere (maybe in your basement) that you
had to set up to serve incoming web traffic. Even when the web server was hosted by a provider, one had to administer
the server, install security updates, and provision SSL certificates.

Most non-JavaScript web frameworks, including PHP-based frameworks, Ruby on Rails, and popular Python frameworks, run on
long-running servers. Generally, a web server is started once and stops running in case of an upgrade, re-deploy, or
when the service is sunset.

Over time, hosting providers offered more and more services around web hosting such as automatic SSL certificate
provision and automatic security updates.

Of course, cloud computing also revolutionized web hosting. Popular hosting providers such as Heroku (RIP) and now
[Render](render.com), [Fly](fly.io), or [Railway](railway.app) and of course also cloud platforms such as AWS allow you
to deploy long-running web servers for state-of-the-art web applications.

Many of these services provide great developer experiences and cheap pricing similar to serverless. The line between
long-running servers and serverless definitely becomes a bit vague.

However, one big distinction stays. Long-running servers do not shut down after timeout and request execution and mostly
are not built for scale.

## Scale

Serverless is built for scaling

Serverless a computing model created to manage scale. Scalability inevitably comes with complexity. Everything is more
complicated when scale is an issue.

Serverless is a model used to enable scale and make it manable. However, since it is supposed to be scalable it comes
with limitations that prevent you for doing simple things (because they wouldn't scale).

## The price of scale

Serverless is a computing model associated with cloud computing where your application is treated as a function and
orchestrated by the cloud platform provider. Your application is called upon when an event occurs. A serverless function
is started specifically for an incoming request (also referred to as cold start). Each request runs in an isolated
environment. After a designated timeout, the serverless function will be terminated. Any application context such as
closures, cached application state, and global variables is lost.

## Do you really need scale?

It's important to note what scale means...Depending on the task and source, an Node.js Express server can handle several
thousand requests per second.

E.g. the bun.sh websites notes that an Node.js server can handle around 20k requests to render a React page on the
server (while bun can do significantly more).

So when we are talking about scale we mean, scale so that it can handle more than several thousand of requests a second.

This should give you a good idea when severless becomes an absolute must. Of course there are also alternatives to
serverless when we reach that level of scale, but serverless has become somewhat of a industry standard in many areas.

I also want to note that one might reach these numbers quicker than one thinks, tens of thousands of requests a second
doesn't equal tens of thousands of users a second. If you send off several fetch requests per page transition, then you
might have to consider that.

Either way, we are talking about thousands of user interactions per minute in order to reach this kind of traffic

## Conclusion

Depending on the hosting provider, web servers have access to the filesystem and handle multiple incoming requests at
once. This means several requests can share a global application state.

It is important to note that serverless environments come with a very different set of requirements than basic web
servers. Some things that are easily solved on long-running servers require more involvement on serverless . However,
the solutions provided by serverless are designed to be scalable. For instance, web servers create database connections
during startup and share these connections across all incoming requests. Serverless functions must create a new database
connection for every incoming request. Creating a new database connection can become a bottleneck for incoming requests
and may lead to delays or timeouts. Additionally, database servers only support a limited number of open connections at
a time. Opening a new connection per serverless function may exceed the maximum number of connections. Serverless offers
connection pooling as one way to counteract these issues. Connection pooling allows different functions to share
connections across different instances. This is a common pattern with serverless. Things that work with long-running
servers require more considerations with serverless. Serverless is designed to scale, but scale also introduces
complexity as a byproduct. Scaling inevitably introduces complexity. Once you need to think about scaling long-running
servers, you may run into many problems that serverless already solves for you. For instance, many serverless
environments implement load balancing out of the box. Where serverless focus lies on scalability, edge computing focuses
on providing geographic proximity. Most edge environments are also serverless environments and share the same advantages
such as scalability and pay-per-use pricing. What makes edge environments special is their proximity to the end users.
Edge functions are regionally distributed – for instance on the servers of a CDN. The created proximity can
significantly decrease response times. Most server and serverless environments do not automatically distribute your
application across different regions. At least not without additional configuration overhead and additional costs. Edge
computing allows you to distribute your web application across the globe out of the box. When deploying to a hosting or
cloud provider, the application code will run on one of the following abstraction layers: • Server (contains operation
system) • Virtual machines (usually contain operation system) • Containers (contain language runtime) • V8 Isolates
(contain the context of your program) Long-running servers can run directly on a physical server, in a virtual machine,
or in a container. Serverless functions usually utilize container images (or similar tools like MicroVMs). Most edge
environments utilize V8 Isolates instead of serverless containers, as indicated in Table 3.2. This makes edge functions
start significantly faster than serverless functions as they can avoid the costly cold start of the language runtime. •
V8 refers to Chrome’s underlying JavaScript engine V8 that is also utilize by Node.js and Deno. V8 Isolates reuse the
same language runtime and do not require a cold start of the surrounding language runtime. Edge environments come with
their own limitations and considerations. In general, edge functions are the most limiting when it comes to their
runtime capabilities. One limitation is that deploying on the edge requires a distributed database solution. Otherwise,
response times will be delayed by the communication between the edge functions and your database server far away.
Nothing is for free. Each environment comes with its own set of considerations. Next, we will connect the dots and
create a conclusion for how to select the right deployment target for a given use case. Over the years, I build some
significant skeptitism towards severless-first for web applications and associated web servers.
