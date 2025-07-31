const fileInput = document.getElementById('fileInput');
const status = document.getElementById('status');
const list = document.getElementById('list');

const worker = new Worker('./worker.js');

worker.onmessage = (e) => {
  const { type, payload } = e.data;
  if (type === 'progress') {
    status.textContent = `解析中：${payload}%`;
  } else if (type === 'done') {
    status.textContent = `解析完成，共 ${payload.length} 条数据`;
    payload.slice(0, 10).forEach((item, index) => {
      const li = document.createElement('li');
      li.textContent = `第${index + 1}项: ${JSON.stringify(item)}`;
      list.appendChild(li);
    });
  }
};

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    const text = await file.text();
    worker.postMessage({ type: 'parse', payload: text });
  }
});
