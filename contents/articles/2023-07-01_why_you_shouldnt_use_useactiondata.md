---
date: 2023-01-07
title: Why you shouldn't use useActionData
description: In this post, I want to discuss why I believe you should think twice before using action data over a redirect or session cookie.
categories: [Remix.run]
---

One of my favorite things about Remix is its data mutation capabilities. Remix promotes the usage of forms to describe mutations in a declarative way. However, one hook I am fighting with is `useActionData`. In this post, I want to discuss why I believe you should think twice before using action data over a redirect or session cookie.

## Remix's mutation capabilities

Remix offers a full stack solution for data mutations. On the frontend, Remix's `Form` and `useFetcher().Form` components let us define mutations declaratively. On the backend, route-level `action` functions handle incoming form submits (and any other none-GET HTTP requests).

Remix provides solutions for error handling, automatically revalidates your client-side loader data after every mutation (form submission), and provides hooks such as `useTransition` to easily derive pending states.

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

On the client, we declare our mutation via named input fields and Remix's `Form` component. On submission, Remix will execute a fetch request to our specified `action` function.

On the server, our `action` function handles the request, parses the form data, validates the user input, and persists the data. We redirect the user to a success page.

The best part? This code works without JavaScript. When using Remix's `action` function and form components, you get progressive enhancement out of the box. By default, Remix can fall back to the browser's default behavior (of actually submitting a form).

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

We replace the `redirect` response with a JSON response.

We can then access the data with the `useActionData` hook, similar to how you access `loader` data through the `useLoaderData` hook:

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

`useActionData` allows us to quickly add mutation feedback such as inline form validation errors or success messages to our page. By adding the `typeof action` we are even able to infer the type of `data`. Very convenient indeed.

When I first got started with Remix, I was convinced `useActionData` was the way to go for all my forms. I have since then changed my mind.

## Downsides of using action data

### Form reusability

Forms don't always live inside the route module component. A contact form can easily be refactored into a reusable component and reused across different routes. Maybe we place the form into the footer of our website? It is now accessible from any page in our app!

By submitting to the `/contact` route module, we also trigger a navigation to that page. That is the browser's default behavior on form submission.

Unfortunately, returning action data and not a redirect response prevents us from redirecting the user back to their current page.

It seems like we have to decide to either allow the form to be reusable or be able to return action data - not both.

### Breaking accessibility

`useFetcher` is a powerful hook that allows us to create submissions that don't trigger a page navigation. With `useFetcher`, we can submit to resource routes (routes without a route component) to access action data:

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

Without JavaScript, our `fetcher.Form` is just a form element. A submission will again create a navigation to the resource route. If our action function returns no redirect but data, then we will be lost on a browser tab that displays JSON data to the screen.

Of course, once we know about this pitfall we can avoid it by either working with redirects instead or keeping the `action` function in the same route module as our form. However, I dislike that using Remix's most powerful features together (resource routes, `useFetcher`, and action data) break progressive enhancement.

### Fighting with action data persistence

I ran into issues when trying to work with action data to communicate submission success.

Action data persists on the page until new action data is loaded (a new submission has successfully executed and returned new data). This is annoying when displaying a small success message under a form:

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

The success message will persist even if the user re-submits the form. Intuitively, the message should disappear once a new form is submitted.

In reality, the message stays on the page until the new submission has loaded the new action data. If the old and new action data matches, then the old `Joined!` message will never leave the screen.

Fixable of course:

```tsx
import { Form, useActionData, useTransition } from '@remix-run/react';

export default function Component() {
  const data = useActionData<typeof action>();
  const transition = useTransition();
  const isSubmitting = transition.state !== 'idle';
  return (
    <Form action="/contact" method="post">
      <h1>Join email list</h1>
      <input name="email" type="email" required />
      <button type="submit">Join</button>
      <p aria-live="polite">{data?.success && !isSubmitting && 'Joined!'}</p>
    </Form>
  );
}
```

In this case, we were able to fix our experience rather quickly. It becomes more complicated when we want to show a success toast message for a few seconds and then make it disappear after the user closes the toast or a certain timeout happens.

Again, it's possible, but now we have to do some serious state management to make it happen.

## When to use action data

We can summarize that it is "save" to use action data and the `useAction` data hook (as well as `useFetcher().data`) when:

- The form and action function are in the same route module.
- The form is not reused across different routes.
- Accept that the action data persists on the page until a new submission has been successfully be executed.

## Better alternative: session cookies

Luckily, Remix also provides helpers for working with session cookies. The [`flash` function](https://remix.run/docs/en/v1/utils/sessions#sessionflashkey-value) allows us to write something to the session cookie for one read only.

We can easily write to the cookie in our `action` function using `flash` and immediately after that read from the cookie in a `loader` function. We can redirect in our `action` function and return the session state as part of our loader data: win, win.
