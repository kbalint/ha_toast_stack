// Load globally through frontend.extra_module_url. CSS lives beside this file.
const cssURL = new URL('./ha-toast-stack.css', import.meta.url);
const response = await fetch(cssURL);
if (!response.ok) throw new Error(`Toast override CSS: HTTP ${response.status}`);
const css = await response.text();

function addStyle(element) {
  const root = element.shadowRoot;
  if (!root || root.querySelector('style[data-ha-toast-stack]')) return;
  const style = document.createElement('style');
  style.dataset.haToastStack = '';
  style.textContent = css;
  root.append(style);
}

async function patch(tag, allowDismiss = false) {
  await customElements.whenDefined(tag);
  const prototype = customElements.get(tag).prototype;
  const marker = Symbol.for(`ha-toast-stack.${tag}`);
  if (prototype[marker]) return;
  prototype[marker] = true;
  const updated = prototype.updated;
  prototype.updated = function (...args) {
    updated?.apply(this, args);
    addStyle(this);
  };
  if (allowDismiss) {
    const showDialog = prototype.showDialog;
    prototype.showDialog = function (parameters) {
      return showDialog.call(this, { ...parameters, dismissable: true });
    };
  }

  // Also apply to instances already mounted before the module loaded.
  function visit(root) {
    for (const element of root.querySelectorAll('*')) {
      if (element.localName === tag) {
        addStyle(element);
        element.requestUpdate?.();
      }
      if (element.shadowRoot) visit(element.shadowRoot);
    }
  }
  visit(document);
}

void patch('notification-manager', true);
void patch('ha-toast');
