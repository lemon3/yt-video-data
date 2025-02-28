# yt-video-data
get video data from youtube videos via the iframe api!

## Usage

add package to your project. (npm package coming soon)
```bash
pnmp add yt-video-data
```

use it with await inside a async function
a **good practice** is it to wrap the call in an try-catch block when using **await**!
```js
import { YTVideoData } from "yt-video-data";

const ytvd = new YTVideoData();
let res;
(async () => {
  try {
    res = await ytvd.getInfo('JeSkFRTj7kU');
  } catch (error) {
    console.log(error);
    return false;
  }
  console.log(res);
})();
```
or with the **then** & **catch** callback
```js
import { YTVideoData } from "yt-video-data";

const ytvd = new YTVideoData();
ytvd.getInfo("JeSkFRTj7kU")
  .then(data => console.log(data))
  .catch(error => console.log(error));
```

output for 'JeSkFRTj7kU':
```js
{
  author: "Icona Pop"
  duration: 157.161
  poster: {
    default: "https://i.ytimg.com/vi/JeSkFRTj7kU/default.jpg",
    hq720: "https://i.ytimg.com/vi/JeSkFRTj7kU/hq720.jpg",
    hqdefault: "https://i.ytimg.com/vi/JeSkFRTj7kU/hqdefault.jpg",
    maxresdefault: "https://i.ytimg.com/vi/JeSkFRTj7kU/maxresdefault.jpg",
    mqdefault: "https://i.ytimg.com/vi/JeSkFRTj7kU/mqdefault.jpg",
    sddefault: "https://i.ytimg.com/vi/JeSkFRTj7kU/sddefault.jpg",
  }
  title: "I Love It (feat. Charli XCX)",
  videoId: "JeSkFRTj7kU",
  videoUrl: "https://www.youtube.com/watch?v=JeSkFRTj7kU",
}
```
