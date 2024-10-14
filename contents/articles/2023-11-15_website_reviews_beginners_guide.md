---
date: 2023-11-15
title: Website Reviews - A beginner's guide
description: In this short article, I provide a simple step-by-step process to reviewing websites. Follow this guide to give constructive feedback to your peers or find ways to improve your own web app.
categories: [Web Development, Beginner Friendly]
---

Reviewing websites is the process of analyzing different aspects of a website. You can review your own site to find
issues and improve it, or review the sites of others to learn or give constructive feedback. Like a quality PR review,
there is a lot to reviewing websites. You can review the overall user experience, the design, the content, the code, the
performance, the site’s accessibility, the SEO, and more. In this short article, I want to provide you with a simple
step-by-step guide to get started with website reviews.

## The process

The goal of following a process is to divide the work into manageable tasks and conquer each task individually.
Especially when new to programming, everything all at once may seem overwhelming, but it gets easier when you break it
down into smaller pieces.

The process I follow when reviewing websites is as follows:

- Review the website from the perspective of a first-time visitor
- Utilize reporting tools to get objective data
- Test on different devices and browsers
- Use screen readers and keyboard navigation
- Check the Network tab
- Review the code

The order of the steps doesn't really matter, but I like to start with the user experience and then move on to the more
technical aspects. You also don't have to go through all the steps. For your personal site, you may want to do so, but
for a peer review, you can focus on some specific areas. You may learn the most by inspecting the code on cool sites,
but each step can help to give constructive feedback.

## Review the website from the perspective of a first-time visitor

Reviewing the site from the perspective of a first-time visitor will help you to take a step back and focus on what's
most important: the user experience. Make sure to open the website in a guest or incognito window to make sure you are
not logged in, have an empty cache, and no browser extensions running.

When reviewing the website, ask yourself questions like:

- What is the purpose of the website?
- What does it want me to do?
- What is the first thing I see?

You can then use the answers to these questions to give feedback on the overall user experience. For example, if the
website is an online course website but the first call to action is a link to the blog, you can give feedback on that.
Maybe the first call to action should be a link to the course catalog or a sign-up form.

## Utilize reporting tools to get objective data

There are some great tools out there that can help you get objective data about a website.
[Lighthouse](https://developers.google.com/web/tools/lighthouse), [Web.dev](https://web.dev/measure/) and
[WebPageTest](https://www.webpagetest.org/) provide reports on performance, accessibility, SEO, and more. These tools
are great for getting actionable feedback. Additionally, you can use specialized tools like
[WAVE](https://wave.webaim.org/extension/) to get additional reports on accessibility.

I recommend you start with Lighthouse. You can run a Lighthouse report from your Chrome DevTools by navigating to the
Lighthouse tab and clicking the Generate report button. Read through the report, focus on one issue at a time, and try
to understand the issue and how to fix it. Don't be shy about using Google for more information about the issue. For
example, if Lighthouse suggests to use smaller images, you can Google "how to optimize images for the web"! 🤓

Side note: Optimizing images can have a huge impact on your site’s performance. The
[Largest Contentful Paint (LCP)](https://web.dev/articles/lcp) often heavily depends on your images. However, managing
responsive images can also get complicated. I personally use [Cloudinary](https://cloudinary.com/) for image hosting on
this site, which automatically optimizes images and serves the right image size based on the device.
[unpic](https://unpic.pics) is also a great package (and starting point) to help you optimize your images. Definitely
don't shy away from using packages and services to help you with this!

## Test on different devices and browsers

A great way to detect issues is to test the website on different devices and browsers. At a minimum, use your mobile
phone and your computer. You can also use the [Chrome DevTools](https://developer.chrome.com/docs/devtools/) to test on
different screen sizes. Finally, make sure to test on all three major browsers: Chrome, Firefox, and Safari and their
mobile counterparts. Switching to landscape mode on your phone can also uncover additional layout issues.

## Use screen readers and keyboard navigation

Screen readers are tools that read the content of a website out loud. They are used by people with visual impairments.
Screen reader users may navigate your site using keyboard navigation. Keyboard navigation is also used by people with
motor impairments or for productivity reasons. Testing the website with a screen reader and keyboard navigation will
help you detect accessibility issues.

### Using keyboard navigation

Depending on your browser, you may have to enable keyboard navigation in your system or browser settings. Once enabled,
you can use the following keys to navigate through the page:

- Tab: Move focus to the next focusable element
- Shift + Tab: Move focus to the previous focusable element
- Enter/Space: Activate the focused element
- Arrow keys: Scroll or navigate through a list of elements or a radio button group
- Esc: Close a dialog or menu

Navigate the page without using your mouse and ensure all elements are focusable. Are all elements reachable? Test all
interactive elements like inputs, buttons, links, and select elements. Does a focus ring clearly outline the currently
focused element? If not, you may want to enhance your focus styles.

### Working with screen readers

There are many different screen readers out there. I recommend you start with [NVDA](https://www.nvaccess.org/) on
Windows and [VoiceOver](https://www.apple.com/accessibility/mac/vision/) on macOS. On a Mac, you can enable VoiceOver in
your system settings. Once enabled, VoiceOver announces the currently focused element and reads the page's content out
loud.

Using screen readers may feel overwhelming initially, but it is a great way to create empathy for screen reader users.
It will help you understand how image alt texts, input labels, and other accessibility features come into play.

You can find more information about keyboard navigation and screen readers in the
[MDN Web Docs](https://developer.mozilla.org/en-US/docs/Glossary/Screen_reader). You can also find information about web
accessibility in general in the [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA).

### Network tab

Use the Network tab of your browser's developer tools to get insights into the performance of your website. The Network
tab shows you all the requests the browser makes to load the page. You can see the size of each request, the time it
took to load, and more. You can also see the size of your assets.

Investigating the requests in the Network tab is a great way to identify request waterfalls, large assets, and other
performance issues. All website requests must first download the HTML document, which then references other assets like
CSS and JavaScript files. The browser then downloads these assets and executes the JavaScript. The JavaScript may then
make additional requests to load data from an API. This is called a request waterfall.

For example, maybe you identify that you currently reference your custom font in a CSS file. This means that the browser
first has to download the CSS file, then download the font, and then apply the font to the page. You can improve this by
using the [`preload` link tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload) to preload the
font. This way, the browser can download the font while it is parsing the HTML document
([find more information on web.dev](https://web.dev/articles/codelab-preload-web-fonts)).

### Review the code

Finally, you can review the code! I recommend first inspecting the HTML and CSS in your browser's developer tool's
Elements tab. Even if you can access the repository or own the code, inspecting it through the browser gives you a
different perspective. For instance, you can review the `head` section. What meta tags and links are included? Is
anything missing? The developer tools are also great for spotting padding, margin, or flexbox spacing issues. Explore
and see if you can find anything that could be improved!

Some things I like to look for are:

- Are we using [semantic HTML elements](https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html)?
- Do all images have an `alt` attribute?
- Are all buttons and links descriptive or have an `aria-label`?
- Do all input fields have an associated label?
- Are we using anchor tags for links and buttons for actions
  ([great video](https://x.com/Steve8708/status/1530978903698771969?s=20))?

Finally, you can jump into the source code (if you have access) for a proper code review. However, this may be a story
for another day. Happy coding! 🙋
