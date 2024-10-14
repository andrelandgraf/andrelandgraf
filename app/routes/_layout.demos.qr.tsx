import { useCallback, useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Button } from '~/components/buttons/index.tsx';
import { Input } from '~/components/forms.tsx';
import { SectionHeading } from '~/components/headings.tsx';

export default function Component() {
  const [error, setError] = useState('');
  const ref = useRef<HTMLCanvasElement>(null);
  const currentQRCodeData = useRef<string>('');

  const renderQRCode = useCallback((data: string) => {
    const canvas = ref.current;
    if (!canvas) {
      setError('Canvas not found');
      return;
    }
    QRCode.toCanvas(canvas, data, { width: canvas.width }, function (error) {
      if (error) {
        setError(error.message);
        return;
      }
    });
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const setupCanvas = () => {
      // Clear style set by qrcode library
      canvas.style.width = '';
      canvas.style.height = '';

      // Set width and height to available space
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      if (currentQRCodeData.current) {
        // Re-draw QR code on changed dimensions
        renderQRCode(currentQRCodeData.current);
      } else {
        // Clear canvas, draw white background
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
    <section id='qr-code-container' className='w-full space-y-4 pt-10 lg:p-20 max-w-[1200px]'>
      <SectionHeading>QR Code Generator</SectionHeading>
      <div className='flex flex-col lg:flex-row gap-8 w-full'>
        <form
          className='flex flex-col gap-4 w-full max-w-[600px]'
          onSubmit={(e) => {
            e.preventDefault();
            setError('');
            const data = new FormData(e.currentTarget).get('data');
            if (!data || typeof data !== 'string') {
              setError('Data is required');
              return;
            }
            currentQRCodeData.current = data;
            renderQRCode(currentQRCodeData.current);
          }}
        >
          <Input label='Data' type='text' id='data' name='data' required />
          <Button type='submit'>Generate QR Code</Button>
          {error && <p className='text-red text-sm'>{error}</p>}
        </form>
        <canvas className='w-full max-w-[600px] aspect-square' ref={ref} />
      </div>
    </section>
  );
}
