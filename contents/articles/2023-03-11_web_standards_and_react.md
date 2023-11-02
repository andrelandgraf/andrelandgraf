---
date: 2023-03-11
title: My experience learning React, web standards, and Remix
description: In this blog post, I am sharing my story of learning React, web standards, and Remix, and answer the question why I actively try to use less React.
categories: [React, Remix.run]
imageUrl: https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1678651924/andrelandgraf.dev/how-react-made-me-a-web-dev_hi1nwx.png
imageAltText: Circle showing the relationship between moving fast, quick results, positive feedback, and growing motivation. Moving fast enables quick results which results in positive feedback, which in turn motivates to keep moving fast.
---

{% tweet url="https://twitter.com/brophdawg11/status/1587103251723337729" /%}

You might have seen the #useThePlatform hashtag on Twitter. People usually add the hashtag when discussing embracing the web platform and using native web APIs whenever possible. In this blog post, I want to share my story of learning React, Web APIs, and Remix.

## My React journey

React is an amazing tool, and I owe much of my career to it. I learned React in a class called "Web Application Engineering" during my Master's degree. The goal of the class was to practice team-based software development, and the MERN (MongoDB, Express.js, React, Node.js) stack was recommended for the accompanying semester-long team project.

My team and I picked up React and worked on [an app for teachers to publish and grade multiple-choice homework](https://github.com/andreweinkoetz/high5-learning-frontend).

I spent way too much time on the project. Luckily, we got rewarded with good grades. But more importantly, I got hooked (not a React hooks pun, I started with React a few months before [hooks were introduced](https://www.youtube.com/watch?v=dpw9EHDh2bM&t=4s)).

React fit beautifully into my mental model of programming. Coming from a theoretical CS background, creating classes and functions to return UI felt natural. Where HTML and CSS felt weird and quirky, React felt intuitive and easy to learn.

I had some previous experience with PHP5 and jQuery, but I never thought about becoming a web developer. React changed this. React made me feel like I was able to move fast and that motivated me to get going.

I used much of the following summer to go through React and JavaScript content from Wes Bos and got a working student position as a React developer a few months later.

Above all things, React allowed me to ignore the complexity of the web platform. Instead of trying to learn different web and browser APIs all at once, I turned every problem I encountered into a React problem. This allowed me to get good at one thing and move fast. Something that turned out to be very rewarding.

![Circle showing the relationship between moving fast, quick results, positive feedback, and growing motivation. Moving fast enables quick results which results in positive feedback, which in turn motivates to keep moving fast.](https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1678651924/andrelandgraf.dev/how-react-made-me-a-web-dev_hi1nwx.png)

## Back to the web platform

A few years later Ryan Florence and Michael Jackson started tweeting about Remix. I loved the early content on the Remix YouTube channel, so I bought a license and joined the Remix Discord server.

Over the summer of 2021, I spent a lot of time learning Remix and following the discussions in the Remix Discord. It was perfect timing for me as I had some free time and was eager to try out something new.

The early days in the Remix Discord server were awesome. I learned a lot by reading through the discussions of so many knowledgeable and passionate developers.

It turns out that many of the problems I solved with React could actually be solved with less code by using the web platform directly.

Previously, I would write mutations like this:

```javascript
import { useState } from 'react';

function CreateTodo() {
  // Handle form data with React
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} />
      <input type="text" value={description} onChange={(event) => setDescription(event.target.value)} />
      <button type="submit">Create</button>
    </form>
  );
}
```

This works just fine. However, with a bit of refactoring, we can use the web platform directly:

```javascript
function CreateTodo() {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;
    // Use FormData to handle form data
    const formData = new FormData(form);

    await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: formData.get('title'),
        description: formData.get('description'),
      }),
    });
    // Use HTML form element to reset form
    form.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" />
      <input type="text" name="description" />
      <button type="submit">Create</button>
    </form>
  );
}
```

Especially for larger forms, this may safe us from writing a lot of boilerplate code.

With Remix we can go even further and declare the mutation declaratively:

```javascript
import { Form } from '@remix-run/react';

function CreateTodo() {
  return (
    <Form method="post" action="/todos">
      <input type="text" name="title" />
      <input type="text" name="description" />
      <button type="submit">Create</button>
    </Form>
  );
}
```

Remix encourages me to use less React state. I now try to actively reflect before reaching for React hooks. Is there a Web API I could use instead? Maybe I can move this code to the server instead?

Of course, React hooks are still useful. This example is meant to illustrate how using the web platform can safe us from writing unnecessary code. Once our use case becomes more complex, we might reach for React hooks again.

You can totally argue this is over-engineering. But I like to think of it as a way to keep my code simple and to avoid writing unnecessary code. And most importantly, this approach allows me to learn more about the web platform.

Remix allowed me to get back to the web platform and use the tools it provides. But more importantly, I got introduced to many tools of the web platform that have great synergies with React.

## React and the web platform

React is an abstraction for building composable UIs. With React DOM, React applies the abstraction to the web platform. However, there is a lot more to building web apps than just rendering states to the DOM. For instance, a web app always consists of a server and a client.

Our React app is hosted somewhere. The same way serverless functions use a server under the hood, so does our React app. I am excited to see full stack web frameworks reintroduce access to the underlying web server. This eases access to many tools of the web platform such as cookies, server-side redirects, caching headers, and more.

## #useThePlatform

For me, #useThePlatform came at the right time. I was motivated to learn more about the web platform and enhance my React apps by taking advantage of the full stack of the web platform.

The rise of full stack web frameworks such as Next.js, Remix, SvelteKit and others seemed to have motivated more people to do the same.

It might be a coincidence, but it's really cool to see that the new React docs seem to emphasize the web platform as well. For instance, the new documentation promotes the `FormData` API for [reading input values on submit](https://beta.reactjs.org/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form).

## Conclusion

React is an amazing tool. I value that React allowed me to solve so many problems solely with React. By reducing the complexity for me as a beginner, React allowed me to move faster, get immediate results, and stay motivated.

It's great to see that full stack frameworks add more tools for us to use when building web apps with React.

With React Server Component, it seems that React also has plans to take advantage of the full stack of the web platform in new ways.

I am excited to see what the future holds for React and the web platform.

Happy coding!
