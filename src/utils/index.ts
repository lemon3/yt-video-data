/**
 *
 * @param url url or id of the youtube video
 * @returns
 */
const youtubeParser = (url: string): string | false => {
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  } else {
    const regex =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regex);
    return match && match[7] && match[7].length === 11 ? match[7] : false;
  }
};

/**
 *
 * @param url
 * @param document
 */
const loadScript = (
  url: string,
  document: Document = window.document
): void => {
  const tag = document.createElement('script');
  tag.src = url;
  const firstScriptTag = document.getElementsByTagName('script')[0];
  if (firstScriptTag && firstScriptTag.parentNode) {
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  } else {
    document.body.append(tag);
  }
};

export { youtubeParser, loadScript };
