---
date: 2022-12-03
title: Different dimensions of Remix deploy targets
description: Remix is very flexible when it comes to deploying your application. In this article, we will explore the different dimensions of Remix deployment targets.
categories: [Remix.run, App Deployment]
imageUrl: https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1670291051/andrelandgraf.dev/deployment-targets-table_mnjygi.png
imageAltText: Table mapping Remix deployment targets to different dimensions
---

![Table mapping Remix deployment targets to different dimensions](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1670291051/andrelandgraf.dev/deployment-targets-table_mnjygi.png)

Remix is very flexible when it comes to deploying your application. You can deploy your Remix app to a variety of platforms and environments. We can go as far as to say that Remix can run anywhere where JavaScript can run. In this blog post, we will explore different dimensions of Remix deployment targets.

## Deployment Targets in Remix

When creating a new Remix app with `npx create-remix@latest`, we have to select a deployment target. These are hosting provider and JavaScript runtime specific targets. The Remix team provides an adapter package and starter project for each listed deployment target.

Currently, the following deployment targets are officially supported:

- Remix App Server
- Express Server
- Architect (AWS Lambda)
- Fly.io
- Netlify
- Vercel
- Cloudflare Pages
- Cloudflare Workers
- Deno

Picking the right deployment target for your application is important. There are a lot of considerations and requirements that play into this decision. So let's break it down into different dimensions.

## The different dimensions

We can identify the following dimensions:

- Hosting provider / cloud platform
- Hosting service
- JavaScript runtime
- Hosting environment
- Application environment

Please note that the terms I am using here come from my own intuition. I am not aware of any better widely-used terms for these dimensions.

## Hosting provider / cloud platform

Most Remix deployment targets are hosting provider or cloud platform specific. The adapter is meant to make Remix run on a specific platform. Other targets are generic and can be deployed to different platforms.

The generic deployment targets are:

- Remix App Server
- Express Server
- Deno

For instance, the Remix App Server and Express Server applications can be executed wherever Node.js can run.

Considering the associated or other potential hosting providers for an deployment target is probably the most important aspect of choosing a deployment target.

## Hosting service

Most hosting providers and cloud platforms offer several different services that use different computing models and technologies. Some hosting providers may offer several services that can be used to host a Remix application.

For example, both Cloudflare Pages and Cloudflare Workers can be used to host a Remix application. Also, Vercel and Netlify now offer edge environments which can be used with Remix (even though there isn't an official Remix deployment target out yet for these environments).

Services differ in their functionality, pricing, and utilized technologies.

## JavaScript runtime

Different services and different hosting providers and cloud platforms support and utilize different JavaScript runtimes. Popular server-side JavaScript runtimes are:

- Node.js
- Deno
- Bun
- Workers runtime (workerd)

Each Remix deployment target is meant to run on one of these runtimes:

- Remix App Server: **Node.js**
- Express Server: **Node.js**
- Architect (AWS Lambda): **Node.js**
- Fly.io: **Node.js**
- Netlify: **Node.js**
- Vercel: **Node.js**
- Cloudflare Pages: **Workers runtime (workerd)**
- Cloudflare Workers: **Workers runtime (workerd)**
- Deno: **Deno**

Please note that some hosting providers such as Netlify, Vercel, and AWS offer several different services that may use different environments (e.g. such as edge environments) that may run different JavaScript runtimes.

The underlying runtime has implications on what kind of packages and functionality can be executed in your Remix app.

## Hosting environment

Different services use different hosting environments. These hosting environments best fit into these three categories:

- Long-running server
- Serverless
- Edge

**Long-running server environments** are environments in which your web server is run continuously. **Serverless environments** utilize the serverless computing model to execute your application like a function on every incoming request. **Edge environments** distribute your application _to the edge_ of the network and also follow a serverless computing model.

The line between these hosting environments is blurry. Some long-running server environments might shutdown after a timeout in which no request came in similar to how serverless functions terminate (e.g. the now sunset Heroku free-tier). Both serverless and long-running server environments can utilize geographic distribution to offer edge-like geographic proximity to users.

I define edge as an environment that is running on a CDN or the users' devices. Edge computing traditionally is defined as computing that happens on the user's device (e.g. car, laptop, drone, or smart home device). I would argue that regionally distributed containers should be considered edge-like or regionally distributed, but not edge environments. But that just emphasizes how blurry the lines between these different environments are.

Each Remix deployment target maps to one hosting environment:

- Remix App Server: **Long-running server**
- Express Server: **Long-running server**
- Architect (AWS Lambda): **Serverless**
- Fly.io: **Long-running server**
- Netlify: **Serverless**
- Vercel: **Serverless**
- Cloudflare Pages: **Edge**
- Cloudflare Workers: **Edge**
- Deno: **Edge**

Please note that the generic deployment targets are in theory flexible and could be used in other hosting environments. For instance, the Deno deployment target when deployed to Deno deploy runs in an edge environment. However, it could potentially be used in a long-running server environment as well.

The hosting environment has serious implications for your application's behavior. Filesystem access, pricing, scalability, distribution, maximum application size, response times, and supported capabilities (e.g. keep-alive, WebSocket) heavily rely on both your hosting provider and service and their hosting environment.

## Application environment

Your application's process runs in some sort of environment. On localhost or an OG home server, your application may run on a physical machine and its operation system. Hosting providers and cloud platforms utilize virtual application environments to run your application (for security and orchestration reasons).

We can identify the following virtual application environments:

- Virtual machines (VM)
- microVMs
- Containers
- V8 Isolates

Please note that the container landscape is particularly fragmented. There are several different container technologies and standards. Not everything that uses a Docker image is a [Docker container](https://www.docker.com/resources/what-container/) ([1](https://fly.io/blog/docker-without-docker/)). For example, AWS Lambda uses [Firecracker](https://firecracker-microvm.github.io/) which creates so called microVMs that run on top of **KVM (Kernel-based Virtual Machine)**. These microVMs are specifically optimized for faster startup times and other serverless use cases.

Shout-out to [Brian LeRoux](https://twitter.com/brianleroux) for [pointing out](https://twitter.com/brianleroux/status/1599545856516321281) that MicroVMs behave differently then traditional containers.

So how do these application environments differ? I use the following intuition for these environments:

- **Virtual machines** mostly include an operation system on their own. VMs boot up in minutes and are measured in Gigabytes.
- **microVMs** virtualize the kernel to some extend but are more lightweight than VMs. KVMs boot up in milliseconds (may reach a few seconds) and are measured in Megabytes.
- **(Docker) Containers** run on top of a host operating system. Usually, containers are measured in Megabytes and boot up in a few seconds.
- **V8 Isolates** are an V8 (JavaScript engine used in Chromium, Node.js, and Deno) mechanism and only include the code of your application in a very lightweight sandbox. V8 Isolates boot up in nanoseconds and are measured in Kilobytes (may reach a few Megabytes).

Different hosting environments utilize different application environment to orchestrate and run your application. Currently they usually map as follows:

- Long-running server: **Generic (VM, MicroVM, Container)**
- Serverless: **Container or MicroVM**
- Edge: **V8 Isolate**

Each Remix deployment target may map to several or one application environment:

- Remix App Server: **Generic**
- Express Server: **Generic**
- Architect (AWS Lambda): **MicroVM**
- Fly.io: **MicroVM** ([1](https://fly.io/blog/sandboxing-and-workload-isolation/))
- Netlify: **MicroVM**
- Vercel: **MicroVM**
- Cloudflare Pages: **V8 Isolate**
- Cloudflare Workers: **V8 Isolate**
- Deno: **V8 Isolate**

The underlying application environment has additional implications for your application especially regarding cold start times and application size.

## Conclusion

It is amazing that Remix provides such flexibility. However, that flexibility also means that you as a developer have the responsibility to pick the right deployment target for your own use case and your application requirements.

There are a lot of factors that play into the decision of picking a deployment target. The outlined dimensions play an important role in understanding the different considerations that affect the decision.

I hope this overview helps you to make a better choice for your own app!

Cheers and happy coding!
