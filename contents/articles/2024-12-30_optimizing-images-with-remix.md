---
date: 2024-12-30
title: Optimizing images with Remix
description: Markdown is a great tool for working with formatted text content, including code blocks. In this blog post, we set up Shiki for syntax highlighting with Markdoc and Remix.
categories: [Remix.run, Web Development]
ignore: true
---

When it comes to optimizing a website, images are a great place to start. Reducing gigabytes—or at least megabytes—of image data can dramatically improve your site's performance and web vitals, and it’s often a quick win. But how do you build an effective image optimization solution for your project?

In this talk, we’ll explore creating custom pipelines for resizing and converting images to modern formats, setting up streaming and HTTP caching, and comparing serverless solutions to long-running servers. We’ll also take inspiration from viral examples like McMaster’s use of image sprites to load product images efficiently. Let’s discuss image optimization to create truly epic web experiences!

## Context

I recently created a custom image optimization solution for allthingsweb.dev, and it has been a lot of fun. I learned a lot about server memory management, file streaming, and, of course, image optimization. The main code is inspired by a Gist from Jacob Ebey about using sharp in a Remix resource route. However, I want to focus this talk on HTTP streaming, serverless vs. long-running servers, and other takeaways that are framework-agnostic.

## Re-inventing the wheel to learn

Start simple to learn how things work. Then enhance custom solution with battle tested once, have confidence that you know how it works!

Build you own custom img component for our image opt pipeline, then replace with https://unpic.pics/img/

## Optimizing images in Remix public folder

### Sharp

## Next.js image package

## Local solution vs. SaaS

## CDN images

## Unpic https://unpic.pics/

## Long-running servers with serverless funcitons

All things web as motiviation

PRs 
1 npx create-remix
2 add img tags to a few images in public folder
3 create endpoint to optimize these images to webp & update URLs in img tags
4 update endpoint to resize, update URLs to include w & h & auto
5 create custom image component to abstact/hide that logic away
6 replace custom component with unpic for srcset with custom parse fn
7 bug fix by seb?



