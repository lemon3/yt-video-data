import { describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { youtubeParser, loadScript } from '../src/utils';

//"https://www.youtube.com/iframe_api";
const ytApiUrl = 'https://example.com/existing-script.js';

describe('youtubeParser', () => {
  it('should parse youtube video IDs from URLs', () => {
    const testCases = [
      {
        url: 'JeSkFRTj7kU',
        expected: 'JeSkFRTj7kU',
      },
      {
        url: 'http://www.youtube.com/watch?v=JeSkFRTj7kU&feature=feedrec_grec_index',
        expected: 'JeSkFRTj7kU',
      },
      {
        url: 'youtube.com/watch?v=JeSkFRTj7kU&feature=feedrec_grec_index',
        expected: 'JeSkFRTj7kU',
      },
      {
        url: 'watch?v=JeSkFRTj7kU&feature=feedrec_grec_index',
        expected: 'JeSkFRTj7kU',
      },
      {
        url: 'http://www.youtube.com/v/JeSkFRTj7kU?fs=1&amp;hl=en_US&amp;rel=0',
        expected: 'JeSkFRTj7kU',
      },
      {
        url: 'http://www.youtube.com/watch?v=JeSkFRTj7kU#t=0m10s',
        expected: 'JeSkFRTj7kU',
      },
      {
        url: 'http://www.youtube.com/embed/JeSkFRTj7kU?rel=0',
        expected: 'JeSkFRTj7kU',
      },
      {
        url: 'http://www.youtube.com/watch?v=JeSkFRTj7kU',
        expected: 'JeSkFRTj7kU',
      },
      {
        url: 'http://youtu.be/JeSkFRTj7kU',
        expected: 'JeSkFRTj7kU',
      },
      {
        url: 'http://youtu.be/JeSkFRTj7kU?test=123#456',
        expected: 'JeSkFRTj7kU',
      },
    ];

    testCases.forEach((testCase) => {
      const result = youtubeParser(testCase.url);
      expect(result).toBe(testCase.expected);
    });
  });

  it('should return false for invalid URLs', () => {
    const invalidUrls = [
      'https://www.example.com',
      'https://www.test.at',
      'www.test.at',
      'invalid url',
      'http://www.youtube.com/watch?v=JeSkFRTj', // this id is too short
    ];

    invalidUrls.forEach((url) => {
      const result = youtubeParser(url);
      expect(result).toBe(false);
    });
  });
});

describe('loadScript', () => {
  it('should create a new script tag and insert it into the document', () => {
    const dom = new JSDOM();
    const document = dom.window.document;

    loadScript(ytApiUrl, document);

    const scriptTags = document.getElementsByTagName('script');
    expect(scriptTags.length).toBe(1);
    expect(scriptTags[0].src).toBe(ytApiUrl);
  });

  it('should insert the script tag before the first script tag if one exists', () => {
    const dom = new JSDOM();
    const document = dom.window.document;

    const existingScriptTag = document.createElement('script');
    existingScriptTag.src = 'https://example.com/existing-script.js';
    document.body.appendChild(existingScriptTag);

    loadScript(ytApiUrl, document);

    const scriptTags = document.getElementsByTagName('script');
    expect(scriptTags.length).toBe(2);
    expect(scriptTags[0].src).toBe(ytApiUrl);
    expect(scriptTags[1].src).toBe('https://example.com/existing-script.js');
  });
});
