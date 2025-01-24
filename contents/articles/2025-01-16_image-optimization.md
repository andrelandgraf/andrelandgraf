---
date: 2025-01-16
title: Image optimization
description: Web performance starts with image optimization. In this guide, we will dive deep into the world of images on the web, covering everything from building out a custom optimization pipeline, reviewing third-party services, and learning about optimization mechanisms, caching & fingerprinting, HTTP streaming & sever memory, and more! 
categories: [Remix.run, Markdown]
ignore: true
---

"A picture is worth a thousand words" is an old advertising adage. This is also applicable on the web where image and video content engages users much more than plain text. But an image is also thousand times larger than a word. If you want to create great user experiences and fast websites, you need to start with your images. It's not exaggerated to say that web performance starts with image optimization. In this guide, we will dive deep into the world of images on the web, covering everything from building out a custom optimization pipeline, reviewing third-party services, and learning about optimization mechanisms, caching & fingerprinting, HTTP streaming & sever memory, and more. Buckle up!

## The basics

Images are two-dimensional arrays of pixels. Each pixel is a colored dot that makes up the image. The color of each pixel is represented by a combination of red, green, and blue (RGB) values, which can be stored in different formats. The most common image formats are JPEG, PNG, GIF, and SVG. Modern formats like WebP and AVIF were developed to provide better compression and quality than older formats, optimizing the images for the web.

If you want to serve an image on the web, you need to expose it via an HTTP server. Here is an example using Hono and Bun:

```typescript
import { Hono } from 'hono'

const app = new Hono()

app.get('/*', async (c) => {
  // Given we store our images in /public, we use the request path to find the image.
  const imagePath = "public" + c.req.path
  const file = Bun.file(imagePath)
  if(await file.exists()) {
    // Once confirmed the file exists, we stream it to the client.
    return new Response(file.stream(), {
      headers: {
        'Content-Type': 'image/png',
      },
    })
  }
  return c.text('404 Not Found :(', 404)
})

export default app
```

Given, we have an image at `/public/cat.png`, we can now access it via `http://localhost:3000/cat.png`. In HTML, we can use the `<img>` tag to display the image:

```html
<img src="http://localhost:3000/cat.png" alt="White and gray cat being goofy and rolling on the floor" />
```

In this simple setup, we store an image in a folder on our server and make it publicly accessible by exposing it via an HTTP server. In our server configuration (or code), we map URL paths to file destinations. When a user visits/requests an URL, the server responds with the image file if it exists. A website can display the image by embedding it in the HTML via the `<img>` tag. Simple as that!

However, this simple setup has some problems:

1. Images can become quite large.

![White and gray cat being goofy and rolling on the floor](/img/public/2025-01-16_image-optimization/cat.png?w=800&h=800)

For instance, this very cute image of my cat is 5.3 MB in size, shot on a Pixel 5, in JPEG format. In PNG, it's 20.2 MB! But don't worry, I optimized it before serving it to you. You can check your browser's network tab to see the actual size, but it should be around 217 KB and served as an WebP image with 800x800 pixels. Overall, this website transferred around 1.6 MB of gzipped content (HTML, CSS, JS, and images). Our unoptimized image would have x14 our website's size (current size - webP size = 1.6MB - 217KB = 1.4MB; size without image divided by PNG size = 20.2MB / 1.4MB = 14.29). This is a problem because it takes longer to download and display the image, especially on slow connections. It also consumes more bandwidth, which can be costly for both the user and the website owner. Now imagine, you are visiting a foreign country with a limited data plan. You don't want to download 20MB of data just to see a cute cat, do you?

At Remix Conf 2023, Henri Helvetica presented his talk "A fist full of data" (https://www.youtube.com/watch?v=Iom5SFXGeWE) where he did this funny thing of converting website sizes to mobile roaming costs. Give it a watch if you haven't. Inspired by this, let's calculate this for this cat image. From the [Telekom Germany website](https://www.telekom.com/en/media/media-information/archive/5g-roaming-in-60-countries-1041120) regarding data roaming in 5G outside the EU: "For travel outside the EU, Telekom offers Travel Mobil options that can be booked in advance. The Travel Mobil basic packages, for example, can be booked from € 14.95 for one month. This includes 1 GB for mobile internet use. Where possible, of course, always on the 5G network.". Following this calculating, downloading 50 images of my cat would cost 15€! I love much cat, but I think that's a bit too much.

Today's high-res images shot with high-end cameras including smartphones shoot stunning 4k images that can be several megabytes in size. Take this cute image of my cat for instance, 

HTML doesn't specify what image formats are supported. This is the job of the user agent (browser). 