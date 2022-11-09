// @ts-nocheck

/**
 * @typedef {string} KeyboardKey `event.key` 的代号，
 * 见 <https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values>
 */

/**
 * @typedef {() => void} OnKeyDown 使用者按下 ⌘ [KeyboardKey] 时应该执行的行为
 */

/**
 * 以 Meta 键 (⌘) 为首的快捷键清单。
 *
 * 每个写在这里的 shortcuts 都会运行 {@link Event.preventDefault}.
 *
 * @type {Record<KeyboardKey, OnKeyDown>}
 */
const metaKeyShortcuts = {
  ArrowUp: () => scrollTo(0, 0),
  ArrowDown: () => scrollTo(0, document.body.scrollHeight),
  "[": () => window.history.back(),
  "]": () => window.history.forward(),
  r: () => window.location.reload(),
  "-": () => zoomOut(),
  "=": () => zoomIn(),
  0: () => zoomCommon(() => "100%"),
};

window.addEventListener("DOMContentLoaded", (_event) => {
  const style = document.createElement("style");
  style.innerHTML = `
    #iaujwnefhw {
      display: none;
    }
    
    #fkasjgf {
      display: none;
    }

    #sajdhfbjwhe {
      display: none;
    }

    .hthb-row {
      display: none;
    }
  `;
  document.head.append(style);
  const topDom = document.createElement("div");
  topDom.id = "pack-top-dom";
  document.body.appendChild(topDom);

  const domEl = document.getElementById("pack-top-dom");

  domEl.addEventListener("mousedown", (e) => {
    if (e.buttons === 1 && e.detail !== 2) {
      window.ipc.postMessage("drag_window");
    }
  });

  domEl.addEventListener("touchstart", () => {
    window.ipc.postMessage("drag_window");
  });

  domEl.addEventListener("dblclick", () => {
    window.ipc.postMessage("fullscreen");
  });

  document.addEventListener("keyup", function (event) {
    const preventDefault = (f) => {
      event.preventDefault();
      f();
    };

    if (event.metaKey && event.key in metaKeyShortcuts) {
      preventDefault(metaKeyShortcuts[event.key]);
    }
  });

  document.addEventListener("click", (e) => {
    const origin = e.target.closest("a");
    const href = origin.href;
    if (href) {
      origin.target = "_self";
    }
  });
});

setDefaultZoom();

function setDefaultZoom() {
  const htmlZoom = window.localStorage.getItem("htmlZoom");
  if (htmlZoom) {
    document.getElementsByTagName("html")[0].style.zoom = htmlZoom;
  }
}

/**
 * @param {(htmlZoom: string) => string} [zoomRule]
 */
function zoomCommon(zoomRule) {
  const htmlZoom = window.localStorage.getItem("htmlZoom") || "100%";
  const html = document.getElementsByTagName("html")[0];
  const zoom = zoomRule(htmlZoom);
  html.style.zoom = zoom;
  window.localStorage.setItem("htmlZoom", zoom);
}

function zoomIn() {
  zoomCommon((htmlZoom) => `${Math.min(parseInt(htmlZoom) + 10, 200)}%`);
}

function zoomOut() {
  zoomCommon((htmlZoom) => `${Math.max(parseInt(htmlZoom) - 10, 30)}%`);
}
