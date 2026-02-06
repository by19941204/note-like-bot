const { chromium } = require('playwright');

// 16种真实设备配置 (完整UA + 正确的platform + 屏幕)
const devices = [
  { ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.112 Safari/537.36", w: 1920, h: 1080, platform: "Win32", mobile: false, memory: 8, cores: 8 },
  { ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.112 Safari/537.36", w: 1440, h: 900, platform: "MacIntel", mobile: false, memory: 16, cores: 10 },
  { ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1", w: 390, h: 844, platform: "iPhone", mobile: true, memory: 4, cores: 6 },
  { ua: "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.119 Mobile Safari/537.36", w: 412, h: 915, platform: "Linux armv81", mobile: true, memory: 8, cores: 8 },
  { ua: "Mozilla/5.0 (iPad; CPU OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1", w: 1024, h: 1366, platform: "iPad", mobile: false, memory: 8, cores: 6 },
  { ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0", w: 1366, h: 768, platform: "Win32", mobile: false, memory: 8, cores: 4 },
  { ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15", w: 1680, h: 1050, platform: "MacIntel", mobile: false, memory: 16, cores: 8 },
  { ua: "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.119 Mobile Safari/537.36", w: 360, h: 780, platform: "Linux armv81", mobile: true, memory: 8, cores: 8 },
  { ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.112 Safari/537.36 Edg/122.0.2365.92", w: 1536, h: 864, platform: "Win32", mobile: false, memory: 16, cores: 12 },
  { ua: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.112 Safari/537.36", w: 1920, h: 1080, platform: "Linux x86_64", mobile: false, memory: 8, cores: 4 },
  { ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_7_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1", w: 375, h: 812, platform: "iPhone", mobile: true, memory: 4, cores: 6 },
  { ua: "Mozilla/5.0 (Linux; Android 13; SM-A546B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.178 Mobile Safari/537.36", w: 384, h: 854, platform: "Linux armv81", mobile: true, memory: 6, cores: 8 },
  { ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.185 Safari/537.36", w: 2560, h: 1440, platform: "Win32", mobile: false, memory: 32, cores: 16 },
  { ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.185 Safari/537.36", w: 1280, h: 800, platform: "MacIntel", mobile: false, memory: 8, cores: 8 },
  { ua: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.119 Mobile Safari/537.36", w: 393, h: 851, platform: "Linux armv81", mobile: true, memory: 8, cores: 8 },
  { ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0", w: 1600, h: 900, platform: "Win32", mobile: false, memory: 16, cores: 8 },
];

const referrers = [
  'https://www.google.co.jp/',
  'https://www.google.com/',
  'https://note.com/',
  'https://note.com/funeshiru',
  'https://t.co/abc',
  'https://search.yahoo.co.jp/',
  '',  // 直接アクセス
];

(async () => {
  const idx = parseInt(process.env.DEVICE_IDX) % devices.length;
  const noteKey = process.env.NOTE_KEY;
  const noteId = process.env.NOTE_ID;
  const d = devices[idx];
  const ref = referrers[Math.floor(Math.random() * referrers.length)];

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox',
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
    extraHTTPHeaders: {
      'Accept-Language': 'ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7',
    },
  });

  const page = await context.newPage();

  // 完整的反检测注入
  await page.addInitScript((config) => {
    // 隐藏 webdriver
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    
    // 正确的 platform
    Object.defineProperty(navigator, 'platform', { get: () => config.platform });
    
    // 正确的 hardwareConcurrency
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => config.cores });
    
    // 正确的 deviceMemory
    Object.defineProperty(navigator, 'deviceMemory', { get: () => config.memory });
    
    // languages
    Object.defineProperty(navigator, 'languages', { get: () => ['ja-JP', 'ja', 'en-US', 'en'] });
    
    // Chrome特有属性
    window.chrome = {
      runtime: {},
      loadTimes: function() {},
      csi: function() {},
      app: {}
    };
    
    // 真实的plugins (非空)
    Object.defineProperty(navigator, 'plugins', {
      get: () => {
        const plugins = [
          { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer' },
          { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai' },
          { name: 'Native Client', filename: 'internal-nacl-plugin' },
        ];
        plugins.length = 3;
        return plugins;
      }
    });

    // WebGL vendor
    const getParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function(parameter) {
      if (parameter === 37445) return 'Google Inc. (NVIDIA)';
      if (parameter === 37446) return 'ANGLE (NVIDIA, NVIDIA GeForce GTX 1050 Ti Direct3D11 vs_5_0 ps_5_0)';
      return getParameter.call(this, parameter);
    };

    // Permissions
    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters) => (
      parameters.name === 'notifications' ?
        Promise.resolve({ state: Notification.permission }) :
        originalQuery(parameters)
    );

  }, { platform: d.platform, cores: d.cores, memory: d.memory });

  const url = `https://note.com/funeshiru/n/${noteKey}`;
  
  // 加载页面
  await page.goto(url, {
    waitUntil: 'networkidle',
    timeout: 30000,
    referer: ref,
  });

  // 等待页面JS完全执行 (追踪脚本需要时间)
  await page.waitForTimeout(3000 + Math.random() * 2000);

  // 确保 read_history API 被调用
  // 如果没有自动调用，手动触发
  try {
    await page.evaluate(async (id) => {
      // 检查是否已有read_history请求
      await fetch('/api/v2/stats/read_history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id, referrer: document.referrer || '' }),
        credentials: 'include',
      });
    }, parseInt(noteId));
  } catch (e) {
    // 忽略错误
  }

  // 模拟真实阅读 - 慢慢滚动
  const scrollSteps = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < scrollSteps; i++) {
    await page.evaluate((px) => {
      window.scrollBy({ top: px, behavior: 'smooth' });
    }, 150 + Math.random() * 350);
    await page.waitForTimeout(1000 + Math.random() * 2000);
  }

  // 最后等待确保所有beacon发出
  await page.waitForTimeout(2000);

  await browser.close();
  console.log(`${noteKey}: OK (Device ${idx + 1}, ref: ${ref || 'direct'})`);
})().catch(e => console.log('Error:', e.message));
