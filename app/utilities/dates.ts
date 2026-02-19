export function getReadableDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  const date = new Date(Date.UTC(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day)));
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function getISODate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  const utcTimestamp = Date.UTC(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day));
  return new Date(utcTimestamp).toISOString();
}
