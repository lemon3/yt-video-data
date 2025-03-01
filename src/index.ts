import { youtubeParser, loadScript } from './utils/index.ts';

declare global {
  interface Window {
    YT: any;
    // youtubeLoaded: boolean;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTVideoData {
  div: HTMLDivElement;
  wrapper: HTMLDivElement;
  isPlayerReady: boolean;
  player: any;
  promise: any;
  videoId: string;
  yt: any;
}

interface Result {
  author: string;
  title: string;
  duration: string;
  videoId: string;
  videoUrl: string;
  poster: {
    default: string;
    hqdefault: string;
    mqdefault: string;
    sddefault: string;
    maxresdefault: string;
    hq720: string;
  };
}

interface Poster {
  default: string;
  hqdefault: string;
  mqdefault: string;
  sddefault: string;
  maxresdefault: string;
  hq720: string;
}

const playerParameters = {
  width: "160",
  height: "90",
  playerVars: {
    playsinline: 0,
    autoplay: 0,
    enablejsapi: 0,
    iv_load_policy: 3,
    controls: 0,
    disablekb: 1,
    showinfo: 0,
    rel: 0,
    fs: 0,
  },
};

const ytEventName = "youtube-api-ready";
const ytApiUrl = "https://www.youtube.com/iframe_api";

/**
 * Youtube Helper Class
 */
class YTVideoData implements YTVideoData {
  initialized: boolean = false;

  /**
   * constructor
   */
  constructor() {
    this.isPlayerReady = false;
    this.init();
  }

  /**
   * Auxiliary function for creating the object to be returned
   * @returns Object
   */
  _createData() {
    const info = this.player.playerInfo;
    let author = info.videoData.author;
    author = author.replace("- Topic", "").trim();

    return {
      title: this.player.videoTitle || info.videoData.title,
      author,
      videoId: info.videoData.video_id,
      videoUrl: info.videoUrl,
      duration: info.duration,
      poster: this.getPoster() as Poster,
    };
  }

  /**
   * Asynchronous function the loads the new video via id
   * promise will be resolved or rejected inside: @see _stateChange
   *
   * @param {string} videoId
   * @returns Promise
   */
  async _load(videoId: string) {
    return new Promise((resolve, reject) => {
      this.player.loadVideoById(videoId);
      this.promise = { resolve, reject };
    });
  }

  /**
   * Asynchronous function the returns all infos for a given video id
   *
   * @param {string} videoId
   * @returns {object}
   */
  async getInfo(videoId: string): Promise<Result> {
    const parsed = youtubeParser(videoId);
    this.promise = null;

    return new Promise((resolve, reject) => {
      if (!this.initialized) reject('not initialized');
      if (!parsed) reject('not a valid video id');
      else videoId = parsed;
      this.videoId = videoId;

      const intervalId = setInterval(async () => {
        if (this.isPlayerReady) {
          clearInterval(intervalId);
          const data = await this._load(videoId);
          resolve(data as Result);
        }
      }, 20);
    });
  }

  /**
   * Youtube callback function
   * possible data values are:
   * BUFFERING:3| CUED:5| ENDED:0| PAUSED:2| PLAYING:1| UNSTARTED:-1
   *
   * @param {*} param0
   */
  _stateChange = ({ data }: any) => {
    if (this.promise && 1 === data) {
      this.player.mute().stopVideo().clearVideo();
      this.promise.resolve(this._createData());
    }
  };

  /**
   * Asynchronous Function that returns the YT object
   * Api is now ready to be used
   *
   * @returns
   */
  async _loadAPI() {
    return new Promise((resolve, reject) => {
      if (window.YT && window.YT.Player) return resolve(window.YT);

      const finished = () => {
        window.removeEventListener(ytEventName, finished);
        if (window.YT) return resolve(window.YT);
        reject(new Error("Failed to load YouTube API"));
      };
      window.addEventListener(ytEventName, finished);

      if (!window.onYouTubeIframeAPIReady) {
        const APIReady = new Event(ytEventName);
        window.onYouTubeIframeAPIReady = () => {
          window.dispatchEvent(APIReady);
        };
        loadScript(ytApiUrl);
      }
    });
  }

  /**
   * If the youtube iframe api player is ready
   */
  _playerReady = () => {
    this.isPlayerReady = true;
    this.player.mute();
    this.player.setVolume(0);
  };

  /**
   * create the youtube iframe api player
   * with given default Player Parameters
   */
  _createPlayer() {
    this.player = new (this.yt as any).Player(this.div, {
      ...playerParameters,
      videoId: "dQw4w9WgXcQ", // Assign a string value to videoId
      events: {
        onReady: this._playerReady,
        onStateChange: this._stateChange,
      },
    });
  }

  /**
   * To get different image resolutions for the given video
   *
   * @param {string} videoId The id of the video
   * @returns {object} Object with images at different resolutions
   */
  getPoster(videoId: string = this.videoId) {
    const base = `https://i.ytimg.com/vi/${videoId}/`;
    return [
      "default",
      "hqdefault",
      "mqdefault",
      "sddefault",
      "maxresdefault",
      "hq720",
    ].reduce((pre, cur) => ({ ...pre, [cur]: `${base}${cur}.jpg` }), {});
  }

  /**
   * destroys the yt player and the div
   */
  destroy() {
    if (!this.yt || !this.initialized) return;

    this.player.destroy();
    this.wrapper.remove();
    this.initialized = false;
  }

  /**
   * The init function
   *
   * @returns void
   */
  init() {
    if (this.initialized) return this;
    this.initialized = true;

    const wrapper = document.createElement("div");
    const ws = wrapper.style;
    ws.position = "absolute";
    ws.left = "-200vw";
    ws.opacity = "0";
    ws.visibility = "hidden";

    this.div = document.createElement("div");

    wrapper.append(this.div);
    document.body.append(wrapper);

    this.wrapper = wrapper;

    if (window.YT && window.YT.Player) {
      this.yt = window.YT;
      this._createPlayer();
      return;
    }

    (async () => {
      this.yt = await this._loadAPI();
      this._createPlayer();
    })();
  }
}

export { YTVideoData };
