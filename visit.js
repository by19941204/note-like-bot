const { chromium } = require('playwright');

// 关键: UA版本必须和Playwright的Chromium版本匹配!
// Playwright 1.50 使用 Chromium 145
const CHROME_VERSION = '145';
const CHROME_FULL = '145.0.7632.6';

const devices = [
  { ua: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROME_FULL} Safari/537.36`, w: 1920, h: 1080, platform: "Win32", mobile: false, memory: 8, cores: 8, pf: "Windows" },
  { ua: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROME_FULL} Safari/537.36`, w: 1440, h: 900, platform: "MacIntel", mobile: false, memory: 16, cores: 10, pf: "macOS" },
  { ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1", w: 390, h: 844, platform: "iPhone", mobile: true, memory: 4, cores: 6, pf: "iOS" },
  { ua: `Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROME_FULL} Mobile Safari/537.36`, w: 412, h: 915, platform: "Linux armv81", mobile: true, memory: 8, cores: 8, pf: "Android" },
  { ua: "Mozilla/5.0 (iPad; CPU OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1", w: 1024, h: 1366, platform: "iPad", mobile: false, memory: 8, cores: 6, pf: "iOS" },
  { ua: `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0`, w: 1366, h: 768, platform: "Win32", mobile: false, memory: 8, cores: 4, pf: "Windows" },
  { ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15", w: 1680, h: 1050, platform: "MacIntel", mobile: false, memory: 16, cores: 8, pf: "macOS" },
  { ua: `Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROME_FULL} Mobile Safari/537.36`, w: 360, h: 780, platform: "Linux armv81", mobile: true, memory: 8, cores: 8, pf: "Android" },
  { ua: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROME_FULL} Safari/537.36 Edg/${CHROME_FULL}`, w: 1536, h: 864, platform: "Win32", mobile: false, memory: 16, cores: 12, pf: "Windows" },
  { ua: `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROME_FULL} Safari/537.36`, w: 1920, h: 1080, platform: "Linux x86_64", mobile: false, memory: 8, cores: 4, pf: "Linux" },
  { ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_7_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1", w: 375, h: 812, platform: "iPhone", mobile: true, memory: 4, cores: 6, pf: "iOS" },
  { ua: `Mozilla/5.0 (Linux; Android 13; SM-A546B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROME_FULL} Mobile Safari/537.36`, w: 384, h: 854, platform: "Linux armv81", mobile: true, memory: 6, cores: 8, pf: "Android" },
  { ua: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROME_FULL} Safari/537.36`, w: 2560, h: 1440, platform: "Win32", mobile: false, memory: 32, cores: 16, pf: "Windows" },
  { ua: `Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROME_FULL} Safari/537.36`, w: 1280, h: 800, platform: "MacIntel", mobile: false, memory: 8, cores: 8, pf: "macOS" },
  { ua: `Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROME_FULL} Mobile Safari/537.36`, w: 393, h: 851, platform: "Linux armv81", mobile: true, memory: 8, cores: 8, pf: "Android" },
  { ua: `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0`, w: 1600, h: 900, platform: "Win32", mobile: false, memory: 16, cores: 8, pf: "Windows" },
];

const referrers = [
  'https://www.google.co.jp/', 'https://www.google.com/',
  'https://note.com/', 'https://note.com/funeshiru',
  'https://t.co/abc', 'https://search.yahoo.co.jp/', '',
];

(async () => {
  const idx = parseInt(process.env.DEVICE_IDX) % devices.length;
  const noteKey = process.env.NOTE_KEY;
  const noteId = process.env.NOTE_ID;
  const d = devices[idx];
  const ref = referrers[Math.floor(Math.random() * referrers.length)];
  const isChrome = d.ua.includes('Chrome/') && !d.ua.includes('Firefox');

  const headers = {
    'Accept-Language': 'ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Upgrade-Insecure-Requests': '1',
  };
  if (isChrome) {
    headers['sec-ch-ua'] = `"Chromium";v="${CHROME_VERSION}", "Not;A=Brand";v="24", "Google Chrome";v="${CHROME_VERSION}"`;
    headers['sec-ch-ua-mobile'] = d.mobile ? '?1' : '?0';
    headers['sec-ch-ua-platform'] = `"${d.pf}"`;
    headers['sec-fetch-dest'] = 'document';
    headers['sec-fetch-mode'] = 'navigate';
    headers['sec-fetch-site'] = 'none';
    headers['sec-fetch-user'] = '?1';
  }

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--window-size=' + d.w + ',' + d.h,
    ]
  });

  const context = await browser.newContext({
    userAgent: d.ua,
    locale: 'ja-JP',
    timezoneId: 'Asia/Tokyo',
    viewport: { width: d.w, height: d.h },
    screen: { width: d.w, height: d.h },
    hasTouch: d.mobile,
    isMobile: d.mobile,
    colorScheme: 'light',
    extraHTTPHeaders: headers,
  });

  const page = await context.newPage();

  // ========== 完整反检测 ==========
  await page.addInitScript((config) => {
    // 1. 删除所有Playwright痕迹
    delete window.__playwright;
    delete window.__pw_manual;
    delete window.__PW_inspect;
    delete window.__pwInitScripts;

    // 2. webdriver - 使用 defineProperty 在最底层覆盖
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
      configurable: true,
    });
    // 同时删除原型上的
    delete Object.getPrototypeOf(navigator).webdriver;

    // 3. platform & hardware
    Object.defineProperty(navigator, 'platform', { get: () => config.platform });
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => config.cores });
    Object.defineProperty(navigator, 'deviceMemory', { get: () => config.memory });
    Object.defineProperty(navigator, 'maxTouchPoints', { get: () => config.mobile ? 5 : 0 });
    Object.defineProperty(navigator, 'languages', { get: () => Object.freeze(['ja-JP', 'ja', 'en-US', 'en']) });

    // 4. Chrome 对象 - 必须完整
    window.chrome = {
      app: { isInstalled: false, InstallState: { DISABLED: 'disabled', INSTALLED: 'installed', NOT_INSTALLED: 'not_installed' }, getDetails: function(){}, getIsInstalled: function(){}, installState: function(){ return 'not_installed'; }, runningState: function(){ return 'cannot_run'; } },
      runtime: { OnInstalledReason: { CHROME_UPDATE: 'chrome_update', INSTALL: 'install', SHARED_MODULE_UPDATE: 'shared_module_update', UPDATE: 'update' }, OnRestartRequiredReason: { APP_UPDATE: 'app_update', OS_UPDATE: 'os_update', PERIODIC: 'periodic' }, PlatformArch: { ARM: 'arm', ARM64: 'arm64', MIPS: 'mips', MIPS64: 'mips64', X86_32: 'x86-32', X86_64: 'x86-64' }, PlatformNaclArch: { ARM: 'arm', MIPS: 'mips', MIPS64: 'mips64', X86_32: 'x86-32', X86_64: 'x86-64' }, PlatformOs: { ANDROID: 'android', CROS: 'cros', LINUX: 'linux', MAC: 'mac', OPENBSD: 'openbsd', WIN: 'win' }, RequestUpdateCheckStatus: { NO_UPDATE: 'no_update', THROTTLED: 'throttled', UPDATE_AVAILABLE: 'update_available' }, connect: function(){}, sendMessage: function(){}, id: undefined },
      csi: function(){ return {}; },
      loadTimes: function(){ return {}; },
    };

    // 5. Plugins - 使用iframe技巧绕过
    // 在新的 iframe 中获取真实 PluginArray 结构
    const makePlugin = (name, desc, fn) => {
      const p = { name, description: desc, filename: fn, length: 0 };
      p[Symbol.iterator] = function*(){};
      return p;
    };
    const fakePlugins = {
      0: makePlugin('Chrome PDF Plugin', 'Portable Document Format', 'internal-pdf-viewer'),
      1: makePlugin('Chrome PDF Viewer', '', 'mhjfbmdgcfjbbpaeojofohoefgiehjai'),
      2: makePlugin('Native Client', '', 'internal-nacl-plugin'),
      length: 3,
      item: function(i) { return this[i] || null; },
      namedItem: function(n) { for(let i=0;i<this.length;i++) if(this[i].name===n) return this[i]; return null; },
      refresh: function(){},
      [Symbol.iterator]: function*() { for(let i=0;i<this.length;i++) yield this[i]; },
    };
    Object.defineProperty(navigator, 'plugins', { get: () => fakePlugins });
    Object.defineProperty(navigator, 'mimeTypes', { get: () => ({ length: 4 }) });

    // 6. WebGL渲染器 - 隐藏 SwiftShader (无头浏览器的最大暴露点!)
    const getParam = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function(p) {
      if (p === 37445) return 'Google Inc. (NVIDIA)';
      if (p === 37446) return 'ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)';
      return getParam.call(this, p);
    };
    const getParam2 = WebGL2RenderingContext.prototype.getParameter;
    WebGL2RenderingContext.prototype.getParameter = function(p) {
      if (p === 37445) return 'Google Inc. (NVIDIA)';
      if (p === 37446) return 'ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)';
      return getParam2.call(this, p);
    };

    // 7. Permissions
    const origQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (params) => {
      if (params.name === 'notifications') return Promise.resolve({ state: 'default', onchange: null });
      return origQuery.call(navigator.permissions, params);
    };

    // 8. iframe contentWindow.chrome 检测
    const origCreate = document.createElement.bind(document);
    document.createElement = function(tag) {
      const el = origCreate(tag);
      if (tag === 'iframe') {
        const origGet = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentWindow').get;
        Object.defineProperty(el, 'contentWindow', {
          get: function() {
            const w = origGet.call(this);
            if (w) {
              try { w.chrome = window.chrome; } catch(e) {}
            }
            return w;
          }
        });
      }
      return el;
    };

    // 9. Function.toString 保护
    const nativeToString = Function.prototype.toString;
    const overrides = new Map();
    const fakeToString = function() {
      if (overrides.has(this)) return overrides.get(this);
      return nativeToString.call(this);
    };
    overrides.set(fakeToString, 'function toString() { [native code] }');
    Function.prototype.toString = fakeToString;

  }, { platform: d.platform, cores: d.cores, memory: d.memory, mobile: d.mobile });

  const url = `https://note.com/funeshiru/n/${noteKey}`;

  await page.goto(url, {
    waitUntil: 'networkidle',
    timeout: 30000,
    referer: ref,
  });

  await page.waitForTimeout(3000 + Math.random() * 2000);

  // 确保 read_history 被调用
  try {
    await page.evaluate(async (id) => {
      await fetch('/api/v2/stats/read_history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id, referrer: document.referrer || '' }),
        credentials: 'include',
      });
    }, parseInt(noteId));
  } catch (e) {}

  // 模拟阅读
  const steps = 3 + Math.floor(Math.random() * 4);
  for (let i = 0; i < steps; i++) {
    await page.evaluate((px) => window.scrollBy({ top: px, behavior: 'smooth' }), 100 + Math.random() * 400);
    await page.waitForTimeout(800 + Math.random() * 1500);
  }

  await page.waitForTimeout(2000);
  await browser.close();
  console.log(`${noteKey}: OK (Device ${idx + 1}, ref: ${ref || 'direct'})`);
})().catch(e => console.log('Error:', e.message));
