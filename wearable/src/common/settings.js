const KEY = 'navigation.display.v1';
const DEFAULTS = { font: 'default', fontSize: 30, arrowSize: 96, arrowWeight: 8 };
const LIMITS = { fontSize: [24, 44], arrowSize: [32, 100], arrowWeight: [4, 10] };
const FONTS = ['default'];
const FONT_OPTIONS = [{ id: 'default', name: '系统默认', family: 'sans-serif' }];
function fontOption() { return FONT_OPTIONS[0]; }
// Use the firmware font; do not unpack multi-megabyte TTFs on Band 9.
function fontForText() { return 'sans-serif'; }

function normalize(value) {
  const input = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const result = { font: DEFAULTS.font, fontSize: DEFAULTS.fontSize,
    arrowSize: DEFAULTS.arrowSize, arrowWeight: DEFAULTS.arrowWeight };
  if (FONTS.indexOf(input.font) >= 0) result.font = input.font;
  for (const name of Object.keys(LIMITS)) {
    const number = input[name];
    if (typeof number === 'number' && isFinite(number)) {
      result[name] = Math.min(LIMITS[name][1], Math.max(LIMITS[name][0], Math.round(number)));
    }
  }
  return result;
}

// Serialize writes: firmware callbacks may arrive late; only the latest value may win.
function createStore(storage, onLoad, onStatus) {
  let alive = true;
  let revision = 0;
  let pending = null;
  let writing = false;
  function status(value) { if (alive) onStatus(value); }
  function flush() {
    if (writing || !pending) return;
    const job = pending;
    pending = null;
    writing = true;
    let completed = false;
    function finish(ok) {
      if (completed) return;
      completed = true;
      writing = false;
      if (revision === job.revision) status(ok ? '已保存' : '保存失败，本次仍有效');
      flush();
    }
    try {
      storage.set({ key: KEY, value: JSON.stringify(job.value),
        success: () => finish(true), fail: () => finish(false) });
    } catch (error) { finish(false); }
  }
  return {
    load() {
      const started = revision;
      try {
        storage.get({ key: KEY, default: '', success: raw => {
          if (!alive || revision !== started) return;
          let value;
          try { value = JSON.parse(raw || '{}'); } catch (error) { value = {}; }
          onLoad(normalize(value));
        }, fail: () => { if (revision === started) status('读取失败，使用当前设置'); } });
      } catch (error) { status('本次调整无法保存'); }
    },
    save(value) {
      if (!alive) return;
      pending = { revision: ++revision, value: normalize(value) };
      status('保存中');
      flush();
    },
    // Already queued writes may finish after closing; callbacks no longer touch UI.
    dispose() { alive = false; }
  };
}

module.exports = { KEY, DEFAULTS, LIMITS, FONTS, FONT_OPTIONS, fontOption, fontForText, normalize, createStore };
