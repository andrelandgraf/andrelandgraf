---
date: 2023-02-11
title: A process for solving React take-home exercises
description: Take-home can be intimidating, especially for those new to the job market. In this blog post, I want to guide you through my process for solving React take-home exercises.
categories: [React, Interview Prep, Beginner Friendly]
imageUrl: https://res.cloudinary.com/andre-landgraf/image/upload/f_auto,q_auto/v1676234337/andrelandgraf.dev/take-home-exercises_hr145l
imageAltText: Solving React take-home exercises - from zero to hero.
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
 *   A well-maintained TODO list shows
 *   that you can break down complicated tasks.
 *
 *   Ignore the ‘What are the next steps?’ section.
 *   More to this later.
 *
 * 2.) HOW DO I DO IT?
 *    -> KEEP IT SIMPLE - DON’T OVER-COMPLICATE THINGS! <-
 *    -> DEBUGGING OVER-COMPLICATED CODE IS HARD! <-
 *
 *  For each TODO in the list, do the following:
 *  - Pick the next TODO from the TODO list
 *  - Follow the steps a to e
 *  - Test and debug the implementation after every step.
 *
 *  a) Start with the markup (HTML)
 *     - Build the static HTML necessary for the task
 *     - Do not add any dynamic logic with JavaScript just yet
 *  b) Define the application states the user can be in,
 *     e.g., create enum states and boolean flags
 *  c) Implement the application state with React
 *     Set each state to its default/initial state
 *  d) Implement event handlers to update the state
 *  e) Make markup conditional/dynamic based on the React state
 *
 * 3.) HOW DID I DO IT?
 *   - Think of this section as your PR description.
 *   - Add a comment above your code (after the TODO list comment).
 *   - This section is to document your implementation details.
 *   - Include explanations into **how** you solved the tasks.
 *   - Use this section to communicate your thoughts
 *     and decisions with the interviewers.
 *
 * -- PR description template --
 *
 * Implementation Details:
 * - Instead of using React state and callbacks
 *   to handle the value of each input field,
 *   I decided to use the HTML form element API
 *   to access the form values on submit.
 *   This way, we can reduce the amount of state
 *   and can avoid re-renders.
 * - Refactored existing submit button from div to button element
 *   to take advantage of semantic HTML and improve accessibility.
 *  - …
 *
 * Open Issues:
 * - One unit test is failing due to a weird scroll issue.
 *   I was not able to fix the unit test,
 *   but left a TODO comment in the line causing the issue.
 *
 * -- PR description template --
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
 *    - Update your code to follow identified conventions,
 *    - e.g., existing files are in snake-case, so all new files
 *      should be snake-case as well.
 *   a.2) Create additional conventions:
 *    - Identify remaining inconsistencies in your code,
 *    - Create patterns to unify things
 *    - This may include variable, function,
 *      classes, and state naming conventions,
 *      e.g., every boolean state starts with `is`:
 *        - `isOpen`
 *        - `isPlayingInTheBackground`
 *
 *  b) Document things
 *     - Consider adding JSDoc comments to your functions
 *     - Add inline comments where they add value
 *       (e.g., answer the question: Why did you do this?)
 *     - Read through existing comments
 *       (including TODO list and PR description)
 *       and fix grammar mistakes and typos
 *
 *  c) Create better abstractions
 *     but be careful not to over-engineer!
 *     - Abstract duplicate code into functions or hooks
 *     - Break reusable markup out into reusable components
 *     - Create context and providers to manage global state
 *     - Avoid prop-drilling
 *
 *  d) Make accessibility improvements
 *   - Good starting point:
 *     Go through MDN Web Docs Semantic HTML 5 element list
 *     and apply them in your code wherever possible
 *   - Use browser extensions, Google Lighthouse,
 *     and ESLint plugins to find accessibility errors
 *   - Use keyboard-only navigation to test your app
 *     Are all focus outlines visible?
 *   - Use voice-over (built-in screenreader) to test your app
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
 *        applying to more positions
 *        or working on your side project?
 *      - However, sometimes the instructions are open ended or
 *      - you just want to do 110%.
 *    e.1) Get creative and come up with more
 *         user stories and features
 *         - Add all new ideas to the TODO list under
 *           the section ‘What are the next steps?’
 *           Just adding these TODOs shows that you care!
 *           No need to implement them!
 *         - If you want to invest more time, pick the first
 *           TODO and go back to step 2.
 *    e.2) Add tests, linter, formatter, or other utils.
 *         If the exercise environment lacks tools
 *         or packages you are familiar with and you
 *         think they could add additional value, then
 *         add these tools and document the changes in the
 *         PR description section.
 *
 *    f) Take a break and come back with a fresh mind
 *       - Once you are done, take a break!
 *       - If you have time left,
 *         you cna come back tomorrow with a fresh mind
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

**Note:** Processes are useful when the challenge lies in the size and complexity of the task, not its individual components. A process can only aid in overcoming overwhelming exercises when the necessary knowledge is present.

But don't be discouraged if you face difficulties with specific tasks. Take-home exercises are designed to be challenging. By breaking down a daunting problem into smaller tasks, you can experiment and research online for each one. Each task presents an opportunity to learn and grow as a developer. Tackle each one individually and you'll conquer them all!

## Step-by-step walk-through

Let’s use an example take-home exercise to apply the process. We will use a practice take-home exercise I came up with for a recent tutoring session.

To get started, fork this [CodeSandbox](https://codesandbox.io/s/contact-form-react-exercise-lbvsod) to create your own environment.

I want to add one disclaimer before getting started. The [CodeSandbox](https://codesandbox.io/s/contact-form-react-exercise-lbvsod) contains some bad code. The added bad practices are intended pitfalls to be fixed during the take-home exercise. Be aware this blog post doesn’t address all issues in the example.

### WHAT DO I HAVE TO DO?

First, get a feeling for the exercise and existing code. Do the following tasks in whatever order feels natural to you:

- Skim through the instructions
- Set up the coding environment following the instructions
- Skim through existing files and folders
- Scroll through the existing code

By following these steps, you will have a general understanding of the code and file structure, a rough idea of what needs to be implemented, and the ability to run the code on either your local machine or remote environment.

**Example:** Following our example take-home exercise, after reading the instructions you might have picked up that the exercise is to extend an existing `ContactForm` component. After investigating the file and folder structure, you should have spotted the component in the `/src/ContactForm.js` file.

Maybe you also already identified that the component is rendered inside the `App` component in `/src/App.js`. Also, you may have gathered that there are some existing CSS classes in `/src/ContactForm.css`, some of which are not in use yet - an indication that we should use them.

Finally, you are able to run the existing code on CodeSandbox and make changes.

Next, let's create a TODO list to structure the tasks.

#### The TODO list

A TODO list is a great way to manage tasks. Everything you have to do to solve the take-home exercise should be documented in the TODO list.

Make sure to break-down the instructions into manageable tasks. Each task should be small enough that it doesn't feel overwhelming based on your own experience.

You can use this TODO list template:

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

Paste the code comment somewhere central in your code. Next, read through the take-home instructions and start creating TODO items.

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

We also already made sure to phrase our TODOs from a user-perspective. This is just a nice touch proving that you know about [user stories](https://en.wikipedia.org/wiki/User_story).

Next, let's take a moment to think about the intent behind this exercise.

#### Why this exercise?

It's good to take a step back to think about the motivation behind this exercise before starting to code. This may let you focus on the right things.

Sure, you have applied for a React position and this is a React take-home exercise, but what are the specific skills and knowledge required for the identified tasks?

**Example:** There seems to be an emphasis on form validation and managing user input. The instructions seem to be focused on dynamic UI updates based on user interactions.

Now that we have a sense for why we do this exercise and have our TODO list set up, let's start coding!

### HOW DO I DO IT?

Before we actually get started to code, one last thing...

#### Start simple

This is probably the most important part of this process. Try to focus at one thing at a time and do not stop in the middle to create an abstraction.

You have many good ideas and intentions, but please trust me when I tell you to start very simple. Don't be too smart. Don't over-engineer things.

If you over-engineer things, you will make it harder for yourself to change things later. Also, you will just end up debugging your over-complicated code when you could already be done.

Start very simple and get it to work first. Once it works, we can make it more pretty (if necessary).

{% statement %}
Keep it simple and make it work. Do not over-complicate things and don't add premature abstractions.
{% /statement %}

Maybe I sound a bit harsh here. I have lost countless of hours trying to fix my stupid over-engineered code. I have learned the hard way that you should start easy and do one thing at a time. I know how hard this is but please be better than me! 😉

Anyways, let's get going!

#### For each TODO do:

Pick the next TODO from the list and follow these steps:

1. Start with the markup (HTML)
   Build the static HTML of the final solution
   Do not add any dynamic logic with JavaScript just yet
2. Define the application states the user can be in,
   e.g., create enum states and boolean flags
3. Add the application state in React
   Set each state to its default/initial state
4. Implement event handlers to update the state
5. Make markup conditional/dynamic based on the React state

##### Task 1

Let's follow this process for our example take-home exercise.

The first TODO reads: "User should see an error message when trying to submit without first inputting a email and name".

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

There is currently no error message in the HTML. Also, there is no existing error validation. So far, we only execute a `console.log` when clicking the "Subscribe" button.

1. First, let's think about the static HTML that we have to add to display an error message.

We can use a paragraph tag to add a simple error message:

```jsx
<p>Please insert a name and email address. Both are required.</p>
```

Good enough for now. We want to keep it simple.

Add the error message where it makes sense, e.g., below the submit button. Make sure to run the application and ensure your changes are visible on the screen. We want to debug early and often!

You might have a few more ideas in mind for how to design the error message, but let's get going and keep it simple!

2. Next, let's define the application states.

Don't confuse step 2 with step 3! We are not talking about React state just yet. Usually, your UI changes because the user triggers an action. Actions transition the UI from one state to another.

It's a great idea to think about your UI states before adding React state for it. In our case, our goal is to show an error message if a submission happened without a name or email value. This only requires two states:

- Don't show error message
- Show error message

Since it's only two states, you can use a boolean flag (`true` or `false`) to cover both states.

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

We also make sure to set the three states to their initial values.

Would you have been able to figure this out on your own? [Controlling input fields with state](https://beta.reactjs.org/reference/react-dom/components/input#controlling-an-input-with-a-state-variable) is a common pattern in React. Feel free to search online every time you don't have a solution approach for a task. Each task is a learning opportunity!

Finally, run the application to see if it still works without crashing. Debug early and often and use `console.log` statements to verify your changes work as intended.

4. Implement event handlers

Next, we implement the event handlers to update our state on user action. The `name` and `email` states should be in sync with the input fields. It is [common practice](https://beta.reactjs.org/reference/react-dom/components/input#controlling-an-input-with-a-state-variable) to implement this using `onChange` handlers.

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

We add the required changes and also add `console.log` statements to verify everything works as expected.

Run the application and check the console. The `name` and `email` states should now be in sync with the input fields.

Also, the 'a new subscriber!' message should not appear in the console anymore when clicking 'Subscribe' with an empty email or name input field as we `return` early if a validation failed.

After any potential bugs are fixed, we can move on to the last step.

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

Congratulations, you successfully solved the first task of the take-home exercise! 🎉

Make sure to mark the first TODO in your TODO list as solved - so satisfying! 😌

**How are you feeling?**

Was it easy? This is a great sign that the process worked! 😎

Was it too easy? Maybe you are already more experienced with React and these changes feel natural to you? In this case, feel free to do steps 3 - 5 in one go without debugging between each step. You may also want to make the user stories bigger. This way you can work on several related small tasks at once. This is a good way to incrementally increase your speed of development.

Was it too hard? This can happen and it's okay. Between every step, feel free to Google for help, read related blog posts, make breaks, and take it step by step. A take-home exercise is a great opportunity to learn and practice!

Let's get going!

##### Task 2

The next task reads: "User should see an error if email is not a valid email after submitting the form".

Uff, this one seems to be more advanced. How do we check if a string is a valid email address?

```jsx
email.includes('@'); // 😅❔
```

When in doubt, use Google (or ChatGPT): "How to validate email input".

It might be tempting to search for the right Regex (regular expression) or helper function to check if a string is a valid email. I encourage you to keep your Google queries more open. If too narrow, you won't find alternative (easier) solution approaches.

Instead of asking for how to solve it one particular way, just ask Google how to solve it in general. Maybe there is a web standard that we can use to make our life easier!

It turns out there is an input attribute called `type` which can be set to "email". This way we can avoid implementing a regular expression.

{% statement %}
It's always a good idea to search for a web standard or web API to solve your problems before trying to solve it with React.
{% /statement %}

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

All we need to do is to add `type="email"` to our input field.

Let's try it out. Run the application, insert a name, insert a invalid email, and click "Subscribe".

Weird... Why are we not seeing a validation error? I encourage you to start debugging and googling on your own. Try to identify the issue. Why is the error not showing?

A good starting points (as always) are the [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) and the [new React docs](https://beta.reactjs.org/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form).

Running into issues is totally normal. We see a solution online (`type="email`), we try to apply it, but we lack some context around the solution and it just doesn't fit to our current code.

It turns out that input field validation is tied to form submissions. The current code uses an HTML form element but not a real submit button. Hence, we are not really submitting the form.

The current code uses a `div` with an `onClick` handler to call the `subscribe` function. Refer to step 4.d) to why this is bad practice. We should always strive to use a `button` for click actions, not a `div`. Rest assured that we would have caught this issue in step 4.d).

This bad code was added on purpose. I encourage you to always challenge the existing code and take nothing for granted! Start second-guessing other people's code, even that of interviewers. It might tun out that the bad code was added on purpose to see who is experienced enough to challenge it. 😉

Let's fix the code and refactor the `div` to a `button`:

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

Since the browser implements the error message for us, there is really no more application state that we need to add.

3. React state

The same goes for our React state. We have everything we need.

4. Implement event handlers

Let's see if our event handlers still work as expected. What happens if the user inserts no email and no name, or a valid email and a name? - The page does a full page reload.

If you haven't seen this, google: "Form reloads page in React". If you worked with forms in React before, you know that we need to add an `onSubmit` event handler to prevent the browser's default behavior of actually submitting the form.

Since our `subscribe` function should run on submit anyways, we can move it from `onClick` to `onSubmit`. Either way would be fine though.

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

{% statement %}
When in doubt, search for an existing browser API to solve your problem.
{% /statement %}

##### Task 3

The third TODO reads: "User should not be able to input more than 120 characters for both email and name input values".

Great! This one seems to be easier again. We could add a second error message and error state and basically do the same as for task 1.

However, based on our learnings from task 2, maybe the input field can also validate length validation for us?

Again, either implementation is fine, but since we want to use web standards whenever possible to avoid unnecessary JavaScript code, we can do a quick Google search.

Apparently, there is a `maxLength` property on the input field! Our struggle from the previous task paid for itself! We are now aware that the input HTML element has [loads of attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attributes) we can use to add form validations. We can apply the same pattern for this TODO.

1. Update the HTML

Let's add the `maxLength={120}` property to both input fields and test our implementation. Insert a very long string into the input field and see what happens!

Turns out the browser won't let you input more than 120 characters anymore. Great!

**Note:** Maybe it would be better to add an error message so the user actually knows what's happening? How do you interpret the instructions? Sometimes it's hard to know what exactly is the expected behavior based on the instructions.

This is a great time to add a comment in the code to communicate your thoughts:

```jsx
/*
 * Using `maxLength` input attribute to prevent users from
 * inserting too much text.
 * Currently no error message displayed, user just prevented
 * to insert more text.
 * Could potentially also add an error message to improve
 * user experience and communicate max length cap.
 */
```

We want to keep it simple and we are not done with all TODOs yet. When in doubt, add a comment somewhere and move on.

Since we solved the task, we can move on right to the next one!

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

We run the code and see the success message on the screen.

2. Updating the application state

We previously had to manage only two application states:

- Don't show error message
- Show error message

We now have to add:

- Don't show success message
- Show success message

You might think about adding another boolean flag for this. Simple and straight forward.

Or are we missing something? It seems that the two states are connected. We don't want to show an error message when showing the success message.

It turns out these are all values of the same state variable that is tied to the state of the form.

- Not submitted
- Submitted, has error
- Submitted, has succeeded

Let's keep this in mind and move on to step 3!

3. Update the React state

We currently have a `showError` state of type boolean. It seems we now have to represent three different application states. For this, we can manage two separate boolean states, or better, use an enum state.

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

We now get an error that `showError` is not defined. We need to fix our existing code and rename the variable everywhere where it is used. A quick code search can come in handy here.

The conditional can be updated like so:

```jsx
formState === states.submitted_has_errors && <p>Please insert a name and email address. Both are required.</p>;
```

Next, let's test the code!

Submitting the form throws an `setShowError` is undefined error. Maybe you already saw and fixed it, otherwise let's move over to step 4 to fix it together.

4. Fix the event handlers

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

I think it's a good time to check all currently implemented user stories to see if we introduced a regression with our changes.

Looks like everything works as expected! Amazing! 🥳

##### Next tasks

Try the next tasks on your own! Go ahead and solve task 5 and 6.

You can find **one** possible solution in this [simple solution CodeSandbox](https://codesandbox.io/s/contact-form-react-exercise-solution-simple-emvtrg?file=/src/ContactForm.js).

Once task 5 and 6 are solved, you are done with the implementation. Everything that follows is nice-to-have. So pat yourself on the back!

If you are under time pressure or the application isn't super important to you, feel free to submit!

Of course there is still room for improvement and plenty easy wins to enhance our submission. So stick around a little longer if you can!

### HOW DID I DO IT?

One great way to enhance your code is to document your solution approach. The TODO list is about **what** you did. This section is about **how** you did it.

Usually when submitting code, you do so by creating a PR (merge request). It is good practice to document your changes by adding a PR description that highlights the background of your changes, implementation details, potential challenges, and solutions.

Since most take-home exercises are not submitted via PR, we can add our PR description as a comment instead.

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

As always with comments, make sure they should add value. Don't document things that are obvious. Instead, focus on the reasoning behind your implementation (the **why**).

Notice that we moved our previous comment about the `maxLength` error message into the `Open Issues` section!

### HOW TO STAND OUT OF THE CROWD?

You can find my full take-home exercise process in chapter "I am in a hurry; just get to the point".

The "HOW TO STAND OUT OF THE CROWD?"-section is meant for further refinement. Review the suggested topics and iterate over your solution.

All these points are meant to make your solution shine and stand out of the crowd. It is up to you to decide how much time you want to invest for every take-home exercise.

As always, make sure not to over-engineer your solution. Instead, keep things simple.

Also remember, a take-home exercise is a great learning opportunity! Don't shy away from consulting with your friends, research online, and experimenting around.

#### Accessibility

One important aspect of web development is accessibility. Being on top of that topic is a great way to stand out of the crowd. I can encourage you to review the accessibility section of the process (4.d) for some hints for how to get started! 🙏

For our example, review [this section of the new React docs](https://beta.reactjs.org/reference/react-dom/components/input#providing-a-label-for-an-input) about input labels. Can you spot the accessibility issues with our current label implementation?

#### Final enhanced solution

You can find a final advanced solution for our example take-home exercise in this [CodeSandbox](https://codesandbox.io/s/contact-form-react-exercise-solution-advanced-khr7vr?file=/src/ContactForm.js).

Have a look and see what accessibility changes I made to the simple solution we came up together.

Inspect how I was able to reduce the existing React state by using web standards! Review the new React docs for more information about [reading named input field values on submit](https://beta.reactjs.org/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form).

I hope this example was fun and insightful! Good luck on your journey! 👋

## Conclusion

Using a pre-defined process helps you to focus on one task at a time, just like a recipe! Defining processes is a great way to divide and conquer a previously overwhelming problem. This does not only apply to take-home exercises but to any daunting problem.

My process should only be your starting point. Please adapt the process to your own way of coding and thinking. I encourage you to copy-paste my process and iterate on it to make it yours.

Happy coding!
