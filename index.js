(function () {
  const SECRET_REGEX = /<secret>[\s\S]*?<\/secret>/gi;
  const PLACEHOLDER = '<secret>[HIDDEN]</secret>';

  function maskNode(node) {
    if (!node || node.dataset?.secretMasked) return;
    node.innerHTML = node.innerHTML.replace(SECRET_REGEX, PLACEHOLDER);
    node.dataset.secretMasked = 'true';
  }

  // 1️⃣ Mask khi message render
  function hookMessages() {
    document.querySelectorAll('.mes_text').forEach(maskNode);
  }

  // 2️⃣ Mask khi mở Edit (KHÔNG restore — vì Edit chỉ là UI)
  function hookEdit() {
    const textarea = document.querySelector('.edit_textarea');
    if (!textarea || textarea.dataset.secretMasked) return;

    textarea.value = textarea.value.replace(SECRET_REGEX, PLACEHOLDER);
    textarea.dataset.secretMasked = 'true';
  }

  // 3️⃣ Observer NHẸ
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;

        if (node.classList?.contains('mes_text')) {
          maskNode(node);
        }

        if (node.classList?.contains('edit_textarea')) {
          hookEdit();
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log('[HideSecret] loaded');
})();
