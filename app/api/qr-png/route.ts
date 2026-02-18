import QRCode from 'qrcode';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const qrCodeData = url.searchParams.get('data');
  if (!qrCodeData) {
    return new Response('Missing data parameter', { status: 400, statusText: 'Bad Request' });
  }
  const qrCode = await QRCode.toBuffer(qrCodeData, { width: 1200 });
  return new Response(new Uint8Array(qrCode), {
    headers: {
      'Content-Type': 'image/png',
    },
  });
}
