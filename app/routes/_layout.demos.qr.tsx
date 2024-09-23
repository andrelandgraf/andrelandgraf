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
