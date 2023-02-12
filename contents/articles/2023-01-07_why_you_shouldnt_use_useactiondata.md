---
date: 2023-01-07
title: Why you shouldn't use useActionData
description: In this post, I want to discuss why I believe you should carefully consider whether to use action data.
categories: [Remix.run]
---

One of my favorite things about Remix is its ability to perform data mutations. Remix encourages the use of forms to describe mutations in a declarative way. However, there is one hook that I just can't seem to get along with: `useActionData`. In this post, I want to discuss why I believe you should carefully consider whether to use action data.

## Remix's mutation capabilities

Remix offers a comprehensive solution for data mutations. On the frontend, Remix's `Form` and `useFetcher().Form` components allow us to describe mutations declaratively. On the backend, route-level action functions process incoming form submissions (and any other non-GET HTTP requests).

In addition, Remix offers solutions for error handling, automatically revalidates your client-side loader data after every mutation (form submission), and provides hooks like `useTransition` to easily derive pending states.

All of this comes with almost no boilerplate. A simple contact form route module can look as simple as this:

```tsx
// /routes/contact.tsx route module
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

On the client, we declare the mutation via named input fields and Remix's `Form` component. This eliminates the need for React state, callbacks, or `useEffect` hooks to keep track of input state.

When a user clicks `Join` Remix prevents the browser's default behavior and initiates a fetch request to the specified `action`.

On the server, the `action` function handles incoming requests. Our code parses the form data, validates the user input, persists the data, and redirects the user to a success page.

The best part? This code works even without JavaScript! When using Remix's `action` function and form components, you get progressive enhancement out of the box. By default, Remix can fall back to the browser's default behavior (of actually submitting a form).

## Using useActionData

Remix also supports returning a JSON response from an `action` function:

```tsx
// /routes/contact.tsx route module
import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
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

Instead of using a `redirect`, we use a JSON response. We can access the returned data with the [`useActionData` hook](https://remix.run/docs/en/v1/hooks/use-action-data), similar to how we access loader data with the `useLoaderData` hook:

```tsx
// /routes/contact.tsx route module (continued)
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

`useActionData` allows us to display session feedback, such as inline form validation errors or success messages to our page. By adding the `typeof action` we can even infer the type of `data`!

When I got started with Remix, I was convinced `useActionData` was the way to go for all my forms. I have since then changed my mind.

A form submission creates a navigation to the action's route module. A redirect allows us to direct the user to any page after the action has been executed. Returning a JSON response instead means that we will stay on the action's route. This is a reasonable limitation. Unfortunately, when we take a closer look, it turns out the limitation may create some pitfalls.

## Downsides of using action data

[The Remix documentation](https://remix.run/docs/en/v1/hooks/use-action-data#notes-about-resubmissions) highlights form resubmission concerns when using `useActionData`. The docs also state that "the decades-old best practice is to redirect in the POST request. This way, the location disappears from the browser's history stack, and the user can't 'back into it' anymore".

The Remix folks most certainly know about the different trait-offs of using `useActionData`. I just want to highlight some pitfalls that are currently not talked about in the docs.

In the following, I break down my concerns into three separate issues:

- Form reusability
- Breaking progressive enhancement
- Fighting with action data persistence

Please note that the concerns and pitfalls discussed can be countered or avoided. The last point is also highly subjective. I am discussing these points only because I personally struggled with trying to make action data work before ultimately preferring to avoid it as much as possible.

### Form reusability

Forms don't always live inside the route module component. A contact form can easily be refactored into a reusable component and reused across different routes. Maybe we even place the form into the footer of our website? It is now accessible from any page in our app!

By submitting to the `/contact` route module, we also trigger a navigation to that page. That is the browser's default behavior for form submissions.

Unfortunately, returning action data instead of a redirect `Response` prevents us from redirecting the user back to their current page.

It seems like we have to decide to either allow the form to be reusable or be able to return action data - not both.

One solution to fix this issue is to use `useFetcher` instead, but this may break progressive enhancement...

### Breaking progressive enhancement

`useFetcher` is a powerful hook that allows us to create submissions that don't trigger a page navigation.

For instance, we can create a reusable contact form component like so:

```tsx
// Reusable component used anywhere in our app
import { useFetcher } from '@remix-run/react';

export default function ContactForm() {
  const fetcher = useFetcher();
  return (
    <fetcher.Form action="/contact" method="post">
      <h1>Join email list</h1>
      <input name="email" type="email" required />
      <button type="submit">Join</button>
      <p aria-live="polite">{fetcher.data?.success && 'Joined!'}</p>
    </fetcher.Form>
  );
}
```

Now we can use the contact form throughout our application to let users join our email list. Since `fetcher.Form` doesn't trigger a page navigation, we won't need to redirect and can use the action data to communicate session feedback such as `Joined!` or `Already joined!`.

`useFetcher` has many great use cases, but using it to submit to any route without triggering a navigation, unfortunately, breaks progressive enhancement. Without JavaScript, the `fetcher.Form` is just a form element. Upon submission, it will create a navigation to the resource route.

This creates two branches in the app's experience:

- With JavaScript: A contact form submission keeps the user on the current route and correctly displays the action data.
- Without JavaScript: The contact form submission navigates the user to the contact route and does not display the action data.

In some cases, this may be acceptable, but I personally don't like that we end up at two different routes. I don't think creating two different experiences like that is maintainable. And unfortunately, it's hard to notice if one is not actively testing with JavaScript disabled.

The problem becomes even more critical when submitting to a resource route (a route without a route component):

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

With `useFetcher` we can submit to a resource route and receive the action data at the app's current location. However, if JavaScript is not enabled, fails to load, or is still loading, then such a submission will leave us stranded on a browser tab displaying JSON data on the screen.

You might think: "This is not the fault of `useActionData` or `useFetcher().data`, but an issue of how you use it". That's fair. My point is that most of Remix's features encourage progressive enhancement and emulate the browser's default behavior. Using action data and `useFetcher` together deviates from the browser's default behavior - a pitfall that is hard to notice.

### Fighting with action data persistence

This last point is highly subjective. So please let me guide you through my thought process.

What kind of data do we return from an action? A successful mutation revalidates all loader data; that's where you return your business data. What's left is session feedback such as form validation errors or success feedback for the user.

[The Remix documentation](https://remix.run/docs/en/v1/hooks/use-action-data) mentions form validation errors as the most common use-case for `useActionData`. I tried to make the following use cases work with action data:

- Show inline form validation errors for input fields.
- Render a global error message to the user that the user can discard.
- Display a temporary toast success message and hide it after a timeout.

I ran into a lot of issues trying to make action data work for these use cases. Mostly because of the way that action data persists until new action data is loaded (a new submission has successfully executed and returned new data).

When managing fetch requests ourselves, then updating our React state to reset our application is quite straightforward.

```tsx
const onXClick = useCallback(() => setErrorMessage(''), []);
```

When working with action data, anything we want to reset ourselves such as a temporary toast message or an error message that can be discarded requires complicated React state and `useEffect` gymnastics.

I dare you to implement a temporary toast message that pops up if `useActionData` returns a `{ success: true }` JSON object! There are just so many edge cases that make this exercise highly complicated.

Just to give one example:

```tsx
const fetcher = useFetcher();

useEffect(() => {
  if (fetcher.data?.success) {
    showToastForMs('Success!', 5000);
  }
}, [fetcher.data]);
```

We display a success toast message if a new form submission returns `{ success: true }`.

What do you think happens if we submit the same form again and the `action` function again returns `{ success: true }`?

Action data persists and never resets. When receiving the same action data, then we won't even notice that new action data has been received. Our `useEffect` won't be triggered again.

This is fixable of course. We can infer if we should reset our React state based on `useTransition().state` or `useFetcher().state`, but the resulting `useEffect` won't be pretty.

Again, the described concerns are all solvable, but my point is: Remix lets us avoid complicated client-side state and `useEffect` shenanigans - one of the reasons I fancy it so much.

Using action data:

- Prevents us from redirecting the user.
- May break progressive enhancement in combination with `useFetcher`.
- Introduces complicated client-side state management when using it to display temporary session feedback.

## When to use action data

We can summarize that it is "save" to use action data when:

- The form and `action` are in the same route module.
- The form is not reused across different routes.
- Accept that the action data persists on the page until a new submission has been executed.

## Better alternative: session cookies

Luckily, Remix provides alternative ways to communicate session feedback to the client. I am a big fan of using a session cookie with loader data!

The [`flash` function](https://remix.run/docs/en/v1/utils/sessions#sessionflashkey-value) allows us to write something to the session cookie for one read only.

We can write to the cookie in our `action` function using `flash`, **redirect** the user to any route, and in the following loader revalidation, immediately read from the cookie in a `loader` function and return the session state from there.

When using session cookies, we can redirect in our `action` function and return the session state as part of our loader data: win, win.

## Conclusion

Using action data comes with hidden pitfalls. When used with the `Form` component, action data breaks form reusability. When used with `useFetcher`, then we might create branches in our application experience or break progressive enhancement altogether. I also think that using action data for form feedback is surprisingly complicated as there are many edge cases to consider.

When used correctly, `useActionData` works just fine and might be more convenient to implement than a session cookie. Like always, there are trait-offs to each approach.

I hope I was able to raise some awareness of the potential pitfalls of `useActionData`!

Cheers and happy coding!
