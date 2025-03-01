/*!
* YTVideoData v0.1.1
* https://github.com/lemon3/yt-video-data
*/
var m = Object.defineProperty, v = Object.defineProperties;
var P = Object.getOwnPropertyDescriptors;
var f = Object.getOwnPropertySymbols;
var _ = Object.prototype.hasOwnProperty, b = Object.prototype.propertyIsEnumerable;
var c = (i, e, t) => e in i ? m(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t, p = (i, e) => {
  for (var t in e || (e = {}))
    _.call(e, t) && c(i, t, e[t]);
  if (f)
    for (var t of f(e))
      b.call(e, t) && c(i, t, e[t]);
  return i;
}, w = (i, e) => v(i, P(e));
var n = (i, e, t) => c(i, typeof e != "symbol" ? e + "" : e, t);
var o = (i, e, t) => new Promise((a, s) => {
  var d = (r) => {
    try {
      h(t.next(r));
    } catch (y) {
      s(y);
    }
  }, l = (r) => {
    try {
      h(t.throw(r));
    } catch (y) {
      s(y);
    }
  }, h = (r) => r.done ? a(r.value) : Promise.resolve(r.value).then(d, l);
  h((t = t.apply(i, e)).next());
});
const g = (i) => {
  if (/^[a-zA-Z0-9_-]{11}$/.test(i))
    return i;
  {
    const e = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/, t = i.match(e);
    return t && t[7] && t[7].length === 11 ? t[7] : !1;
  }
}, T = (i, e = window.document) => {
  const t = e.createElement("script");
  t.src = i;
  const a = e.getElementsByTagName("script")[0];
  a && a.parentNode ? a.parentNode.insertBefore(t, a) : e.body.append(t);
}, I = {
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
    fs: 0
  }
}, u = "youtube-api-ready", Y = "https://www.youtube.com/iframe_api";
class R {
  /**
   * constructor
   */
  constructor() {
    n(this, "initialized", !1);
    /**
     * Youtube callback function
     * possible data values are:
     * BUFFERING:3| CUED:5| ENDED:0| PAUSED:2| PLAYING:1| UNSTARTED:-1
     *
     * @param {*} param0
     */
    n(this, "_stateChange", ({ data: e }) => {
      this.promise && e === 1 && (this.player.mute().stopVideo().clearVideo(), this.promise.resolve(this._createData()));
    });
    /**
     * If the youtube iframe api player is ready
     */
    n(this, "_playerReady", () => {
      this.isPlayerReady = !0, this.player.mute(), this.player.setVolume(0);
    });
    this.isPlayerReady = !1, this.init();
  }
  /**
   * Auxiliary function for creating the object to be returned
   * @returns Object
   */
  _createData() {
    const e = this.player.playerInfo;
    let t = e.videoData.author;
    return t = t.replace("- Topic", "").trim(), {
      title: this.player.videoTitle || e.videoData.title,
      author: t,
      videoId: e.videoData.video_id,
      videoUrl: e.videoUrl,
      duration: e.duration,
      poster: this.getPoster()
    };
  }
  /**
   * Asynchronous function the loads the new video via id
   * promise will be resolved or rejected inside: @see _stateChange
   *
   * @param {string} videoId
   * @returns Promise
   */
  _load(e) {
    return o(this, null, function* () {
      return new Promise((t, a) => {
        this.player.loadVideoById(e), this.promise = { resolve: t, reject: a };
      });
    });
  }
  /**
   * Asynchronous function the returns all infos for a given video id
   *
   * @param {string} videoId
   * @returns {object}
   */
  getInfo(e) {
    return o(this, null, function* () {
      const t = g(e);
      return this.promise = null, new Promise((a, s) => {
        this.initialized || s("not initialized"), t ? e = t : s("not a valid video id"), this.videoId = e;
        const d = setInterval(() => o(this, null, function* () {
          if (this.isPlayerReady) {
            clearInterval(d);
            const l = yield this._load(e);
            a(l);
          }
        }), 20);
      });
    });
  }
  /**
   * Asynchronous Function that returns the YT object
   * Api is now ready to be used
   *
   * @returns
   */
  _loadAPI() {
    return o(this, null, function* () {
      return new Promise((e, t) => {
        if (window.YT && window.YT.Player) return e(window.YT);
        const a = () => {
          if (window.removeEventListener(u, a), window.YT) return e(window.YT);
          t(new Error("Failed to load YouTube API"));
        };
        if (window.addEventListener(u, a), !window.onYouTubeIframeAPIReady) {
          const s = new Event(u);
          window.onYouTubeIframeAPIReady = () => {
            window.dispatchEvent(s);
          }, T(Y);
        }
      });
    });
  }
  /**
   * create the youtube iframe api player
   * with given default Player Parameters
   */
  _createPlayer() {
    this.player = new this.yt.Player(this.div, w(p({}, I), {
      videoId: "dQw4w9WgXcQ",
      // Assign a string value to videoId
      events: {
        onReady: this._playerReady,
        onStateChange: this._stateChange
      }
    }));
  }
  /**
   * To get different image resolutions for the given video
   *
   * @param {string} videoId The id of the video
   * @returns {object} Object with images at different resolutions
   */
  getPoster(e = this.videoId) {
    const t = `https://i.ytimg.com/vi/${e}/`;
    return [
      "default",
      "hqdefault",
      "mqdefault",
      "sddefault",
      "maxresdefault",
      "hq720"
    ].reduce((a, s) => w(p({}, a), { [s]: `${t}${s}.jpg` }), {});
  }
  /**
   * destroys the yt player and the div
   */
  destroy() {
    !this.yt || !this.initialized || (this.player.destroy(), this.wrapper.remove(), this.initialized = !1);
  }
  /**
   * The init function
   *
   * @returns void
   */
  init() {
    if (this.initialized) return this;
    this.initialized = !0;
    const e = document.createElement("div"), t = e.style;
    if (t.position = "absolute", t.left = "-200vw", t.opacity = "0", t.visibility = "hidden", this.div = document.createElement("div"), e.append(this.div), document.body.append(e), this.wrapper = e, window.YT && window.YT.Player) {
      this.yt = window.YT, this._createPlayer();
      return;
    }
    o(this, null, function* () {
      this.yt = yield this._loadAPI(), this._createPlayer();
    });
  }
}
export {
  R as YTVideoData
};
