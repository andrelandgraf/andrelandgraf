---
date: 2022-05-29
title: The JavaScript Event Loop
description: JavaScript operates on one thread using the event loop. It definetly makes our lives as developers easier as it's no fun dealing with paralellism. However, the event loop has some tricky parts to it as well. In this blog article, I want to go over those tricky parts and try to explain them to you.
categories: [JavaScript, AllThingsWeb]
ignore: true
---

## The main thread

Have you ever had that feeling where you actively blink or breath in and out and then it feels like it won't happen unless you actively do it again and again and again? Let's make this our mental model for how JavaScript engines execute our code.

Imagine you have to actively control every task in your body such as breathing or blinking. You think it is probably time to blink, so you execute the blink task. The blink task runs some precedures to make your eye blink. After that, you think it is probably time for some fresh air in your lungs, so you execute the breathe-in task.

That's not how it works in real life, right? We can do all sorts of things at the same time, most of them subconsiously. However, that's not how JavaScript works. JavaScript only executes one task at a time. No paralellism.

So what would that mean for us? We only have one "lane of conciousness". Only after the last step in the blinking task has been executed, are you capable of starting the breath-in task. We call this "lane of conciousness" a thread and since it is our main one, we call it the main thread. JavaScript runs on one main thread.

## Race conditions & deadlocks

Other programming languages have that concept of race conditions. You can execute your code in separate threads and several paralell streams of execution try to manipulate some data - a race condition - or aim to require something from each other at the same time - a deadlock! JavaScript doesn't have those concepts. Instead, JavaScript operates on one thread using the event loop. It definetly makes our lives as developers easier as it's no fun dealing with paralellism. However, the event loop has some tricky parts to it as well. In this blog article, I want to go over those tricky parts and try to explain them to you.

## Blocking the main thread

Let's get back to our example. Let's say we are in a conversation with our friends. We just said something and now we are awaiting a response from our buddy. We think "wait and listen for response" but what about breathing and blinking? Our eyes start burning and we slowly start fading away because our buddy just takes too long to reply. That's not working! How does JavaScript execute long running tasks?

Think reading something from the file system, fetching something from the web, or calculating a cryptographic hash? Imagine those things would also happen in the main thread and whenever the main thread is busy reading from a file or reading in coming bits and bytes from the network, all user interactions are blocked, every animation feezes, and all sound stops playing on the website. That would also mean all button clicks, all scrolling, all hovers would be ignored until the main thread is finished executing those long running tasks. No, for those tasks we need to handle them off the main thread!

Take the `setTimeout` function as an example. Imagine once invoked, the main thread would just wait 5000 milliseconds before continuing. All event handlers would be blocked for 5 seconds! No user interactions possible!

```javascript
const timeout = window.setTimeout(callback, 5000);
```

Thus, `setTimeout` triggers the creation of an event that happens off the main thread. Another thread runs in paralell and executes the task of waiting 5000 miliseconds for us.

## Things off the main thread

The JavaScript runtime (say the browser) has more than one thread. Imagine all the things that just take a bit more time such as reading files, fetching form the web, or calculating a cryptographic hash. Those things are scheduled in other threads and eventually come back to the main thread. That's where the event loop comes in. Think of every long-running task as an event that is fired off to helper threads. Once they are done, they come back to await processsing by the main thread.

**The event loop handles the execution order of all tasks executed by the main thread.**

Instead of blocking blinking and breathing, we let a friendly helper thread await for the response of our buddy in our conversation while we keep executing our main tasks "blinking" and "breathing". Once our helper thread as received the full response from our buddy, the helper thread will schedule a new task in the event loop. "Process response" is then executed by us between the other tasks.

## JavaScript execution

```javascript
const timeout = window.setTimeout(callback, 5000);
```

Let's go back to the `setTimeout` example. We now know that `setTimeout` calls create tasks that execute outside of the main thread. Somebody else (another thread) will handle the countdown (wait) for us, so the main thread can keep listening to events and execute other things.

However, it is important to emphasize one more aspect. Who is executing the callback function once the countdown is done and we waited 5000 milliseconds? The main thread or our supportive helper thread?

**Our JavaScript code only runs in the main thread.**

There is no paralell execution of code, no race conditions in JavaScript. We know that a task is fully finished before we start executing the next task. If we are currently "breathing", then we will only "process the conversation response" after the breathing has been fully executed. The main thread will finish up the current work, grab the next task from the event loop and execute the associated code. Thus, once our helper thread has finished waiting for the 5000 milliseconds, it will notify the main thread that it has finished. The **main thread** will execute the callback once it is free of other tasks.

## Queueing a task

The main thread is where JavaScript is executed. But how does the main thread know which task should be executed next? Well how does the cashier in the supermarket deal with tasks? It polietly asks everyone who wants to pay, to queue up in the order of arrival: First in, first out (FIFO). JavaScript utilizes a queue to manage all events that expect execution by the main thread. More precisely, a message queue.

I can only recommend that you watch this brilliant talk by [Jake Archibald from 2018 "In The Loop"](https://www.youtube.com/watch?v=cCOL7MC4Pl0) at JSConf.Asia. He uses an incredibly accurate animations to illustrate the event loop!

## Browser events are tasks

When you run a script of JavaScript, it runs from top to bottom after intial interpretation. It will stop once all the code has been executed. So how does user interaction fit into this mental model?

I mentioned that long running tasks would block user interactions but how about any other JavaScript code that is run by the browser? What exactly happens when the user clicks a button while we happily execute one of our scripts?

Well, everything is a task. Every click, scroll, hover, or other user interaction creates a task. Once the main thread is finished with the current workload, it will go over and handle the user event. Long-running tasks are blocking user interactions because they prevent the execution of those user event tasks for a longer time.

If you execute an infinite loop on your website, all user interactions are blocked because the task of executing the JavaScript will never finish and the browser is never able to execute the next task, (the click user event, the scroll user event, etc.):

```javascript
while (true) {}
```

## References & Inspirations

- Brilliant talk by [Jake Archibald from 2018 "In The Loop"](https://www.youtube.com/watch?v=cCOL7MC4Pl0) at JSConf.Asia
- The MDN web docs [JavaScript event loop article](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#queue).
- Another relevant talk by [Philip Roberts from 2014 "What the heck is the event loop anyway?"](https://www.youtube.com/watch?v=8aGhZQkoFbQ) at JSConf EU
