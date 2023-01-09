---
date: 2023-01-07
title: Why you shouldn't use useActionData
description: In this post, I want to discuss why I believe you should carefully consider whether to use action data over a redirect or session cookie.
categories: [Remix.run]
---

One of my favorite things about Remix is its ability to perform data mutations. Remix encourages the use of forms to describe mutations in a declarative way. However, there is one hook that I just can't seem to get along with: `useActionData`. In this post, I want to discuss why I believe you should carefully consider whether to use action data over a redirect or session cookie.

## Remix's mutation capabilities

Remix offers a comprehensive solution for data mutations. On the frontend, Remix's `Form` and `useFetcher().Form` components allow us to describe mutations declaratively. On the backend, route-level action functions process incoming form submissions (and any other non-GET HTTP requests).

In addition, Remix offers solutions for error handling, automatically revalidates your client-side loader data after every mutation (form submission), and provides hooks like `useTransition` to easily derive pending states.

All of this comes with almost no boilerplate. A simple contact form route module can look as simple as this:

```tsx
// /contact.tsx route  module
import type { ActionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { saveContact } from '~/db/contacts';

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get('email');
  if (!email || typeof email !== 'string') {
    throw new Response('Bad Request', { status: 400 });
  }
  await saveContact(email);
  return redirect(`/joined`);
}

export default function Component() {
  return (
    <Form action="/contact" method="post">
      <h1>Join email list</h1>
      <input name="email" type="email" required />
      <button type="submit">Join</button>
    </Form>
  );
}
```

On the client, we declare our mutation via named input fields and Remix's `Form` component. No React state, callback, or `useEffect` needed!

When a user clicks `Join`, Remix will prevent the browser's default behavior for us and initiate a fetch request to the specified `action`.

On the server, our `action` function handles incoming requests. Our code parses the form data, validates the user input, persists the data, and redirects the user to a success page.

The best part? This code works even without JavaScript! When using Remix's `action` function and form components, you get progressive enhancement out of the box. By default, Remix can fall back to the browser's default behavior (of actually submitting a form).

`statement: When used correctly, mutations in Remix work even when JavaScript is still loading, hydrating, has failed to load, or is disabled/not available.`

## Using useActionData

Remix also supports returning a JSON response from an `action` function:

```tsx
// todo/create.tsx route  module
import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { saveContact } from '~/db/contacts';

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get('email');
  if (!email || typeof email !== 'string') {
    throw new Response('Bad Request', { status: 400 });
  }
  await saveContact(email);
  return json({ success: true });
}
```

Instead of using a `redirect`, we use a JSON response. This allows us to access the data with the `useActionData` hook, similar to how you can access loader data with the `useLoaderData` hook:

```tsx
import { Form, useActionData } from '@remix-run/react';

export default function Component() {
  const data = useActionData<typeof action>();
  return (
    <Form action="/contact" method="post">
      <h1>Join email list</h1>
      <input name="email" type="email" required />
      <button type="submit">Join</button>
      <p aria-live="polite">{data?.success && 'Joined!'}</p>
    </Form>
  );
}
```

`useActionData` allows us to display session feedback such as inline form validation errors or success messages to our page. By adding the `typeof action` we are even able to infer the type of `data`!

When I first got started with Remix, I was convinced `useActionData` was the way to go for all my forms. I have since then changed my mind.

## Downsides of using action data

In the following, I break down my concerns with using action data into three separate issues:

- Form reusability
- Breaking progressive enhancement
- Fighting with action data persistence

I will then go ahead and provide an alternative way of implementing session feedback with session cookies and loader data that solves the described concerns.

Please note that the concerns and pitfalls discussed can be countered or avoided. The last point is also highly subjective. I am discussing these points only because I personally struggled with trying to make action data work before ultimately preferring to avoid it as much as possible.

### Form reusability

Forms don't always live inside the route module component. A contact form can easily be refactored into a reusable component and reused across different routes. Maybe we even place the form into the footer of our website? It is now accessible from any page in our app!

By submitting to the `/contact` route module, we also trigger a navigation to that page. That is the browser's default behavior for form submissions.

Unfortunately, returning action data instead of a redirect Response prevents us from redirecting the user back to their current page.

It seems like we have to decide to either allow the form to be reusable or be able to return action data - not both.

### Breaking progressive enhancement

`useFetcher` is a powerful hook that allows us to create submissions that don't trigger a page navigation. With `useFetcher`, we can even submit to resource routes (routes without a route component):

```tsx
// resource route module /counter.tsx
import { json } from '@remix-run/node';
import { increment } from '~/db/counter';

export async function action() {
  const count = await increment();
  return json({ count });
}
```

```tsx
// route module /index.tsx
import { useActionData, useFetcher } from '@remix-run/react';

export default function B() {
  const data = useActionData();
  const fetcher = useFetcher();
  return (
    <fetcher.Form action="/counter" method="post">
      <button type="submit">Increment</button>
      {data && `Count: ${data.count}`}
    </fetcher.Form>
  );
}
```

The ability to submit to any route without triggering a navigation provides a lot of flexibility. However, if the `action` returns action data instead of a `redirect`, then using a fetcher to submit to this action function will break progressive enhancement.

Without JavaScript, our `fetcher.Form` is just a form element. Upon submission, it will create a navigation to the resource route. If our action function returns data but no redirect, we will be left on a browser tab displaying JSON data on the screen.

You might think: "This is not the fault of `useActionData` or `useFetcher().data`, but an issue for how you designed your app". My point is that most of Remix's features encourage progressive enhancement and emulate the browser's default behavior. They teach you as a developer for how to work with progressive enhancement in mind. However, using action data, `useFetcher`, and resource routes together deviates from the browser's default behavior - a pitfall that is hard to notice.

### Fighting with action data persistence

This last point is highly subjective. So please let me guide you through my thought process.

What kind of data do we return from an action? A successful mutation revalidates all loader data, that's where you return your business data. What's left is session feedback such as form validation errors or success feedback for the user.

I tried to make the following use cases work with action data:

- Show a inline input error.
- Render a global error message to the user.
- Display a temporary toast success message and hide it after a timeout.

I ran into a lot of issues trying to make action data work for these use cases. Mostly because of the way that action data persists until new action data is loaded (a new submission has successfully executed and returned new data).

Anything we want to reset ourselves such as a temporary toast message or an error message that can be discarded require complicated React state and `useEffect` gymnastics.

I dare you to implement a temporary toast message that pops-up if `useActionData` returns a `{ success: true }` JSON object! There are just so many edge cases that make this exercise highly complicated.

To give you once example, if a new form submit returns the same action data, then we won't even notice that new action data has been received.

This is fixable of course. We can infer if we should reset our React state based on `useTransition().state` or `useFetcher().state`, but the resulting `useEffect` won't be pretty.

Again, the described concerns are all solvable, but my point is: Remix lets us avoid complicated client-side state and `useEffect` shenanigans - one of the reasons I fancy it so much.

Using action data

- prevents us from redirecting the user
- may break progressive enhancement in combination with `useFetcher` and resource routes
- introduces complicated client-side state management when using it to display temporary session feedback

## When to use action data

We can summarize that it is "save" to use action data when:

- The form and `action` are in the same route module.
- The form is not reused across different routes.
- Accept that the action data persists on the page until a new submission has been successfully be executed.

## Better alternative: session cookies

Luckily, Remix provides an alternative way to communicate session feedback to the client. Instead of action data, we can use a session cookie and loader data!

The [`flash` function](https://remix.run/docs/en/v1/utils/sessions#sessionflashkey-value) allows us to write something to the session cookie for one read only.

We can easily write to the cookie in our `action` function using `flash` and immediately after that read from the cookie in a `loader` function - this will effectively remove the flashed data from the cookie already. We can redirect in our `action` function and return the session state as part of our loader data: win, win.

This allows us to:

- Use redirects to keep progressive enhancement in mind.
- Display temporary ("flashing") action data via loader data.

Now we can easily submit to resource routes, reuse our forms, and avoid some of the state and `useEffect` complexity when displaying session feedback to users.

I love that Remix provides us with different tools to do the same things. If action data works for you, then please don't let this blog post bother you! I hope I was able to raise some concerns for why `useActionData` might not always be the best way to go when working on mutations.

Cheers and happy coding!
