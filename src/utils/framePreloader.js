export function createFrameCache(urls) {
  const cache = new Map();

  const load = (index) => {
    const safeIndex = Math.max(0, Math.min(urls.length - 1, index));
    if (cache.has(safeIndex)) return cache.get(safeIndex);

    const image = new Image();
    image.decoding = 'async';
    image.loading = 'eager';
    image.src = urls[safeIndex];

    const record = {
      image,
      ready: false,
      promise: image
        .decode()
        .catch(() => undefined)
        .then(() => {
          record.ready = image.complete && image.naturalWidth > 0;
          return record;
        }),
    };

    cache.set(safeIndex, record);
    return record;
  };

  const preloadWindow = (center, radius = 18) => {
    const start = Math.max(0, Math.floor(center - radius));
    const end = Math.min(urls.length - 1, Math.ceil(center + radius));
    for (let i = start; i <= end; i += 1) load(i);
  };

  const warmup = async () => {
    const anchors = [0, 1, 2, Math.floor(urls.length * 0.25), Math.floor(urls.length * 0.5), Math.floor(urls.length * 0.75), urls.length - 1];
    anchors.forEach((index) => preloadWindow(index, 3));
    await Promise.all(anchors.map((index) => load(index).promise));
  };

  return { load, preloadWindow, warmup, cache };
}
