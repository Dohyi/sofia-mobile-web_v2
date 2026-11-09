/*
화면 흐름: 홈 > AR 준비 > Kivicube 실제 체험 / UI 데모
실제 인식, 3D, 부위 선택은 전부 Kivicube 장면에서 제작
현재 파일은 데모 버전으로 기능을 보여주기만 할 뿐, 인식 성공이라고 표시하지 않음 */

const config = window.SOFIA_CONFIG;
const app = document.querySelector('#app');
const navigation = document.querySelector('#navigation');
const menuButton = document.querySelector('#menu-button');

const modes = {
  exterior: {
    title: '外部结构',
    description: '认识主体、穹顶与钟楼的组合。',
    instruction: '识别后，在AR场景内选择外部结构与构件。'
  },
  interior: {
    title: '内部空间',
    description: '探索穹顶之下的空间与细节。',
    instruction: '识别后，在AR场景内选择内部空间。'
  }
};

const parts = {
  dome: {
    title: '中央穹顶',
    text: '观察穹顶外形、基座，以及它与主体建筑的关系。',
    mode: 'exterior'
  },
  tower: {
    title: '钟楼',
    text: '从整体位置到局部构件，了解钟楼的组成。',
    mode: 'exterior'
  },
  brick: {
    title: '红砖立面',
    text: '近距离观察砖墙材质、门窗与拱形装饰。',
    mode: 'exterior'
  },
  innerDome: {
    title: '穹顶内侧',
    text: '此处预留穹顶内部与采光关系的模型和说明。',
    mode: 'interior'
  },
  mural: {
    title: '壁画与装饰',
    text: '此处预留有资料依据的壁画图片、位置与保护信息。',
    mode: 'interior'
  },
  layout: {
    title: '空间布局',
    text: '此处预留室内平面、通道与主要空间的介绍。',
    mode: 'interior'
  }
};

// HTML에 삽입되는 설정값을 이스케이프함.
function escapeHTML(value = '') {
    return String(value).replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

// 이미지와 영상은 상대 경로 또는 HTTP(S) 주소만 허용.
function assetURL(value) {
    if (!value) return '';

    try {
        const parsed = new URL(value, window.location.href);
        return ['http:', 'https:', 'file:'].includes(parsed.protocol) ? value : '';
    } catch {
        return '';
    }
}

// 기본 삽입은 Kivicube 공식 웹 체험 링크 사용.
function sceneURL(mode) {
    const value = config.kivicube[`${mode}Url`] || config.kivicube.sceneUrl;
    if (!value) return '';

    try {
        const parsed = new URL(value);
        const officialHost = ['www.kivicube.com', 'kivicube.com'].includes(parsed.hostname);
        const scenePath = /^\/(scenes|collections)\/[^/]+\/?$/.test(parsed.pathname);

        return parsed.protocol === 'https:' && officialHost && scenePath
        ? parsed.href
        : '';
    } catch {
        return '';
    }
}

function fallback(label) {
    return `
    <div class="image-fallback" role="img" aria-label="${escapeHTML(label)}">
    <span aria-hidden="true">S</span>
    <strong>${escapeHTML(label)}</strong>
    <small>图片待补充 · 非建筑模型</small>
    </div>
    `;
}

function photo(src, alt, className = '') {
    const safe = assetURL(src);
    return safe
    ? `<img class="${className}" src="${escapeHTML(safe)}" alt="${escapeHTML(alt)}" data-image>`
    : fallback(alt);
}

function bindImageFallbacks() {
    app.querySelectorAll('[data-image').forEach((image) => {
        image.addEventListener('error', () => {
            const holder = document.createElement('div');
            holder.innerHTML = fallback(image.alt);
            image.replaceWith(holder.firstElementChild);
        }, { once: true });
    });
}

function heading(title, subtitle, back = '#home', backText = '返回首页') {
    return `
    <a class="back" href="${back}">← ${backText}</a>
    <div class="eyebrow">SOFIA / EXPLORE</div>
    <h1>${title}</h1>
    <p class="lede">${subtitle}</p>
    `;
}

function demoNote() {
    return '<p class="note">目前为演示版本，图片与详细说明后续将进行修改。</p>';
}

function modeTabs(mode, prefix) {
  return `
    <div class="tabs" aria-label="探索模式">
      <button data-route="${prefix}/exterior" aria-pressed="${mode === 'exterior'}">外部结构</button>
      <button data-route="${prefix}/interior" aria-pressed="${mode === 'interior'}">内部空间</button>
    </div>
  `;
}

function home() {
  app.innerHTML = `
    <div class="eyebrow">HARBIN · ARCHITECTURE GUIDE</div>
    <h1>走近索菲亚<br>读懂建筑的故事</h1>
    <p class="lede">从一块红砖，到穹顶之下。<br>用互动的方式，探索建筑的内外。</p>

    <div class="hero">
      ${photo(config.heroImage, '哈尔滨圣索菲亚教堂', 'hero-photo')}
    </div>
    ${config.imageCredit ? `<p class="credit">${escapeHTML(config.imageCredit)}</p>` : ''}

    <a class="primary" href="#ar/exterior">开始 AR 探索　↗</a>
    <p class="credit">扫描展板上的索菲亚照片，开启建筑探索。</p>

    <div class="section-heading">
      <strong>选择你的探索方式</strong>
      <span>EXPLORE / 01—04</span>
    </div>
    <div class="grid">
      <a class="tile" href="#ar/exterior">
        <b>01</b><strong>外部结构 ↗</strong><small>进入AR · 了解建筑构件</small>
      </a>
      <a class="tile" href="#ar/interior">
        <b>02</b><strong>内部空间 ↗</strong><small>进入AR · 探索内部空间</small>
      </a>
      <a class="tile" href="#history">
        <b>03</b><strong>建筑历史 →</strong><small>无需扫描 · 沿着时间阅读</small>
      </a>
      <a class="tile" href="#compare">
        <b>04</b><strong>历史影像 →</strong><small>无需扫描 · 观看建筑变迁</small>
      </a>
    </div>
  `;
}

function ar(mode) {
  const selected = modes[mode];
  const url = sceneURL(mode);
  const hasRawLink = Boolean(config.kivicube[`${mode}Url`] || config.kivicube.sceneUrl);

  app.innerHTML = heading('AR 建筑探索', '对准展板照片，开启你的探索。') + `
    ${modeTabs(mode, 'ar')}
    <div class="scan-guide">
      ${photo(config.targetImage, '展板识别图预留位置')}
    </div>
    <ol class="steps">
      <li>点击下方按钮，并允许相机访问。</li>
      <li>将实际展板上的指定照片完整放入画面。</li>
      <li>${selected.instruction}</li>
    </ol>
    ${url ? `
      <button class="primary" id="launch-ar">打开相机 · 开始探索</button>
      <a class="secondary" href="${escapeHTML(url)}">单独打开 AR 体验 ↗</a>
      <p class="credit">当前入口：${selected.title}。场景内的功能由Kivicube配置决定。</p>
    ` : `
      <p class="note">${hasRawLink
        ? '体验链接格式不正确，请在config.js中填写Kivicube的HTTPS场景或合辑链接。'
        : 'AR体验尚未接入。你可以先查看下方的界面流程演示。'}</p>
    `}
    <a class="secondary" href="#demo/${mode}">查看界面演示 · 无需相机</a>
    <p class="status" id="ar-status" role="status"></p>
    <div id="ar-host" class="ar-host" hidden></div>
    <button id="stop-ar" class="secondary" hidden>关闭 AR 体验</button>
    <p class="note">请使用HTTPS网页并允许相机权限。图片识别、3D模型及部件交互在Kivicube场景中运行；此网页不会自行识别展板。</p>
  `;

  if (!url) return;

  document.querySelector('#launch-ar').onclick = () => {
    const host = document.querySelector('#ar-host');
    const status = document.querySelector('#ar-status');
    const frame = document.createElement('iframe');

    frame.className = 'ar-frame';
    frame.title = `索菲亚AR · ${selected.title}`;
    frame.allow = 'camera; autoplay; fullscreen; gyroscope; accelerometer; xr-spatial-tracking';
    frame.allowFullscreen = true;
    frame.src = url;
    frame.addEventListener('load', () => {
      status.textContent = '体验页面已载入，识别状态请查看AR画面内提示。';
    });

    host.replaceChildren(frame);
    host.hidden = false;
    document.querySelector('#stop-ar').hidden = false;
    document.querySelector('#launch-ar').disabled = true;
    status.textContent = '正在打开AR体验。如无法启动，请使用“单独打开 AR 体验”。';
    host.scrollIntoView({ block: 'start' });
  };

  document.querySelector('#stop-ar').onclick = () => {
    document.querySelector('#ar-host').replaceChildren();
    document.querySelector('#ar-host').hidden = true;
    document.querySelector('#stop-ar').hidden = true;
    document.querySelector('#launch-ar').disabled = false;
    document.querySelector('#ar-status').textContent = 'AR体验已关闭。';
  };
}

function demo(mode) {
  const selected = modes[mode];
  const keys = Object.keys(parts).filter((key) => parts[key].mode === mode);

  app.innerHTML = heading(
    selected.title,
    selected.description,
    `#ar/${mode}`,
    '返回AR入口'
  ) + `
    <span class="demo-tag">UI流程演示 · 非真实AR / 3D</span>
    ${modeTabs(mode, 'demo')}
    <div class="demo-stage">
      ${fallback(
        mode === 'exterior'
        ? '建筑外部3D模型待接入'
        : '建筑内部3D模型待接入'
      )}
    </div>
    <div class="card">
      <h2>${mode === 'exterior' ? '圣索菲亚教堂' : '走进建筑内部'}</h2>
      <p>选择下方的部件，预览“整体 → 单个部件 → 详细介绍”的界面流程。</p>
    </div>
    <div class="hotspots" aria-label="选择部件">
      ${keys.map((key) => `
        <button data-route="part/${key}">${parts[key].title} ↗</button>
      `).join('')}
    </div>
    ${demoNote()}
    <a class="secondary" href="#ar/${mode}">前往真实AR体验入口 →</a>
  `;
}

function part(key) {
  const data = parts[key];

  app.innerHTML = heading(
    data.title,
    '从整体到细节，认识建筑的组成。',
    `#demo/${data.mode}`,
    '返回整体'
  ) + `
    <span class="demo-tag">部件详情界面演示</span>
    <div class="demo-stage detail-photo ${key}">
      ${data.mode === 'exterior'
        ? photo(config.heroImage, '图片裁切占位，非独立部件3D模型')
        : fallback(`${data.title}模型预留位置`)}
    </div>
    <p class="credit">模型预留位置：目前仅为图片占位，实际独立模型将在Kivicube中制作。</p>
    <div class="card">
      <h2>${data.title}</h2>
      <p>${data.text}</p>
      <p class="credit">部件说明与资料来源待补充。</p>
    </div>
    ${demoNote()}
    <a class="secondary" href="#demo/${data.mode}">← 返回整体模型界面</a>
  `;
}

function history() {
  app.innerHTML = heading('建筑历史', '沿着时间，了解建筑的变化。') + `
    <div class="years" aria-label="选择历史年份">
      ${config.history.map((item, index) => `
        <button data-year-index="${index}" aria-pressed="false">${escapeHTML(item.year)}</button>
      `).join('')}
    </div>
    <section id="history-content" aria-live="polite"></section>
    ${!config.historyVerified ? '<p class="credit">年表为展示草稿，正式发布前需核验年份、史料与来源。</p>' : ''}
    ${demoNote()}
    <a class="secondary" href="#compare">观看历史影像 →</a>
  `;

  const select = (index) => {
    const item = config.history[index];
    document.querySelector('#history-content').innerHTML = `
      <div class="history-photo">${photo(item.image, `${item.year}年历史资料图片待补充`)}</div>
      <div class="card">
        <div class="year-number">${escapeHTML(item.year)}</div>
        <h2>${escapeHTML(item.title)}</h2>
        <p>${escapeHTML(item.text)}</p>
        ${item.source ? `<p class="credit">资料来源：${escapeHTML(item.source)}</p>` : ''}
      </div>
    `;

    app.querySelectorAll('[data-year-index]').forEach((button) => {
      button.setAttribute('aria-pressed', Number(button.dataset.yearIndex) === index);
    });
    bindImageFallbacks();
  };

  app.querySelectorAll('[data-year-index]').forEach((button) => {
    button.onclick = () => select(Number(button.dataset.yearIndex));
  });
  if (config.history.length) select(0);
}

function compare() {
  app.innerHTML = heading('历史影像', '用影像观看建筑变迁，无需开启相机。') + `
    <div class="tabs" aria-label="影像展示方式">
      <button id="video-tab" aria-pressed="true">变迁动画</button>
      <button id="photo-tab" aria-pressed="false">照片对比</button>
    </div>
    <section id="media-content"></section>
  `;

  const select = (type) => {
    document.querySelector('#video-tab').setAttribute('aria-pressed', type === 'video');
    document.querySelector('#photo-tab').setAttribute('aria-pressed', type === 'photo');
    const content = document.querySelector('#media-content');
    const media = config.media;

    if (type === 'video') {
      const url = assetURL(media.historyVideo);
      content.innerHTML = url ? `
        <video controls playsinline preload="metadata" ${assetURL(media.videoPoster) ? `poster="${escapeHTML(media.videoPoster)}"` : ''}>
          <source src="${escapeHTML(url)}" type="video/mp4">
          当前浏览器不支持视频播放。
        </video>
        <p class="status" id="video-status" role="status"></p>
        <div class="card"><h2>建筑变迁</h2><p>观看团队制作的建筑历史动画。</p></div>
      ` : `
        ${fallback('历史动画预留位置')}
        <div class="card"><h2>建筑变迁动画</h2><p>这里将播放早期建筑、重建、修复与现状的短片。动画文件尚未接入。</p></div>
      `;
      const video = content.querySelector('video');
      if (video) {
        video.addEventListener('error', () => {
          document.querySelector('#video-status').textContent = '视频无法播放，请检查文件路径与格式。';
        });
      }
      return;
    }

    const past = assetURL(media.pastImage);
    const present = assetURL(media.presentImage);
    if (!past || !present) {
      content.innerHTML = `
        ${fallback('历史与现状照片待补充')}
      `;

      return;
    }

    content.innerHTML = `
      <div class="compare-box" id="comparison">
        <img src="${escapeHTML(present)}" alt="${escapeHTML(media.presentLabel)}">
        <img class="past" src="${escapeHTML(past)}" alt="${escapeHTML(media.pastLabel)}">
        <div class="compare-line"></div>
      </div>
      <div class="compare-labels"><span>${escapeHTML(media.pastLabel)}</span><span>${escapeHTML(media.presentLabel)}</span></div>
      <label for="compare-range">拖动查看历史与现状</label>
      <input id="compare-range" type="range" min="0" max="100" value="50">
      <p class="status" id="comparison-status" role="status"></p>
    `;
    content.querySelectorAll('img').forEach((image) => {
      image.addEventListener('error', () => {
        document.querySelector('#comparison-status').textContent = '照片无法载入，请检查config.js中的路径与文件名。';
      });
    });
    document.querySelector('#compare-range').oninput = (event) => {
      document.querySelector('#comparison').style.setProperty('--split', `${event.target.value}%`);
    };
  };

  document.querySelector('#video-tab').onclick = () => select('video');
  document.querySelector('#photo-tab').onclick = () => select('photo');
  select('video');
}

function render() {
  // 이동 시 iframe과 비디오를 먼저 제거하여 카메라/미디어가 계속 실행되지 않게 합니다.
  app.querySelectorAll('video').forEach((video) => video.pause());
  app.replaceChildren();
  navigation.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');

  const [page, parameter] = location.hash.slice(1).split('/');
  const mode = modes[parameter] ? parameter : 'exterior';

  if (page === 'ar') ar(mode);
  else if (page === 'demo') demo(mode);
  else if (page === 'part' && parts[parameter]) part(parameter);
  else if (page === 'history') history();
  else if (page === 'compare') compare();
  else home();

  app.querySelectorAll('[data-route]').forEach((button) => {
    button.onclick = () => { location.hash = button.dataset.route; };
  });
  bindImageFallbacks();
  window.scrollTo(0, 0);
  app.tabIndex = -1;
  app.focus({ preventScroll: true });
}

menuButton.onclick = () => {
  navigation.hidden = !navigation.hidden;
  menuButton.setAttribute('aria-expanded', String(!navigation.hidden));
};

window.addEventListener('hashchange', render);
window.addEventListener('pagehide', () => {
  app.querySelectorAll('iframe').forEach((frame) => frame.remove());
  app.querySelectorAll('video').forEach((video) => video.pause());
});
window.addEventListener('pageshow', (event) => {
  if (event.persisted) render();
});
render();