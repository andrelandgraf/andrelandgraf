import { LoaderFunctionArgs } from '@remix-run/server-runtime';
import QRCode from 'qrcode';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const qrCodeData = url.searchParams.get('data');
  if (!qrCodeData) {
    return new Response('Missing data parameter', { status: 400, statusText: 'Bad Request' });
  }
  const qrCode = await QRCode.toBuffer(qrCodeData, { width: 1200 });
  return new Response(qrCode, {
    headers: {
      'Content-Type': 'image/png',
    },
  });
}
