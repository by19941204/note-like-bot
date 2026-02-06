const { chromium } = require('playwright');

const devices = [
  { ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.112 Safari/537.36", w: 1920, h: 1080, platform: "Win32", mobile: false, memory: 8, cores: 8, secCh: '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"' },
  { ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.112 Safari/537.36", w: 1440, h: 900, platform: "MacIntel", mobile: false, memory: 16, cores: 10, secCh: '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"' },
  { ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1", w: 390, h: 844, platform: "iPhone", mobile: true, memory: 4, cores: 6, secCh: null },
  { ua: "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.119 Mobile Safari/537.36", w: 412, h: 915, platform: "Linux armv81", mobile: true, memory: 8, cores: 8, secCh: '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"' },
  { ua: "Mozilla/5.0 (iPad; CPU OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1", w: 1024, h: 1366, platform: "iPad", mobile: false, memory: 8, cores: 6, secCh: null },
  { ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0", w: 1366, h: 768, platform: "Win32", mobile: false, memory: 8, cores: 4, secCh: null },
  { ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15", w: 1680, h: 1050, platform: "MacIntel", mobile: false, memory: 16, cores: 8, secCh: null },
  { ua: "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.119 Mobile Safari/537.36", w: 360, h: 780, platform: "Linux armv81", mobile: true, memory: 8, cores: 8, secCh: '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"' },
  { ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.112 Safari/537.36 Edg/122.0.2365.92", w: 1536, h: 864, platform: "Win32", mobile: false, memory: 16, cores: 12, secCh: '"Chromium";v="122", "Not(A:Brand";v="24", "Microsoft Edge";v="122"' },
  { ua: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.112 Safari/537.36", w: 1920, h: 1080, platform: "Linux x86_64", mobile: false, memory: 8, cores: 4, secCh: '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"' },
  { ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_7_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1", w: 375, h: 812, platform: "iPhone", mobile: true, memory: 4, cores: 6, secCh: null },
  { ua: "Mozilla/5.0 (Linux; Android 13; SM-A546B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.178 Mobile Safari/537.36", w: 384, h: 854, platform: "Linux armv81", mobile: true, memory: 6, cores: 8, secCh: '"Chromium";v="121", "Not)A;Brand";v="99", "Google Chrome";v="121"' },
  { ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.185 Safari/537.36", w: 2560, h: 1440, platform: "Win32", mobile: false, memory: 32, cores: 16, secCh: '"Chromium";v="121", "Not)A;Brand";v="99", "Google Chrome";v="121"' },
  { ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.185 Safari/537.36", w: 1280, h: 800, platform: "MacIntel", mobile: false, memory: 8, cores: 8, secCh: '"Chromium";v="121", "Not)A;Brand";v="99", "Google Chrome";v="121"' },
  { ua: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.119 Mobile Safari/537.36", w: 393, h: 851, platform: "Linux armv81", mobile: true, memory: 8, cores: 8, secCh: '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"' },
  { ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0", w: 1600, h: 900, platform: "Win32", mobile: false, memory: 16, cores: 8, secCh: null },
];

const referrers = [
  'https://www.google.co.jp/',
  'https://www.google.com/',
  'https://note.com/',
  'https://note.com/funeshiru',
  'https://t.co/abc',
  'https://search.yahoo.co.jp/',
  '',
];

(async () => {
  const idx = parseInt(process.env.DEVICE_IDX) % devices.length;
  const noteKey = process.env.NOTE_KEY;
  const noteId = process.env.NOTE_ID;
  const d = devices[idx];
  const ref = referrers[Math.floor(Math.random() * referrers.length)];

  // ===== 修复1: sec-ch-ua header (之前漏掉,HeadlessChrome会泄露) =====
  const headers = {
    'Accept-Language': 'ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'max-age=0',
    'Upgrade-Insecure-Requests': '1',
  };
  // Chrome系浏览器需要设置正确的sec-ch-ua，否则会暴露HeadlessChrome
  if (d.secCh) {
    headers['sec-ch-ua'] = d.secCh;
    headers['sec-ch-ua-mobile'] = d.mobile ? '?1' : '?0';
    headers['sec-ch-ua-platform'] = d.platform.includes('Win') ? '"Windows"' :
      d.platform.includes('Mac') ? '"macOS"' :
      d.platform.includes('Linux') && d.mobile ? '"Android"' : '"Linux"';
  }

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
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

  await page.addInitScript((config) => {
    // ===== 修复2: 删除Playwright注入的全局变量 =====
    // 这些变量是Playwright被检测到的最大原因
    delete window.__playwright;
    delete window.__pw_manual;
    delete window.__PW_inspect;

    // webdriver 必须是 false 而不是 undefined
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
      configurable: true,
    });

    // platform
    Object.defineProperty(navigator, 'platform', { get: () => config.platform });
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => config.cores });
    Object.defineProperty(navigator, 'deviceMemory', { get: () => config.memory });
    Object.defineProperty(navigator, 'languages', {
      get: () => Object.freeze(['ja-JP', 'ja', 'en-US', 'en']),
    });
    Object.defineProperty(navigator, 'maxTouchPoints', {
      get: () => config.mobile ? 5 : 0,
    });

    // Chrome对象
    if (!window.chrome) {
      window.chrome = { runtime: {}, loadTimes: ()=>{}, csi: ()=>{}, app: { isInstalled: false } };
    }

    // ===== 修复3: plugins需要正确的迭代器 =====
    const pluginData = [
      { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
      { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai', description: '' },
      { name: 'Native Client', filename: 'internal-nacl-plugin', description: '' },
    ];
    const pluginArray = Object.create(PluginArray.prototype);
    pluginData.forEach((p, i) => {
      const plugin = Object.create(Plugin.prototype);
      Object.defineProperties(plugin, {
        name: { value: p.name }, filename: { value: p.filename },
        description: { value: p.description }, length: { value: 0 },
      });
      Object.defineProperty(pluginArray, i, { value: plugin });
    });
    Object.defineProperty(pluginArray, 'length', { value: 3 });
    Object.defineProperty(navigator, 'plugins', { get: () => pluginArray });

    // WebGL
    const getParam = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function(p) {
      if (p === 37445) return 'Google Inc. (NVIDIA)';
      if (p === 37446) return 'ANGLE (NVIDIA, NVIDIA GeForce GTX 1050 Ti Direct3D11 vs_5_0 ps_5_0)';
      return getParam.call(this, p);
    };

    // Permissions
    const origQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (params) =>
      params.name === 'notifications'
        ? Promise.resolve({ state: Notification.permission })
        : origQuery(params);

    // ===== 额外: 隐藏自动化痕迹 =====
    // 覆盖 toString 以防检测被覆写的函数
    const originalToString = Function.prototype.toString;
    Function.prototype.toString = function() {
      if (this === Function.prototype.toString) return 'function toString() { [native code] }';
      if (this === navigator.permissions.query) return 'function query() { [native code] }';
      return originalToString.call(this);
    };

  }, { platform: d.platform, cores: d.cores, memory: d.memory, mobile: d.mobile });

  const url = `https://note.com/funeshiru/n/${noteKey}`;

  // 访问页面
  await page.goto(url, {
    waitUntil: 'networkidle',
    timeout: 30000,
    referer: ref,
  });

  // 等待追踪JS执行
  await page.waitForTimeout(3000 + Math.random() * 2000);

  // 手动触发 read_history (确保阅读被计入)
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

  // 模拟真实阅读行为
  const steps = 3 + Math.floor(Math.random() * 4);
  for (let i = 0; i < steps; i++) {
    await page.evaluate((px) => {
      window.scrollBy({ top: px, behavior: 'smooth' });
    }, 100 + Math.random() * 400);
    await page.waitForTimeout(800 + Math.random() * 1500);
  }

  // 等待所有beacon发出
  await page.waitForTimeout(2000);

  await browser.close();
  console.log(`${noteKey}: OK (Device ${idx + 1}, ref: ${ref || 'direct'})`);
})().catch(e => console.log('Error:', e.message));
