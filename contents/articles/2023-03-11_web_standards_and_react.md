---
date: 2023-03-11
title: My experience with web standards and React
description: Why I am learning web standards and doing less with React.
categories: [React, Remix.run]
imageUrl: https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1678608694/andrelandgraf.dev/how-react-made-me-a-web-dev_dfxxwk.png
imageAltText: Circle showing the relationship between moving fast, quick results, positive feedback, and growing motivation. Moving fast enables quick results which results in positive feedback, which in turn motivates to keep moving fast.
---

`twitterEmbed: https://twitter.com/brophdawg11/status/1587103251723337729`

You might have seen the #useThePlatform hashtag on Twitter. People usually add the hashtag when discussing embracing the web platform and using native web APIs whenever possible. In this blog post, I want to share my experience with web standards and React.

## My React journey

React is an amazing tool, and I owe much of my career to it. I learned React in a class called "Web Application Engineering" during my Master's degree. The goal of the class was to practice team-based software development, and the MERN (MongoDB, Express.js, React, Node.js) stack was recommended for the accompanying semester-long team project.

My team and I picked up React and worked on [an app for teachers to publish and grade multiple-choice homework](https://github.com/andreweinkoetz/high5-learning-frontend).

I spent way too much time on the project. Luckily, we got rewarded with good grades. But more importantly, I got hooked (not literally, this was a few months before [hooks were introduced](https://www.youtube.com/watch?v=dpw9EHDh2bM&t=4s)).

React fit beautifully into my mental model of programming. Coming from a theoretical CS background, creating classes and functions to return UI felt natural. Where HTML and CSS felt weird and quirky, React felt intuitive and easy to learn.

I had some previous experience with PHP5 and jQuery, but I never thought about becoming a web developer. React changed this. React made me feel like I was able to move fast and that motivated me to get going.

I used much of the following summer to go through React and JavaScript content from Wes Bos and got a working student position as a React developer a few months later.

Above all things, React allowed me to ignore the complexity of the web platform. Instead of trying to learn different web and browser APIs all at once, I turned every problem I encountered into a React problem. This allowed me to get good at one thing and move fast. Something that turned out to be very rewarding.

## Back to the web platform

A few years later Ryan Florence and Michael Jackson started tweeting about Remix. I loved the early content on the Remix YouTube channel, so I bought a license and joined the Remix Discord server.

Over the summer of 2019, I spent a lot of time learning Remix and following the discussions in the Remix Discord. It was perfect timing for me as I had some free time and was eager to try out something new.

The early days in the Remix Discord server were awesome. I learned a lot by reading through the discussions of so many knowledgeable and passionate devs.

It turns out that many of the problems I solved with React could actually be solved with less code by using the web platform directly. But more importantly, I got introduced to many tools of the web platform that had great synergy with React.

## React and the web platform

React is an abstraction for building composable UIs. With React DOM, React applies the abstraction to the web platform. However,the web platform not only includes the client-side, but also of the server-side. A web app is always a combination of client-side and server-side code.

Even if we don't have access to it, our React app is hosted somewhere on a server. The same way serverless functions still use a server under-the-hood, so does our React app.

I am a big fan of the movement of full stack web frameworks that reintroduce access to the server-side. Remix provided a perfect gateway into this world for me. Remix allowed me to unlock so many more tools of the web platform such as cookies, server-side redirects, caching headers, and more that I previously had no access to with the SPA + REST API architecture.

## #useThePlatform

For me, #useThePlatform came at the right time. I was motivated to learn more about the web platform and I was able to apply it in my daily work.

The rise of full stack web frameworks such as Next.js, Remix, SvelteKit and others seemed to have motivated more people to do the same.

It might be a coincidence, but it's really cool to see that the new React documentation on beta.reactjs.org seem to emphasize the web platform way more. For instance, the new documentation promotes the `FormData` API for [reading input values on submit](https://beta.reactjs.org/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form).

## Conclusion

React is an amazing tool. I use it for many things that are probably better solved outside of React. I wouldn't say my path into web development was the most efficient, but it worked for me.

I now try to actively reflect before reaching for React's hooks. Maybe there is another way to solve the problem? Maybe I can move this code to the server instead?

However, I still value the fact that React allowed me to solve so many problems solely with React. By reducing the complexity for me as a beginner, React allowed me to move faster, get immediate results, and stay motivated.

I am excited to see more #useThePlatform content and I am super excited for the future of the web, React, and Remix.

The React team is working on React Server Components for a long time. It is another sign that React is embracing the full stack of the web platform. It's going to be exciting to see how they will integrate with Web APIs on the server.

Happy coding!
