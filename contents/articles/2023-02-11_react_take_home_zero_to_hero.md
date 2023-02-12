---
date: 2023-02-11
title: A process for solving React take-home exercises
description: Take-home can be intimidating, especially for those new to the job market. In this blog post, I want to guide you through my process for solving React take-home exercises.
categories: [React, Interview Prep]
---

Take-home exercises are a common part of the interview process. They can be intimidating, especially for those new to the job market and trying to break into tech. In this blog post, I want to guide you through my process for solving React/frontend take-home exercises.

## Use a process to solve the problem

The goal of following a process is to divide the work into manageable tasks and conquer each task individually. Especially when new to programming, you might have too many thoughts and ideas at once, which might take away the focus required to solve tasks one by one. This is where things get overwhelming. A step-by-step process helps you to focus on one thing at a time, just like a recipe!

## I am in a hurry; just get to the point

Are you doing a take-home exercise right now? If you have time, I encourage you to read through the rest of this blog post to get a deeper understanding of the process. Otherwise, paste the following comment next to your code and follow the process step-by-step. Good luck!

My take-home exercise process:

```jsx
/**
 * How to solve React take-home exercise (from zero to hero)
 *
 * 1.) WHAT DO I HAVE TO DO?
 *  a) Skim through the instructions
 *  b) Set up the coding environment following the instructions
 *  c) Skim through existing files and folders
 *  d) Scroll through the existing code
 *  e) Create a TODO list comment somewhere central in the code
 *  f) - Read the instructions again
 *     - Break down instructions into atomic tasks
 *     - Add each task to the TODO list
 *  g) Sort the tasks by priority and dependencies.
 *     - Easy and setup tasks first
 *     - Advanced and follow-up tasks next
 *     - Complex tasks and final changes at the end
 *  h) Take a moment to understand the intention behind each task
 *     - Answer the questions:
 *       - Why am I doing this?
 *       - What skills can I show here?
 *     - Refine the tasks in the TODO list based on the findings
 *  i) Take a moment to understand the user stories
 *     - Answer the question:
 *       - Why would a user want these features/changes?
 *     - If applicable, refine the tasks based on your findings.
 *       - Potentially rephrase tasks into user stories
 *
 * -- TODO list template --
 *
 * What is required?
 * - [X] User should only be able to submit form if name and email inputs are filled out
 * - [X] User should see an error if email is not a valid email after submitting the form
 * - [X] User should not be able to use name and email with more than 120 characters
 * - [X] User should see a green "Subscribed!" message if submission was successful
 * - [X] Input fields should be emptied after successful submission so that user can start filling out form again
 * - [X] "Subscribed" message should disappear if user starts typing again
 * - [ ] …
 *
 * What are the next steps?
 * - [X] User should be able to use form on mobile (make responsive)
 * - [ ] User should see loading indication when form is submitting
 * - [ ] …
 *
 * -- TODO list template --
 *
 *   Feel free to submit your TODO list together with your code.
 *   Make sure to fix all typos and grammar errors if you do so.
 *   TODO list shows that you can break down complicated tasks.
 *
 *   Ignore the ‘What are the next steps?’ section.
 *   More to this later.
 *
 * 2.) HOW DO I DO IT?
 *    -> KEEP IT SIMPLE - DON’T OVERCOMPLICATE THINGS! <-
 *    -> DEBUGGING OVER-COMPLICATED CODE IS HARD! <-
 *
 *  For each TODO in the list, do the following:
 *  - Pick the next TODO from the TODO list
 *  - Follow the steps a to e
 *  - Test and debug the implementation after every step.
 *
 *  a) Start with the markup (HTML)
 *     - Build the static HTML of the final solution
 *     - Do not add any dynamic logic with JavaScript just yet
 *  b) Define the application states the user can be in,
 *     e.g. create enum states and boolean flags
 *  c) Add the application state in React
 *     Set each state to its default/initial state
 *  d) Implement event handlers to update the state
 *  e) Make markup conditional/dynamic based on the React state
 *
 * 3.) HOW DID I DO IT?
 *   - Think of this section as your PR description.
 *   - Add a comment above your code (after the TODO list comment).
 *   - This section is to document your implementation details.
 *   - Include information into how you solved the take-home exercise.*   - Use this section to communicate your thoughts
 *     and decisions with the interviewers.
 *
 * -- Changes documentation template --
 *
 * Implementation Details:
 * - Instead of using React state and callbacks
 *   to handle the value of each input field,
 *   I decided to use the HTML form element API
 *   to access the form values on submit.
 *
 *   This way, we can reduce the amount of state we need to manage
 *   and can avoid unnecessary re-renders.
 * - Refactored existing submit button from div to button element
 *   to take advantage of semantic HTML and improve accessibility.
 *  - …
 *
 * Open Issues:
 * - One unit test is failing due to a weird scroll issue.
 *   I was not able to fix the unit test,
 *   but left a TODO comment in the line causing the issue.
 *
 * -- Changes documentation template --
 *
 * 4.) HOW TO STAND OUT OF THE CROWD?
 *     - Once you are done and your code works,
 *       you can go ahead and improve your solution.
 *     - It is very important that you don’t do this initially.
 *     - Our priority is to solve the exercise.
 *     - Premature abstractions will make debugging
 *       and changing things harder;
 *       that’s why we think about this at last.
 *
 * a) Make things consistent
 *   a.1) Follow existing conventions:
 *    - Identify file, variable, and function naming conventions
 *    - Update your code to follow identified conventions
 *   a.2) Create additional conventions:
 *    - Identify remaining inconsistencies in your code,
 *    - Create patterns to unify it
 *    - This may include variables, functions,
 *      classes, and state naming conventions,
 *      e.g., every boolean state starts with `is..`:
 *        - `isOpen`
 *        - `isPlayingInTheBackground`
 *
 *  b) Document things
 *     - Consider adding JSDoc comments to your functions
 *     - Add inline comments where they add value
 *       (e.g., answer the question: Why did you do this?)
 *     - Read through existing comments
 *       (including TODO list and implementation details)
 *       and fix grammar mistakes and typos
 *
 *  c) Create better abstractions
 *     but be careful not to over-engineer!
 *     - Abstract duplicate code into a function or hook
 *     - Break reusable markup out into reusable component
 *     - Create context and provider to manage global state
 *     - Avoid prop-drilling
 *
 *  d) Make accessibility improvements
 *   - Good starting point:
 *     Go through MDN Web Docs Semantic HTML 5 element list
 *     and apply them in your code wherever possible
 *   - Use browser extensions, Google Lighthouse,
 *     and ESLint plugins to find accessibility errors
 *   - Add alt tags to all image elements
 *   - Use semantic HTML wherever possible:
 *     - Use button element for click actions
 *     - Use anchor tag for navigation
 *     - Instead of div use:
 *       section, main, footer, header, nav, aside, article, ...
 *   - Add aria attributes where it makes sense:
 *     - `aria-busy`
 *     - `aria-live`
 *     - `aria-hidden`
 *     - `aria-describedby`
 *     - `aria-label`
 *
 *   e) Go above and beyond (optional)
 *      - Do you still have time and motivation left?
 *      - Doing more than necessary is optional.
 *      - There is something to be said
 *        about investing too much time at one take-home exercise.
 *        Maybe the time would be better spent
 *        applying to more positions or working on your side project?
 *      - However, sometimes the instructions are open ended or
 *      - you just want to do 110%.
 *    e.1) Get creative and come up with more
 *         user stories and features
 *         - Add all new ideas to the TODO list under
 *           the section ‘What are the next steps?’
 *           Just adding these TODOs shows that you care!
 *         - If you want to invest more time, pick the first
 *           TODO and go back to step 2.
 *
 *    f) Take a break and come back with a fresh mind
 *       - Once you are done, take a break!
 *       - If you have time left, come back tomorrow with a fresh mind
 *         and review your implementation again.
 *       - You would be surprised how many typos and logic slips
 *         you can identify on another day with a fresh mind.
 *       - Fix your code and be ready to submit!
 *
 *    g) Let a friend review your code (optional)
 *       - If you have time, let someone else review your code.
 *       - Do you have a friend, mentor, or senior colleague
 *         that could review your solution?
 *       - Maybe you could meet for an hour and explain your code?
 *       - This is also a great learning opportunity!
 *
 */
```

## A process does not replace practice

To solve React take-home exercises, you must have some knowledge and practice working with React. A process can only support but does not replace experience and practice with the technology in question.

Just take this section as a disclaimer. Processes are great when the size and complexity of the task and not its small pieces are the problem. If the knowledge is there, but the exercise is too overwhelming, then a process comes to the rescue.

## Step-by-step walk-through

Let’s use an example take-home exercise to apply the process. We will use a practice take-home exercise I came up with for a recent tutoring session.

To get started, fork this [CodeSandbox](https://codesandbox.io/s/contact-form-react-exercise-lbvsod) to create your own environment.

### WHAT DO I HAVE TO DO?

First, get a feeling for the exercise and existing code. Do the following tasks in whatever order feels natural to you:

- Skim through the instructions
- Set up the coding environment following the instructions
- Skim through existing files and folders
- Scroll through the existing code

After doing these steps, you should have a vague idea of the file structure and code that already exists, vaguely know what you have to implement, and be able to run the code on your machine or remote environment.

**Example:** Following our example take-home exercise, after reading the instructions you might have picked up that the exercise is to extend an existing `ContactForm` component. After investigating the file and folder structure, you should have spotted the component in the `/src/ContactForm.js` file.

Maybe you also already identified that the component is rendered inside the `App` component in `/src/App.js`. Also, you may have gathered that there are some existing CSS classes in `/src/ContactForm.css`, some of which are not in use yet - an indication that we should use them.

Next, let's create a TODO list to structure the tasks.

#### The TODO list

A TODO list is a great way to manage tasks. Everything you have to do to solve the take-home exercise should be documented in the TODO list.

Make sure to break-down the instructions into manageable tasks. Make sure that each task is small enough that it doesn't feel overwhelming based on your own experience.

You can use the following TODO list template.

```jsx
/*
 * What is required?
 * - [ ] …
 * - [ ] …
 * - [ ] …
 *
 * What are the next steps?
 * - [ ] …
 * - [ ] …
 * - [ ] …
 */
```

Paste the code comment in your code, refer to the instructions, and start creating TODO items.

**Example:**

```jsx
/*
 * What is required?
 * - [ ] User should see an error message when trying to submit without first inputting a email and name
 * - [ ] User should see an error if email is not a valid email after submitting the form
 * - [ ] User should not be able to input more than 120 characters for both email and name input values
 * - [ ] User should see a green "Subscribed!" message if submission was successful
 * - [ ] Input fields should be emptied after successful submission so that user can start filling out form again
 * - [ ] "Subscribed" message should disappear if user starts typing again
 *
 * What are the next steps?
 */
```

After we translated the instructions into a TODO list, we can read through our tasks and sort them by complexity and dependencies.

In our case, the TODOs seem to be in a good order.

We also already made sure to phrase our TODOs from a user-perspective. Just a nice touch that shows that you care about the [user story](https://en.wikipedia.org/wiki/User_story).

Next, let's take a moment to think about the intent behind this exercise.

#### Why this exercise?

It's good to take a step back to think about the motivation behind this exercise before starting to code. This may let you focus on the right things.

Sure, you have applied for a React position and this is a React take-home exercise, but what are the specific skills and knowledge required for the identified tasks?

**Example:** There seems to be an emphasis on form validation and managing user input. The instructions seem to be more focused on dynamic UI updates based on user interactions.

Now that we have a sense for why we do this exercise and have our TODO list set up, let's start coding!

### HOW DO I DO IT?

Before we actually get started to code, one last thing...

#### Start simple

This is probably the most important part of this process. Try to focus at one thing at a time and do not stop in the middle to create an abstraction.

You have many good ideas and intentions, but please trust me when I tell you to start very simple. Don't be too smart. Don't over-engineer things.

If you over-engineer things, you will make it harder for yourself to change things later. Also, you will just end up debugging your over-complicated code when you could already be done.

Start very simple and get it to work first. Once it works, we can make it more pretty (if necessary).

`statement: Keep it simple and make it work. Do not over-complicate things and don't add premature abstractions.`

Maybe I sound a bit harsh here. I have lost countless of hours trying to fix my stupid over-engineered code. I have learned the hard way that you should start easy and do one thing at a time. I know how hard this is but maybe you are smarter than me ;)!

Anyways, let's get going!

#### For each TODO do:

Pick the next TODO from the list and follow these steps:

1. Start with the markup (HTML)

- Build the static HTML of the final solution
- Do not add any dynamic logic with JavaScript just yet

2. Define the application states the user can be in,
   e.g. create enum states and boolean flags
3. Add the application state in React
   Set each state to its default/initial state
4. Implement event handlers to update the state
5. Make markup conditional/dynamic based on the React state

##### Task 1

**Example:** The first TODO reads: "User should see an error message when trying to submit without first inputting a email and name".

Let's inspect the current code:

```jsx
import './ContactForm.css';

export default function ContactForm() {
  function subscribe() {
    console.log('a new subscriber!');
  }
  return (
    <form class="contact-form">
      <h2>Newsletter</h2>
      <div className="contact-form__fieldset">
        <label>Name:</label>
        <input />
      </div>
      <div className="contact-form__fieldset">
        <label>Email:</label>
        <input />
      </div>
      <div className="contact-form__button" onClick={subscribe}>
        Subscribe
      </div>
    </form>
  );
}
```

There is currently no error message. We currently only `console.log` on submission.

1. First, let's think about the static HTML that we have to add to display an error message.

Maybe something like this:

```jsx
<p>Please insert a name and email address. Both are required.</p>
```

Good enough for now. We want to keep it simple.

Add the error message where it makes sense, e.g. below the submit button. Make sure to run the application and ensure your changes are visible on the screen. We want to debug early and often!

You might have a few more ideas in mind for how to design the error message, but let's get going and keep it simple!

2. Next, let's define the application states.

Don't confuse step 2 with step 3! We are not talking about React state just yet. Usually, your UI changes because the user triggers an action. Actions transition the UI from one state to another.

It's a great idea to think about your UI states before adding React state for it. In our case, our goal is to show an error message if a submission happened without a name or email value. This only requires two states:

- Don't show error message
- Show error message

Since it's only two states, you can use a boolean flag to represent both states (`true` or `false`).

Step 2 is more about designing than coding. We made up our mind about the required state and are now prepared to move on to step 3!

3. Translate the application state to React state

Now that we thought about our application state, we can go ahead and add the required React state.

We know that we have to check the value of the name and email input fields. We also know that we have to conditionally render an error message and that our application can be in two different states.

```jsx
import './ContactForm.css';
import { useState } from 'react';

export default function ContactForm() {
  // boolean flag to represent our two application states
  const [showError, setShowError] = useState(false);
  // states for each input field
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  console.log({ showError, name, email });

  function subscribe() {
    console.log('a new subscriber!');
  }
  return (
    <form class="contact-form">
      <h2>Newsletter</h2>
      <div className="contact-form__fieldset">
        <label>Name:</label>
        <input />
      </div>
      <div className="contact-form__fieldset">
        <label>Email:</label>
        <input />
      </div>
      <div className="contact-form__button" onClick={subscribe}>
        Subscribe
      </div>
      <p>Please insert a name and email address. Both are required.</p>
    </form>
  );
}
```

Make sure to set the three states to their initial values.

Finally, we run our application to see if it still works without crashing and move to the next step. We add `console.log` statement to make sure our changes work as intended.

4. Implement event handlers

Next, we have to implement the event handlers to update our state on user action. The `name` and `email` states should be in sync with the input fields. It is common practice to implement this using `onChange` handlers.

Further, we have to validate the `name` and `email` states in the existing `subscribe` event handler function.

```jsx
import './ContactForm.css';
import { useState } from 'react';

export default function ContactForm() {
  // boolean flag to represent our two application states
  const [showError, setShowError] = useState(false);
  // states for each input field
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  console.log({ showError, name, email });

  function subscribe() {
    if (!name || !email) {
      // transition application to error state
      setShowError(true);
      console.log('name or email not set', { name, email });
      return;
    }
    console.log('a new subscriber!');
  }
  return (
    <form class="contact-form">
      <h2>Newsletter</h2>
      <div className="contact-form__fieldset">
        <label>Name:</label>
        <input
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <div className="contact-form__fieldset">
        <label>Email:</label>
        <input
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <div className="contact-form__button" onClick={subscribe}>
        Subscribe
      </div>
      <p>Please insert a name and email address. Both are required.</p>
    </form>
  );
}
```

We add the required changes and also add `console.log` statement to verify everything works as expected.

Run the application and check the console. The `name` and `email` states should now be in sync with the changes in the input field.

Also, the 'a new subscriber!' message should not appear in the console anymore when clicking 'Subscribe' with an empty email or name input field.

After all the bugs are fixed, we can move on to the last step.

5. Make markup dynamic based on state changes

We know based on our `console.log` statements that our states are set correctly when the user fills out the input fields and submits the form. All that is left is to conditionally render and hide the error message based on our boolean flag:

```jsx
import './ContactForm.css';
import { useState } from 'react';

export default function ContactForm() {
  // boolean flag to represent our two application states
  const [showError, setShowError] = useState(false);
  // states for each input field
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  console.log({ showError, name, email });

  function subscribe() {
    if (!name || !email) {
      // transition application to error state
      setShowError(true);
      console.log('name or email not set', { name, email });
      return;
    }
    console.log('a new subscriber!');
  }
  return (
    <form class="contact-form">
      <h2>Newsletter</h2>
      <div className="contact-form__fieldset">
        <label>Name:</label>
        <input
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <div className="contact-form__fieldset">
        <label>Email:</label>
        <input
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <div className="contact-form__button" onClick={subscribe}>
        Subscribe
      </div>
      {showError && <p>Please insert a name and email address. Both are required.</p>}
    </form>
  );
}
```

Congratulations, we successfully solved the first task of the take-home exercise! 🎉

Make sure to mark the first TODO in your TODO list as solved - so satisfying!

**How are you feeling?**

Was it easy? This is a great sign that the process worked! 😎

Was it too easy? Maybe you are already more experienced with React and these changes feel natural to you? In this case, feel free to do the steps 3 - 5 in one go without debugging between each step. You may also want to make the user stories bigger, this way you can work on several related small tasks together. This is a good way to incrementally increase your speed of development.

Was it too hard? This can happen and it's okay. Between every step, feel free to Google for help, read related blog posts, make breaks, and take it step by step. A take-home exercise is a great opportunity to learn and practice!

Let's get going!

##### Task 2

The next task reads: "User should see an error if email is not a valid email after submitting the form".

Uff, this one seems to be more advanced. How do we check if a string is a valid email address?

```jsx
email.includes('@'); // 😅❔
```

When in doubt, use Google (or ChatGPT): "How to validate email input".

It might be tempting to google for the right Regex (regular expression) or helper function to check if a string is a valid email. I encourage you to keep your Google queries more open. If too narrow, you won't find alternative (easier) solution approaches.

Instead of asking for how to solve it one particular way, just ask Google how to solve it in general. Maybe there is a web standard that we can use to make our life simpler!

It turns out there is an input attribute called `type` which can be set to "email". This way we can avoid implementing a regular expression.

It's always a good idea to search for a web standard or web API to solve your problems before trying to solve it with React.

1. Add the static markup HTML

```jsx
import './ContactForm.css';
import { useState } from 'react';

export default function ContactForm() {
  // boolean flag to represent our two application states
  const [showError, setShowError] = useState(false);
  // states for each input field
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  console.log({ showError, name, email });

  function subscribe() {
    if (!name || !email) {
      // transition application to error state
      setShowError(true);
      console.log('name or email not set', { name, email });
      return;
    }
    console.log('a new subscriber!');
  }
  return (
    <form class="contact-form">
      <h2>Newsletter</h2>
      <div className="contact-form__fieldset">
        <label>Name:</label>
        <input
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <div className="contact-form__fieldset">
        <label>Email:</label>
        <input
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <div className="contact-form__button" onClick={subscribe}>
        Subscribe
      </div>
      {showError && <p>Please insert a name and email address. Both are required.</p>}
    </form>
  );
}
```

Apparently, all we need to do is to add `type="email"` to our input field.

Let's try it out. Run the application, insert a name, insert a invalid email, and click "Subscribe".

Weird... Why are we not seeing a validation error? I encourage you to start debugging and googling on your own. Try to identify the issue. Why is the error not showing?

This is totally normal. We see a solution online, try to apply it, but we lack some context around the solution and it just doesn't fit to our own code.

It turns out that input field validation is tied to form submissions. The current code uses an HTML form element but not a real submit button. Hence, we are not really submitting the form.

The current code uses a `div` with an `onClick` handler to call the `subscribe` function. Refer to step 4.d) to why this is bad practice. We should always strive to use a `button` for click actions, not a `div`.

Good to know that our process would have caught this issue anyways. It might be that the interviewers didn't know better or maybe they created this issue on purpose to spot who would be able to identify the accessibility issue? Either way, let's improve the static markup!

```jsx
import './ContactForm.css';
import { useState } from 'react';

export default function ContactForm() {
  // boolean flag to represent our two application states
  const [showError, setShowError] = useState(false);
  // states for each input field
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  console.log({ showError, name, email });

  function subscribe() {
    if (!name || !email) {
      // transition application to error state
      setShowError(true);
      console.log('name or email not set', { name, email });
      return;
    }
    console.log('a new subscriber!');
  }
  return (
    <form class="contact-form">
      <h2>Newsletter</h2>
      <div className="contact-form__fieldset">
        <label>Name:</label>
        <input
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <div className="contact-form__fieldset">
        <label>Email:</label>
        <input
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <button type="submit" className="contact-form__button" onClick={subscribe}>
        Subscribe
      </button>
      {showError && <p>Please insert a name and email address. Both are required.</p>}
    </form>
  );
}
```

We now use a button of type `submit` to submit the form.

Run the code again and insert a name and an invalid email. Great, the browser now displays an error message for us in case the user inputs an invalid email address. No regex and only minimal code changes required!

2. Application state

Since the browser implements the error message for us, there is really no more application state that we have to add on our own.

3. React state

The same goes for our React state. We have everything we need.

4. Implement event handlers

It seems like we got everything we need. But when it comes to testing interactions, we might want to make sure and test our application.

What happens if the user inserts no email and no name, or a valid email and a name? - The page does a full page reload.

If you haven't seen this, google: "Form reloads page in React". If you worked with forms in React before, you know that we should implement an `onSubmit` event handler to prevent the browser's default behavior of actually submitting the form.

Since our `subscribe` function should run on submit anyways, we can just move it from `onClick` to `onSubmit`. Either way would be fine though.

```jsx
import './ContactForm.css';
import { useState } from 'react';

export default function ContactForm() {
  // boolean flag to represent our two application states
  const [showError, setShowError] = useState(false);
  // states for each input field
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  console.log({ showError, name, email });

  function subscribe(e) {
    // avoid form submission
    e.preventDefault();
    if (!name || !email) {
      // transition application to error state
      setShowError(true);
      console.log('name or email not set', { name, email });
      return;
    }
    console.log('a new subscriber!');
  }
  return (
    <form class="contact-form" onSubmit={subscribe}>
      <h2>Newsletter</h2>
      <div className="contact-form__fieldset">
        <label>Name:</label>
        <input
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <div className="contact-form__fieldset">
        <label>Email:</label>
        <input
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <button type="submit" className="contact-form__button">
        Subscribe
      </button>
      {showError && <p>Please insert a name and email address. Both are required.</p>}
    </form>
  );
}
```

Great, it looks like our app now behaves as expected and we were able to solve the second TODO! 💃

Please note that using a regular expression would have also been a valid implementation. When possible, we should take advantage of the web platform and avoid reinventing the wheel. However, just a note, that if you want to use a different implementation, that is great as well! This is just one out of many implementations.

`statement: When in doubt, search for a web API to solve your problem.`

##### Task 3

The third TODO reads: "User should not be able to input more than 120 characters for both email and name input values".

Great! This one seems to be easier again. We could add a second error message and error state and basically do the same as for task 1.

However, based on our learnings from task 3, maybe the input field can also validate max length for us?

Again, both implementations are fine, but since we want to use web standards whenever possible to avoid unnecessary JavaScript code, we can do a quick Google search.

Apparently, there is a `maxLength` property on the input field! Our struggle from the previous task paid for itself! We can apply the same pattern for this TODO.

1. Update the HTML

Let's add the `maxLength={120}` property to both input fields and test our implementation. Insert a very long string into the input field and see what happens!

Turns out the browser won't let you input more than 120 characters anymore. Great!

Disclaimer: Maybe it would be better to add an error message so the user actually knows what's happening? How do you interpret the instructions? Sometimes it's hard to know what exactly is the expected behavior based on the instructions.

This is a great time to add a comment in the code to communicate your thoughts!

```jsx
/*
 * Using `maxLength` input attribute to prevent users from
 * inserting too much text.
 * Currently no error message displayed, user just prevented
 * to insert more text.
 * Could potentially also add an error message to improve
 * user experience and communicate reasoning.
 */
```

We want to keep it simple and we are not done with all TODOs yet. When in doubt, add a comment somewhere and move on!

Since we solved the task already, we can move on right to the next one!

##### Task 4

Task 4 reads: "User should see a green "Subscribed!" message if submission was successful".

Let's get started! 🤓

1. Add the HTML

Let's add the success message.

```jsx
<p>Subscribed!</p>
```

The user story states that the message should be green. We remember that there were some existing CSS classes. Turns out there is one already for our success message.

```jsx
<p className="contact-form__success-message">Subscribed!</p>
```

We run the code and see the success message on the screen. We can move on to updating our application state.

2. Updating the application state

We previously had to manage only two application states:

- Don't show error message
- Show error message

We now have to add:

- Don't show success message
- Show success message

It's straight forward to add another boolean flag for this. Simple and straight forward.

Or are we missing something? It seems that the two states are connected. We don't want to show an error message when showing the success message.

It turns out these are all values of the same state variable that is tied to the state of the form.

- Not submitted
- Submitted, has error
- Submitted, has succeeded

Let's keep this in mind and move on to step 3!

3. Update the React state

We currently have a `showError` of type boolean. It seems we now have to represent three different application states. For this, we can manage to separate boolean states, or better, use a enum state.

```jsx
const states = {
  not_submitted: 'not_submitted',
  submitted_has_errors: 'submitted_has_errors',
  submitted_has_succeeded: 'submitted_has_succeeded',
};
```

Let's rename our React state and set it to 'not_submitted' as the initial state:

```jsx
import './ContactForm.css';
import { useState } from 'react';

const states = {
  not_submitted: 'not_submitted',
  submitted_has_errors: 'submitted_has_errors',
  submitted_has_succeeded: 'submitted_has_succeeded',
};

export default function ContactForm() {
  // state to represent our form application state
  const [formState, setFormState] = useState(states.not_submitted);
  // states for each input field
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  console.log({ formState, name, email });

  function subscribe(e) {
    // avoid form submission
    e.preventDefault();
    if (!name || !email) {
      // transition application to error state
      setShowError(true);
      console.log('name or email not set', { name, email });
      return;
    }
    console.log('a new subscriber!');
  }
  return (
    <form class="contact-form" onSubmit={subscribe}>
      <h2>Newsletter</h2>
      <div className="contact-form__fieldset">
        <label>Name:</label>
        <input
          maxLength={120}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <div className="contact-form__fieldset">
        <label>Email:</label>
        <input
          type="email"
          maxLength={120}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <button type="submit" className="contact-form__button">
        Subscribe
      </button>
      {showError && <p>Please insert a name and email address. Both are required.</p>}
      <p className="contact-form__success-message">Subscribed!</p>
    </form>
  );
}
```

We now get an error that `showError` is not defined. Hence, we have to fix our existing conditional rendering of our error message:

```jsx
formState === states.submitted_has_errors && <p>Please insert a name and email address. Both are required.</p>;
```

Seems like this fixes the error. So let's test our code!

Submitting the form also throws an `setShowError` is undefined error. Let's move over to step 4 to fix our event handler as well.

4. Fix event handlers

Update the event handler code to replace the existing `setShowError` call and set the `formState` React state depending on the outcome of the form validation.

```jsx
import './ContactForm.css';
import { useState } from 'react';

const states = {
  not_submitted: 'not_submitted',
  submitted_has_errors: 'submitted_has_errors',
  submitted_has_succeeded: 'submitted_has_succeeded',
};

export default function ContactForm() {
  // state to represent our form application state
  const [formState, setFormState] = useState(states.not_submitted);
  // states for each input field
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  console.log({ formState, name, email });

  function subscribe(e) {
    // avoid form submission
    e.preventDefault();
    if (!name || !email) {
      // transition application to error state
      setFormState(states.submitted_has_errors);
      console.log('name or email not set', { name, email });
      return;
    }
    setFormState(states.submitted_has_succeeded);
    console.log('a new subscriber!');
  }
  return (
    <form class="contact-form" onSubmit={subscribe}>
      <h2>Newsletter</h2>
      <div className="contact-form__fieldset">
        <label>Name:</label>
        <input
          maxLength={120}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <div className="contact-form__fieldset">
        <label>Email:</label>
        <input
          type="email"
          maxLength={120}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <button type="submit" className="contact-form__button">
        Subscribe
      </button>
      {formState === states.submitted_has_errors && <p>Please insert a name and email address. Both are required.</p>}
      <p className="contact-form__success-message">Subscribed!</p>
    </form>
  );
}
```

5. Make things dynamic

Finally, let's add a conditional check to the JSX to dynamically render the success message only if the `formState` is set to `states.submitted_has_succeeded`.

```jsx
import './ContactForm.css';
import { useState } from 'react';

const states = {
  not_submitted: 'not_submitted',
  submitted_has_errors: 'submitted_has_errors',
  submitted_has_succeeded: 'submitted_has_succeeded',
};

export default function ContactForm() {
  // state to represent our form application state
  const [formState, setFormState] = useState(states.not_submitted);
  // states for each input field
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  console.log({ formState, name, email });

  function subscribe(e) {
    // avoid form submission
    e.preventDefault();
    if (!name || !email) {
      // transition application to error state
      setFormState(states.submitted_has_errors);
      console.log('name or email not set', { name, email });
      return;
    }
    setFormState(states.submitted_has_succeeded);
    console.log('a new subscriber!');
  }
  return (
    <form class="contact-form" onSubmit={subscribe}>
      <h2>Newsletter</h2>
      <div className="contact-form__fieldset">
        <label>Name:</label>
        <input
          maxLength={120}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <div className="contact-form__fieldset">
        <label>Email:</label>
        <input
          type="email"
          maxLength={120}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <button type="submit" className="contact-form__button">
        Subscribe
      </button>
      {formState === states.submitted_has_errors && <p>Please insert a name and email address. Both are required.</p>}
      {formState === states.submitted_has_succeeded && <p className="contact-form__success-message">Subscribed!</p>}
    </form>
  );
}
```

Run the code. I think it's a good time to check all currently implemented user stories to see if we introduced a regression with our changes.

Looks like everything works as expected! Amazing! 🥳

##### Next tasks

I think it is time that you try the next tasks on your own! Go ahead and try to solve task 5 and task 6.

You can find **one** possible solution in this [simple solution CodeSandbox](https://codesandbox.io/s/contact-form-react-exercise-solution-simple-emvtrg?file=/src/ContactForm.js).

Once task 5 and 6 are solved, you are done with the implementation. Everything that follows is nice-to-have. So pat yourself on the back!

If you are under time pressure or the application isn't super important to you, feel free to submit!

Of course there is still room for improvement and plenty easy wins to enhance our submission. So stick around a little longer if you can!

### HOW DID I DO IT?

One great way to enhance your code is to document your solution approach. The TODO list is about **what** you did. This section is about **how** you did it.

Usually when submitting code, you do so by creating a PR (merge request). In most companies, it is good practice to document your implementation by adding a PR description which highlights the background of your changes, implementation details, potential challenges, and solutions.

Since most take-home exercises are not submitted via PR, we can add our PR description as a comment.

Feel free to add any section that you think is important. I recommend starting with `Implementation Details` and `Open Issues` or `Challenges` (if any):

```jsx
/*
 * Implementation Details:
 * - ...
 * - ...
 * - ...
 *
 * Open Issues:
 * - ...
 * - ...
 * - ...
 */
```

It is up to you to identify what implementation details are worth talking about. This might be a good time to think back to when we tried to identify the motivation behind this exercise.

Document whatever you think is worth documenting, but maybe focus on what you think is related to the intent behind this exercise.

**Example:** We identified that form validation and conditional rendering seemed to be the most important pieces of this exercise.

Hence, we can highlight our implementation in that regard:

```jsx
/*
 * Implementation Details:
 * - Created form state enum instead of multiple boolean flags to
 *   reduce number of React states and to make sure
 *   either success or message is displayed and never both.
 * - Using input field attributes (web standards) for form
 *   validation to avoid unnecessary JavaScript code to reduce
 *   complexity.
 *
 * Open Issues:
 * - Using `maxLength` may not be enough to communicate to the user
 *   why they cannot input more text.
 *   Adding an additional error message may improve
 *   the user experience.
 */
```

Make sure your documentation is concise and easy to read. Technical writing is an important skill and your comments will definitely be evaluated together with your code.

As always with comments, they should add value. Don't document anything that is obvious. Instead, focus on the reasoning behind your implementation (the **why**).

Notice that we moved our previous comment into the `Open Issues` section!

### HOW TO STAND OUT OF THE CROWD?

You can find my full take-home exercise process in chapter "I am in a hurry; just get to the point".

The "HOW TO STAND OUT OF THE CROWD?"-section is meant for further refinement. Review the suggested topics and iterate over your solution.

All these points are meant to make your solution shine and stand out of the crowd. It is up to you to decide how much time you want to invest per take-home exercise.

As always, make sure to not over-engineer your solution, keep things simple, and take everything as a learning opportunity!

One important aspect of web development is accessibility. Being on top of that topic is also a great way to stand out of the crowd. I can encourage you to review the accessibility section for some hints for how to get started! 🙏

**Example:** You can find a final advanced solution for our example take-home exercise in this [CodeSandbox](https://codesandbox.io/s/contact-form-react-exercise-solution-advanced-khr7vr?file=/src/ContactForm.js).

Have a look and see what accessibility changes I made to the simple solution we came up together. Also, have a look how I was able to reduce the existing React state by using web standards!

I hope this example was fun and insightful! Good luck on your journey! 👋

## Tutoring

In case you are interested in more content like this, I run a weekly tutoring session where we practice all things web.

You can find us on [Meetup.com](https://www.meetup.com/all-things-web-react-html-css-javascript-tutoring/) and [Discord](https://discord.gg/uMcfrj9Q). We are always happy to have more folks join us!

## Conclusion

Using a pre-defined process helps you to focus on one task at a time, just like a recipe! Defining processes is a great way to divide and conquer a previously overwhelming problem. This does not only apply to take-home exercises but to any daunting problem.

My process should only be your starting point. Please adapt the process to your own way of coding and thinking. I encourage you to copy-paste my process and iterate on it to make it yours.

Happy coding!
