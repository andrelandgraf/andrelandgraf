export function getReadableDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day));
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getISODate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day));
  return date.toISOString();
}
