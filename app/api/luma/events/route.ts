import { fetchAllLumaCalendarEvents } from '~/modules/luma/luma.server.ts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type LumaEventSummary = {
  id: string;
  name: string;
  description: string | null;
  url: string;
  startAt: string;
  endAt: string | null;
  timezone: string | null;
  coverUrl: string | null;
  location: string | null;
  isVirtual: boolean;
};

function resolveEventLocation(event: Awaited<ReturnType<typeof fetchAllLumaCalendarEvents>>[number]): string | null {
  const meetingUrl = event.meeting_url?.trim();
  if (meetingUrl) {
    return 'Online';
  }

  const location =
    event.geo_address_json?.description ??
    event.geo_address_json?.full_address ??
    event.geo_address_json?.city_state ??
    event.geo_address_json?.address;

  return location?.trim() || null;
}

function toEventSummary(event: Awaited<ReturnType<typeof fetchAllLumaCalendarEvents>>[number]): LumaEventSummary | null {
  const id = event.id ?? event.api_id;
  if (!id) {
    return null;
  }

  const url = event.url?.trim() || `https://lu.ma/event/${id}`;

  return {
    id,
    name: event.name,
    description: event.description?.trim() || null,
    url,
    startAt: event.start_at,
    endAt: event.end_at || null,
    timezone: event.timezone || null,
    coverUrl: event.cover_url || null,
    location: resolveEventLocation(event),
    isVirtual: Boolean(event.meeting_url?.trim()),
  };
}

export async function GET() {
  try {
    const events = await fetchAllLumaCalendarEvents();
    const summaries = events
      .map(toEventSummary)
      .filter((event): event is LumaEventSummary => event !== null)
      .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

    return Response.json(
      { events: summaries },
      {
        headers: {
          'Cache-Control': 's-maxage=300, stale-while-revalidate=900',
        },
      },
    );
  } catch (error) {
    console.error('Failed to fetch Luma events', error);
    return Response.json(
      {
        events: [],
        error: 'Unable to load events right now.',
      },
      { status: 200 },
    );
  }
}
