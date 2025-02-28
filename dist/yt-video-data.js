/*!
* YTVideoData v0.1.0
* https://github.com/lemon3/yt-video-data
*/
var v = Object.defineProperty, f = Object.defineProperties;
var g = Object.getOwnPropertyDescriptors;
var m = Object.getOwnPropertySymbols;
var _ = Object.prototype.hasOwnProperty, P = Object.prototype.propertyIsEnumerable;
var c = (a, e, t) => e in a ? v(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t, h = (a, e) => {
  for (var t in e || (e = {}))
    _.call(e, t) && c(a, t, e[t]);
  if (m)
    for (var t of m(e))
      P.call(e, t) && c(a, t, e[t]);
  return a;
}, u = (a, e) => f(a, g(e));
var s = (a, e, t) => c(a, typeof e != "symbol" ? e + "" : e, t);
var d = (a, e, t) => new Promise((i, r) => {
  var l = (n) => {
    try {
      y(t.next(n));
    } catch (p) {
      r(p);
    }
  }, o = (n) => {
    try {
      y(t.throw(n));
    } catch (p) {
      r(p);
    }
  }, y = (n) => n.done ? i(n.value) : Promise.resolve(n.value).then(l, o);
  y((t = t.apply(a, e)).next());
});
const b = (a) => {
  if (/^[a-zA-Z0-9_-]{11}$/.test(a))
    return a;
  {
    const e = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/, t = a.match(e);
    return t && t[7] && t[7].length === 11 ? t[7] : !1;
  }
}, I = (a, e = window.document) => {
  const t = e.createElement("script");
  t.src = a;
  const i = e.getElementsByTagName("script")[0];
  i && i.parentNode ? i.parentNode.insertBefore(t, i) : e.body.append(t);
}, T = {
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
}, w = "youtube-api-ready", E = "https://www.youtube.com/iframe_api";
class A {
  /**
   * constructor
   */
  constructor() {
    s(this, "div");
    s(this, "wrapper");
    s(this, "ready");
    s(this, "player");
    s(this, "promise");
    s(this, "videoId", "");
    s(this, "yt");
    /**
     * Youtube callback function
     * possible data values are:
     * BUFFERING:3| CUED:5| ENDED:0| PAUSED:2| PLAYING:1| UNSTARTED:-1
     *
     * @param {*} param0
     */
    s(this, "_stateChange", ({ data: e }) => {
      this.promise && e === 1 && (this.player.mute().stopVideo().clearVideo(), this.promise.resolve(this._createData()));
    });
    /**
     * If the youtube iframe api player is ready
     */
    s(this, "_playerReady", () => {
      this.ready = !0, this.player.mute(), this.player.setVolume(0);
    });
    const e = document.createElement("div");
    e.style.position = "absolute", e.style.left = "-200vw", e.style.opacity = "0", e.style.visibility = "hidden", this.div = document.createElement("div"), e.append(this.div), document.body.append(e), this.wrapper = e, this.ready = !1, this.init();
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
    return d(this, null, function* () {
      return new Promise((t, i) => {
        this.player.loadVideoById(e), this.promise = { resolve: t, reject: i };
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
    return d(this, null, function* () {
      const t = b(e);
      return this.promise = null, console.log(e, t), new Promise((i, r) => {
        t ? e = t : r("not a valid video id or url"), this.videoId = e;
        const l = setInterval(() => d(this, null, function* () {
          if (this.ready) {
            clearInterval(l);
            const o = yield this._load(e);
            i(o);
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
    return d(this, null, function* () {
      return new Promise((e, t) => {
        if (window.YT) return e(window.YT);
        const i = (o) => {
          if (window.removeEventListener(w, r), o) return e(o);
          t(new Error("Failed to load YouTube API"));
        }, r = (o) => i(o.target.YT), l = new Event(w);
        window.addEventListener(w, r), window.onYouTubeIframeAPIReady = () => {
          window.dispatchEvent(l);
        }, I(E);
      });
    });
  }
  /**
   * create the youtube iframe api player
   * with given default Player Parameters
   */
  _createPlayer() {
    this.player = new this.yt.Player(this.div, u(h({}, T), {
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
    ].reduce((i, r) => u(h({}, i), { [r]: `${t}${r}.jpg` }), {});
  }
  /**
   * destroys the yt player and the div
   */
  destroy() {
    this.yt && (this.yt.destroy(), this.wrapper.remove());
  }
  /**
   * The init function
   *
   * @returns
   */
  init() {
    if (window.YT) {
      this.yt = window.YT, this._createPlayer();
      return;
    }
    d(this, null, function* () {
      this.yt = yield this._loadAPI(), this._createPlayer();
    });
  }
}
export {
  A as YTVideoData
};
