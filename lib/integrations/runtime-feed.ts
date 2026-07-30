export const runtimeFeedRefreshMilliseconds = 5 * 60 * 1000;
export const runtimeFeedFocusStaleMilliseconds = 60 * 1000;

export function withRuntimeCacheBust(endpoint: string, timestamp = Date.now()) {
  const url = new URL(endpoint);
  url.searchParams.set("_netyr_refresh", String(timestamp));
  return url.toString();
}
