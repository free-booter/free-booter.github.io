# 大文件上传

- 切片上传
- 断点续传
- 秒传
- 暂停上传

## 切片上传

将一个大文件进行切割，主要使用的就是`Blob.prototype.slice`，和数组的`slice`用法相似。`slice`方法有两个参数，第一个是切割的开始位置，第二个是切割的长度。文件的`slice`将返回<span style="color:red">原文件的某一个切片</span>。

### 思路
- 将文件切割成多个切片，设置不同的文件名(携带hash值)
- 同时上传多个切片
- 合并切片

### 代码

#### 前端

```vue
<template>
  <div>
    <h1>other page</h1>
    <input type="file" @change="handleFileChange">
    <el-button @click="handleUpload">upload</el-button>
    <el-button @click="handleCancel">取消上传</el-button>
    <el-button @click="handleContinue">继续上传</el-button>

    <h1>上传进度</h1>
    <div>
      <h2>总进度：</h2>
      <el-progress :text-inside="true" :stroke-width="26" :percentage="uploadPercentage" />
    </div>
    <h2>其他的进度：</h2>
    <br />
    <div v-for="(item, index) in data" :key="index">
      {{ item.hash }} --- {{ item.chunk.size }}
      <el-progress :text-inside="true" :stroke-width="26" :percentage="item.progress" />
      <br />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { reactive } from 'vue';
import axios from 'axios'
import { computed } from 'vue';

const container = reactive({
  file: null as File | null,
  worker: null as Worker | null,
  hash: '',
})

//  切片大小
const SIZE = 10 * 1024 * 1024
const data = ref<{ chunk: Blob, hash: string, progress: number }[]>([])
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files!.item(0)
  console.log(file);
  if (!file) return
  container.file = file
}

// 生成文件切片
const createFileChunk = (file: File, len = 0, size = SIZE,) => {
  const fileChunkList = []
  let cur = 0
  let remainingSize = file.size

  if (len) {
    for (let i = len; i > 0; i--) {
      // 保证最后一个切片大小能够包含剩余的所有数据
      const randomSize = i === 1 ? remainingSize : Math.ceil(Math.random() * (remainingSize / i) * 2)
      const fileChunk = file.slice(cur, cur + randomSize);
      fileChunkList.push({ file: fileChunk });
      cur = randomSize;
      remainingSize -= randomSize;
    }
  } else {
    while (cur < file.size) {
      fileChunkList.push({ file: file.slice(cur, cur + size) });
      cur += size;
    }
  }


  return fileChunkList
}

// 上传切片
const requestList = ref<any[]>([]);
const uploadChunks = async () => {
  requestList.value = data.value.map(({ chunk, hash }, index) => {
    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("hash", hash);
    formData.append("filename", container.file!.name);
    formData.append("fileHash", container.hash);

    // 返回一个函数，延迟请求的发送
    const CancelToken = axios.CancelToken
    let source = CancelToken.source()
    return {
      task: () => axios({
        url: 'http://localhost:8000',
        method: "POST",
        data: formData,
        cancelToken: source.token,
        // 上传进度
        onUploadProgress: (e) => {
          data.value[index].progress = Math.ceil((e.loaded / e.total!) * 100);
        }
      }),
      cancel: () => {
        source.cancel('上传取消')
      },
      repeat: () => {
        source = CancelToken.source()
      },
      hash,
    }
  })

  try {
    await limitPromises(requestList.value, 3); // 限制并发数为3
    await mergeRequest();
  } catch (error) {
    console.log(error, 'err');

  }
};

// promise限制并发数
const limitPromises = async (taskList: any[], maxConcurrency: number): Promise<void> => {
  const runningTasks: Promise<any>[] = [];
  for (const task of taskList) {
    const promise = task.task().then(() => {
      runningTasks.splice(runningTasks.indexOf(promise), 1);
    });

    runningTasks.push(promise);

    if (runningTasks.length >= maxConcurrency) {
      console.log('满了');

      await Promise.race(runningTasks); // 等待最早完成的任务
    }
  }

  await Promise.all(runningTasks); // 等待所有剩余任务完成
};

// 合并切片请求
const mergeRequest = async () => {
  await axios({
    url: 'http://localhost:8000/merge',
    headers: {
      'content-type': 'application/json'
    },
    data: JSON.stringify({
      size: SIZE,
      filename: container.file!.name,
      fileHash: container.hash,
      type: container.file!.name.split('.').at(-1)
    }),
    method: 'POST',  // 确保使用 POST 方法
  })
}

// 生成文件 hash
const hashPercentage = ref(0)
const calculateHash = (fileChunkList: any) => {
  return new Promise((resolve) => {
    // 添加worker属性
    container.worker = new Worker('../../public/hash.js')
    container.worker.postMessage({ fileChunkList })
    container.worker.onmessage = e => {
      const { percentage, hash } = e.data
      hashPercentage.value = percentage
      if (hash) {
        resolve(hash)
      }
    }
  })
}

// 校验文件是否已经存在服务端
const verifyFile = (hash: string) => {
  return new Promise((resolve) => {
    return axios({
      url: 'http://localhost:8000/verify',
      method: 'POST',
      data: JSON.stringify({
        fileHash: hash,
        type: container.file!.name.split('.').at(-1)
      }),
      headers: {
        'content-type': 'application/json'
      }
    }).then(res => {
      resolve(res.data)
    })
  })
}
const handleUpload = async () => {
  const startTime = Date.now(); // 记录开始时间
  if (!container.file) return
  const fileChunkList = createFileChunk(container.file)
  console.log(fileChunkList);
  container.hash = await calculateHash(fileChunkList) as string
  // 校验是否存在服务器
  const res = await verifyFile(container.hash) as { code: number, data: number }
  if (res.data) {
    data.value = fileChunkList.map(({ file }, index) => {
      return {
        fileHash: container.hash,
        chunk: file,
        hash: container.hash + "-" + index,
        progress: 100
      }
    })
    return
  }
  data.value = fileChunkList.map(({ file }, index) => {
    return {
      fileHash: container.hash,
      chunk: file,
      hash: container.hash + "-" + index,
      progress: 0
    }
  })
  await uploadChunks()
  const endTime = Date.now(); // 记录结束时间
  const duration = (endTime - startTime) / 1000; // 计算花费的时间 (秒)
  console.log(duration, '秒');
}

// 取消上传
const handleCancel = () => {
  console.log('canceling uploads...');

  // 直接调用所有请求任务的cancel方法
  requestList.value.forEach(item => item.cancel());

  console.log('Uploads canceled');
}

// 继续上传
const handleContinue = async () => {
  // 获取已经上传的索引，过滤出未上传的切片
  const res = await axios({
    url: 'http://localhost:8000/list',
    method: 'POST',
    data: {
      fileHash: container.hash,
    }
  })
  if (res.data.data.length) {
    requestList.value = requestList.value.filter(item => !res.data.data.includes(item.hash))
    requestList.value.forEach(item => item.repeat())
    await limitPromises(requestList.value, 3); // 限制并发数为3
    await mergeRequest();
  }
}

// 总进度条
const uploadPercentage = computed(() => {
  if (!data.value.length) return 0;

  const totalSize = data.value.reduce((acc, cur) => acc + cur.chunk.size, 0);
  const loaded = data.value.reduce((acc, cur) => acc + (cur.chunk.size * cur.progress / 100), 0);

  return Math.floor((loaded / totalSize) * 100);
});

</script>
<style scoped lang="scss"></style>
```

- 假设我们现在上传的`100MB`，将会根据`SIZE`切割成10份相同大小的切片
- 根据`createFileChunk`返回的切片数组`fileChunkList`，我们可以知道每个切片的大小是`SIZE`，每个切片的切片名是`filename+index`，例如`index=1`，那么切片名就是`filename+1`，也就是`filename-1`
- 将切片数组`fileChunkList`中的每个切片通过`FormData`上传到服务器，同时上传进度也通过`onUploadProgress`回调函数传递给服务器
- 设置`promise`请求并发数为3，等待最早完成的任务，最后等待所有剩余任务完成
- 请求合并切片`mergeRequest`,需要将`SIZE`传递，因为切片大小相同，可以准确的找到合并切片的位置

#### 服务端
```js
const http = require('http');
const path = require('path');
const fse = require('fs-extra');
const multiparty = require('multiparty');

const server = http.createServer();

// 大文件存储
const UPLOAD_DIR = path.resolve(__dirname, 'upload');

const resolvePost = req => new Promise(resolve => {
  let chunk = '';
  req.on('data', data => {
    chunk += data;  // 这里应该累加数据，以防止数据块被覆盖
  });
  req.on('end', () => {
    if (!chunk) {
      resolve({});  // 空请求体，返回空对象
    } else {
      try {
        resolve(JSON.parse(chunk));
      } catch (error) {
        reject(new Error('Invalid JSON'));  // JSON解析失败时抛出错误
      }
    }
  });
});

// 写入文件流
const pipeStream = (path, writeStream) => new Promise(resolve => {
  const readStream = fse.createReadStream(path);
  readStream.on('end', () => {
    fse.unlinkSync(path);  // 删除临时切片文件
    resolve();
  });
  readStream.pipe(writeStream);
});

// 合并切片
const mergeFileChunk = async (filePath, filename, size) => {
  const chunkDir = path.resolve(UPLOAD_DIR, 'chunkDir_' + filename);
  const chunkPaths = await fse.readdir(chunkDir);

  chunkPaths.sort((a, b) => a.split("-")[1] - b.split("-")[1]);

  await Promise.all(
    chunkPaths.map((chunkPath, index) =>
      pipeStream(
        path.resolve(chunkDir, chunkPath),
        fse.createWriteStream(filePath, {
          start: index * size,
        })
      )
    )
  );

  fse.rmdirSync(chunkDir);  // 删除切片文件夹
};

server.on('request', async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.url === "/merge") {
    try {
      const { size, fileHash, type } = await resolvePost(req);
      const filePath = path.resolve(UPLOAD_DIR, fileHash);
      await mergeFileChunk(`${filePath}.${type}`, fileHash, size);
      res.end(JSON.stringify({
        code: 0,
        message: 'File merged successfully'
      }));
    } catch (error) {
      console.log(error, 'error');

      res.statusCode = 500;
      res.end(JSON.stringify({
        code: 1,
        message: 'Error during file merge'
      }));
    }
    return;
  }

  // 校验文件是否存在服务器
  if (req.url === '/verify') {
    const { fileHash, type } = await resolvePost(req);
    const filePath = path.resolve(UPLOAD_DIR, `${fileHash}.${type}`);
    if (fse.existsSync(filePath)) {
      res.end(JSON.stringify({
        code: 0,
        data: 1
      }));
    } else {
      res.end(JSON.stringify({
        code: 0,
        data: 0
      }));
    }
    return;
  }

  // 获取已上传的索引
  if(req.url === '/list') {
    const { fileHash } = await resolvePost(req);
    const chunkDir = path.resolve(UPLOAD_DIR, 'chunkDir_' + fileHash);
    const chunkPaths = await fse.readdir(chunkDir);
    res.end(JSON.stringify({
      code: 0,
      data:chunkPaths
    }));
    return
  }

  const mul = new multiparty.Form();

  mul.parse(req, async (err, fields, files) => {
    if (err) {
      res.statusCode = 500;
      res.end("Error parsing form data");
      return;
    }
    const [chunk] = files.chunk;
    const [hash] = fields.hash;
    const [fileHash] = fields.fileHash;
    const [filename] = fields.filename;

    const chunkDir = path.resolve(UPLOAD_DIR, 'chunkDir_' + fileHash);

    if (!fse.existsSync(chunkDir)) {
      fse.mkdirsSync(chunkDir);
    }
    await fse.move(chunk.path, `${chunkDir}/${hash}`);
    res.end("Received file chunk");
  });
});

server.listen(8000, () => console.log('Listening on port 8000'));
```


#### worker.js
```js
// /public/hash.js

// 导入脚本
self.importScripts("/spark-md5.min.js");

// 生成文件 hash
self.onmessage = e => {
 const { fileChunkList } = e.data;
 const spark = new self.SparkMD5.ArrayBuffer();
 let percentage = 0;
 let count = 0;
 const loadNext = index => {
  const reader = new FileReader();
  reader.readAsArrayBuffer(fileChunkList[index].file);
  reader.onload = e => {
   count++;
   spark.append(e.target.result);
   if (count === fileChunkList.length) {
    self.postMessage({
     percentage: 100,
     hash: spark.end()
     });
    self.close();
    } else {
    percentage += 100 / fileChunkList.length;
    self.postMessage({
     percentage
     });
    // calculate recursively
    loadNext(count);
    }
   };
  };
 loadNext(0);
};
```

### 链接
https://juejin.cn/post/6844904046436843527#heading-16