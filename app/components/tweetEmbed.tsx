type TweetEmbedProps = {
  url?: string;
};

export function TweetEmbed({ url }: TweetEmbedProps) {
  if (!url) {
    return null;
  }
  return (
    <blockquote className='twitter-tweet'>
      <a href={url}></a>
    </blockquote>
  );
}
