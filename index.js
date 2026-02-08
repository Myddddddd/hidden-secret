(() => {
  const SECRET_REGEX = /<secret>[\s\S]*?<\/secret>/gi;
  const PLACEHOLDER = '*[HIDDEN]*';

  // Lưu text gốc theo message id
  const originalMessages = new Map();

  function mask(text) {
    return text.replace(SECRET_REGEX, PLACEHOLDER);
  }

  function hookEditModal() {
    const modal = document.querySelector('.edit-message-modal');
    if (!modal) return;

    const textarea = modal.querySelector('textarea');
    const saveBtn = modal.querySelector('button.save');

    if (!textarea || textarea.dataset.secretHooked) return;

    const messageId = modal.dataset.messageId || Date.now();

    // Backup text gốc
    originalMessages.set(messageId, textarea.value);

    // Mask cho UI
    textarea.value = mask(textarea.value);
    textarea.dataset.secretHooked = 'true';

    // Khi bấm Save → restore nội dung gốc
    if (saveBtn) {
      saveBtn.addEventListener(
        'click',
        () => {
          const original = originalMessages.get(messageId);
          if (original) {
            textarea.value = original;
            originalMessages.delete(messageId);
          }
        },
        { once: true }
      );
    }
  }

  function hookRenderedMessages() {
    document.querySelectorAll('.mes_text').forEach(el => {
      if (el.dataset.secretMasked) return;
      el.innerHTML = mask(el.innerHTML);
      el.dataset.secretMasked = 'true';
    });
  }

  // Quan sát DOM
  const observer = new MutationObserver(() => {
    hookRenderedMessages();
    hookEditModal();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log('[HideSecret] Extension loaded');
})();
