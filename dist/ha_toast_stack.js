// Load globally through frontend.extra_module_url. CSS lives beside this file.
const cssURL = new URL('./ha-toast-stack.css', import.meta.url);
// Updating the configured module version also invalidates the CSS cache.
cssURL.search = new URL(import.meta.url).search;
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

function syncCloseAll(manager) {
  const stack = manager.shadowRoot?.querySelector('.stack');
  if (!stack) return;
  const toasts = [...stack.querySelectorAll('ha-toast')];
  let badge = stack.querySelector('.ha-toast-close-all');
  if (toasts.length < 2) {
    badge?.remove();
    return;
  }
  if (!badge) {
    badge = document.createElement('button');
    badge.type = 'button';
    badge.className = 'ha-toast-close-all';
    badge.addEventListener('click', async () => {
      badge.disabled = true;
      // Snapshot: notifications arriving during dismissal remain visible.
      const current = [...stack.querySelectorAll('ha-toast')];
      try {
        await Promise.allSettled(current.map((toast) => toast.hide('dismiss')));
      } finally {
        badge.disabled = false;
        syncCloseAll(manager);
      }
    });
    stack.prepend(badge);
  }
  badge.textContent = `Close all (${toasts.length})`;
  badge.setAttribute('aria-label', `Close all ${toasts.length} notifications`);
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
    if (allowDismiss) syncCloseAll(this);
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
