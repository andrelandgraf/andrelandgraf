declare module 'react' {
  interface HTMLAttributes<T> {
    tw?: string;
  }

  interface SVGProps<T> {
    tw?: string;
  }
}

export function ArticlePreview({
  serverOrigin,
  title,
  description,
  slug,
  includeQRCode,
}: {
  serverOrigin: string;
  title: string;
  description: string;
  slug: string;
  includeQRCode?: boolean;
}) {
  return (
    <div
      tw='w-[1200px] h-[1200px] bg-gradient-to-br flex flex-col p-16 text-white'
      style={{
        background: 'linear-gradient(to bottom right, rgb(94 234 212), rgb(20 184 166), rgb(19 78 74), rgb(17 94 89)',
      }}
    >
      <div tw='w-full flex items-start'>
        <div tw='flex flex-col' style={{ gap: '1rem' }}>
          <div tw='w-28 h-28 rounded-full overflow-hidden flex items-center justify-center'>
            <img
              width='112'
              height='112'
              className='w-full rounded-md'
              src={`${serverOrigin}/profile.png`}
              alt='Andre smiles at the camera'
            />
          </div>
          <div tw='text-2xl font-semibold'>Andre Landgraf</div>
        </div>
      </div>
      <div tw='flex flex-col items-start' style={{ gap: '1rem', marginTop: '8rem' }}>
        <div tw='text-8xl font-bold leading-tight max-w-[1100px]'>{title}</div>
        <div tw='text-4xl leading-tight'>{description}</div>
      </div>
      <div tw='text-3xl flex justify-center items-end' style={{ marginTop: 'auto' }}>
        <span>{serverOrigin}</span>
        {includeQRCode && (
          <div tw='w-40 h-40 overflow-hidden flex items-center justify-center' style={{ marginLeft: 'auto' }}>
            <img
              className='w-full rounded-md'
              src={`${serverOrigin}/qr.png?data=https://andrelandgraf.dev/blog/${slug}`}
              alt='QR Code'
            />
          </div>
        )}
      </div>
    </div>
  );
}
