import type { SWRConfiguration } from 'swr';

import useSWR from 'swr';

import axios, { fetcher, endpoints } from 'src/lib/axios';

type EventItem = {
  id: number;
  title: string;
  slug?: string;
  cover?: string;
  price?: number;
  date?: string;
  location?: string;
  // add fields you return from Laravel
};

type EventsResponse = {
  data: EventItem[];
  // if your API is { data, meta } add meta here
};

type EventResponse = {
  data: EventItem;
};

const swrOptions: SWRConfiguration = {
  revalidateOnFocus: false,
};

export function useGetEvents(params?: Record<string, any>) {
  const url = params ? [endpoints.public.events, { params }] : endpoints.public.events;
  const { data, error, isLoading, isValidating } = useSWR<EventsResponse>(url, fetcher, swrOptions);
  return {
    events: data?.data ?? [],
    isLoading,
    isValidating,
    error,
  };
}

export function useGetEvent(id?: string | number) {
  const url = id ? endpoints.public.eventDetails(id) : null;
  const { data, error, isLoading, isValidating } = useSWR<EventResponse>(url, fetcher, swrOptions);
  return {
    event: data?.data,
    isLoading,
    isValidating,
    error,
  };
}

// (optional) simple create order example for later
export async function createOrder(payload: any) {
  const res = await axios.post('/customer/orders', payload);
  return res.data;
}
