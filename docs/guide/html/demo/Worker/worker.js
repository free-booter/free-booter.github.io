console.log('worker');

self.onmessage = function (e) {
  const { type, payload } = e.data;

  if (type === 'parse') {
    try {
      const raw = JSON.parse(payload);
      const total = raw.length;
      const chunkSize = Math.ceil(total / 10);
      const parsed = [];

      for (let i = 0; i < total; i++) {
        parsed.push(raw[i]);

        // 每完成一个 chunk，就发送一次进度
        if (i % chunkSize === 0) {
          const progress = Math.floor((i / total) * 100);
          self.postMessage({ type: 'progress', payload: progress });
        }
      }

      self.postMessage({ type: 'done', payload: parsed });
    } catch (err) {
      self.postMessage({ type: 'error', payload: err.message });
    }
  }
};
