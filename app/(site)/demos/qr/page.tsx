'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { SectionHeading } from '~/components/headings.tsx';
import { getFocusClasses } from '~/utilities/ariaClasses.ts';

export default function QRDemoPage() {
  const [error, setError] = useState('');
  const ref = useRef<HTMLCanvasElement>(null);
  const currentQRCodeData = useRef<string>('');

  const renderQRCode = useCallback((data: string) => {
    const canvas = ref.current;
    if (!canvas) {
      setError('Canvas not found');
      return;
    }
    QRCode.toCanvas(canvas, data, { width: canvas.width }, (canvasError) => {
      if (canvasError) {
        setError(canvasError.message);
      }
    });
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const setupCanvas = () => {
      canvas.style.width = '';
      canvas.style.height = '';

      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      if (currentQRCodeData.current) {
        renderQRCode(currentQRCodeData.current);
      } else {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    const resizeObserver = new ResizeObserver(setupCanvas);
    const section = document.getElementById('qr-code-container');
    if (section) resizeObserver.observe(section);

    setupCanvas();

    return () => {
      resizeObserver.disconnect();
    };
  }, [renderQRCode]);

  return (
    <section id="qr-code-container" className="w-full space-y-4 pt-10 lg:p-20 max-w-[1200px]">
      <SectionHeading>QR Code Generator</SectionHeading>
      <div className="flex flex-col lg:flex-row gap-8 w-full">
        <form
          className="flex flex-col gap-4 w-full max-w-[600px]"
          onSubmit={(event) => {
            event.preventDefault();
            setError('');
            const data = new FormData(event.currentTarget).get('data');
            if (!data || typeof data !== 'string') {
              setError('Data is required');
              return;
            }
            currentQRCodeData.current = data;
            renderQRCode(currentQRCodeData.current);
          }}
        >
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="data" className="text-sm">
              Data
            </label>
            <input
              id="data"
              name="data"
              type="text"
              required
              className={`p-4 rounded-md bg-teal-100 dark:bg-teal-900 text-gray-800 dark:text-white ${getFocusClasses(true)}`}
            />
          </div>
          <button
            type="submit"
            className={`w-full md:w-fit flex gap-2 justify-center items-center transform motion-safe:active:translate-y-px text-center font-semibold shadow-lg rounded-lg px-4 py-2 leading-relaxed text-black bg-primary hover:bg-secondary ${getFocusClasses(
              true,
            )}`}
          >
            Generate QR Code
          </button>
          {error && <p className="text-red text-sm">{error}</p>}
        </form>
        <canvas className="w-full max-w-[600px] aspect-square" ref={ref} />
      </div>
    </section>
  );
}
