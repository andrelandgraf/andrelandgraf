---
date: 2024-09-22
title: Working with QR codes in Remix
description: Learn how to easily generate QR codes in your Remix app to share URLs and other information with your users.
categories: [Remix.run]
imageUrl: https://andrelandgraf.dev/blog/2024-09-22_working-with-qr-codes-in-remix.png?qr
imageAltText: QR code to this very blog post.
---

QR codes are two-dimensional barcodes that can easily be scanned by phones and other devices. They are commonly used to share URLs but can store any kind of data. QR codes can hold up to 3 KB of data, which is about 4000 alphanumeric or 7000 numeric characters. In this article, we will cover different ways to generate QR codes in Remix.

## Getting started

The `qrcode` package is an excellent tool for generating QR codes, taking care of the heavy lifting. Start by installing the `qrcode` package ([view on npm](https://www.npmjs.com/package/qrcode)):

```bash
npm install qrcode
```

In Remix, you can choose to render QR codes either on the server or the client, each with its own pros and cons. We'll cover both approaches and when to use each one.

## Server-side QR code generation

We can generate QR codes on the server and serve them as PNGs using a resource route's `loader` function. The example below shows how to create a QR code image from a query parameter and return it as a PNG in response to GET requests:

```tsx
import { LoaderFunctionArgs } from '@remix-run/server-runtime';
import QRCode from 'qrcode';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const qrCodeData = url.searchParams.get('data');
  if(!qrCodeData) {
    return new Response('Missing data parameter', { status: 400, statusText: 'Bad Request' });
  }
  const qrCode = await QRCode.toBuffer(qrCodeData, { width: 1200 });
  return new Response(qrCode, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': `public, max-age=${60 * 60 * 24}`, // Cache the image for 24 hours to avoid regenerating it on each request
    },
  });
}
```

In this example, we use the `qrcode` package's `toBuffer` method to generate the QR code image from the `data` query parameter and set the width of the QR code to 1200 pixels. Then, we return the QR code as a PNG image. Try it out by visiting [https://andrelandgraf.dev/qr.png?data=https://andrelandgraf.dev](https://andrelandgraf.dev/qr.png?data=https://andrelandgraf.dev). You should see a QR code image that contains the URL `https://andrelandgraf.dev`. You can replace the `data` parameter with any URL or other data. The Cache-Control header caches each QR code for 24 hours, reducing the need to regenerate it on every request.

Generating a QR code image on the server is useful when you want to integrate the QR code into your server-side rendered site or when you need to generate the QR code based on server-side data. One cool use case of generating a QR code on the server is to include it in a dynamically generated image using satori and resvg-js ([blog post by Jacob Paris](https://www.jacobparis.com/content/remix-og)). satori allows you to turn HTML and CSS into an SVG and resvg-js renders SVGs to PNGs. If you want to include a QR code in a dynamic image generated with HTML and CSS, you can include an image tag with the QR code URL in the overall HTML content and turn it into an SVG with satori. Then, you can render the SVG to a PNG with resvg-js.

### Example

![Preview image for this blog post with QR code](https://andrelandgraf.dev/blog/2024-09-22_working-with-qr-codes-in-remix.png?qr)

Note that generating the QR code image on the server does require server resources. This is usually fine, especially when utilizing caching. However, if I were to create a QR code generator website, I would generate the QR code image on the client-side instead so that each user generates their QR codes in their browser, reducing the load on the server.

## Client-side QR code generation

If you want to generate the QR code image on the client-side, we can use the `qrcode` package's `toCanvas` method. The following example shows how to create a QR code generator form that allows users to enter data and generate a QR code image on the client-side:

```tsx
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Button } from '~/components/buttons';
import { Input } from '~/components/forms';
import { SectionHeading } from '~/components/headings';

export default function Component() {
  const [error, setError] = useState('');
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  return (
    <section className="w-full space-y-4 pt-10 lg:p-20 max-w-[1200px]">
      <SectionHeading>QR Code Generator</SectionHeading>
      <div className="flex flex-col lg:flex-row gap-8 w-full">
        <form
          className="flex flex-col gap-4 w-full max-w-[800px]"
          onSubmit={async (e) => {
            e.preventDefault();
            setError('');
            if (!ref.current) {
              setError('Canvas not found');
              return;
            }
            const data = new FormData(e.currentTarget).get('data');
            if (!data || typeof data !== 'string') {
              setError('Data is required');
              return;
            }
            QRCode.toCanvas(ref.current, data, { width: 600 }, function (error) {
              if (error) {
                setError(error.message);
                return;
              }
            });
          }}
        >
          <Input label="Data" type="text" id="data" name="data" required />
          <Button type="submit">Generate QR Code</Button>
          {error && <p className="text-red text-sm">{error}</p>}
        </form>
        <canvas width="600" height="600" className='w-full max-w-[600px] object-contain' ref={ref} />
      </div>
    </section>
  );
}
```

This code does the following:

- Renders a canvas where the QR code will be displayed.
- Render a form with an input field for the user to enter the data for the QR code.
- Use `useEffect` to draw a white background on the canvas when the component mounts.
- Calls the `qrcode` package's `toCanvas` method to display the QR code on the canvas when the form is submitted.
- Displays an error message if something goes wrong during the generation process.
- Ensures the canvas is responsive by using the `object-fit: contain` CSS property.

You can view this code in action at [https://andrelandgraf.dev/demos/qr](https://andrelandgraf.dev/demos/qr). Try entering a URL or any other data and click the "Generate QR Code" button to generate the QR code image.

## Conclusion

QR codes are a great way to share URLs and other information. Generating QR codes in Remix is straightforward. The `qrcode` package does all the heavy lifting. Start with server-side generation unless you're concerned about server resources or only need QR codes based on user input. Happy coding!