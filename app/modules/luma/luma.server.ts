import { eventsConfig } from '../../../src/lib/events/config.ts';

const LUMA_API_BASE_URL = 'https://api.lu.ma/public/v1';
const MAX_PAGES = 25;
const PAGE_SIZE = 50;

type LumaListEventsResponse = {
  entries?: Array<{ event?: LumaEvent } | LumaEvent>;
  has_more?: boolean;
  next_cursor?: string | null;
};

export type LumaEvent = {
  id?: string;
  api_id?: string;
  name: string;
  description?: string | null;
  url?: string | null;
  start_at: string;
  end_at?: string | null;
  timezone?: string | null;
  cover_url?: string | null;
  geo_address_json?: {
    full_address?: string | null;
    address?: string | null;
    description?: string | null;
    city_state?: string | null;
  } | null;
  meeting_url?: string | null;
};

function isLumaEvent(value: unknown): value is LumaEvent {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return typeof candidate.name === 'string' && typeof candidate.start_at === 'string';
}

function getLumaHeaders(apiKey: string) {
  return {
    accept: 'application/json',
    'x-luma-api-key': apiKey,
  };
}

async function fetchLumaEventsPage(apiKey: string, calendarApiId: string, cursor?: string): Promise<LumaListEventsResponse> {
  const searchParams = new URLSearchParams({
    calendar_api_id: calendarApiId,
    pagination_limit: String(PAGE_SIZE),
  });
  if (cursor) {
    searchParams.set('pagination_cursor', cursor);
  }

  const response = await fetch(`${LUMA_API_BASE_URL}/calendar/list-events?${searchParams.toString()}`, {
    method: 'GET',
    headers: getLumaHeaders(apiKey),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Luma list-events request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as LumaListEventsResponse;
}

export async function fetchAllLumaCalendarEvents(): Promise<LumaEvent[]> {
  const apiKey = eventsConfig.server.lumaApiKey;
  if (!apiKey) {
    return [];
  }

  const calendarApiId = eventsConfig.server.lumaCalendarApiId;
  const events: LumaEvent[] = [];

  let cursor: string | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    const response = await fetchLumaEventsPage(apiKey, calendarApiId, cursor);

    const entries = response.entries ?? [];
    for (const entry of entries) {
      const eventCandidate = 'event' in entry ? entry.event : entry;
      if (isLumaEvent(eventCandidate)) {
        events.push(eventCandidate);
      }
    }

    if (!response.has_more || !response.next_cursor) {
      break;
    }
    cursor = response.next_cursor;
  }

  return events;
}
