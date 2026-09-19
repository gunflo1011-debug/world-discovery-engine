/* Keyboard parity for Explorer-generated interactive marks. */
(function () {
  function activateOnKeyboard(event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    event.currentTarget.click();
  }

  function enhance(root) {
    root.querySelectorAll('.dot, .rank-row').forEach((el) => {
      if (el.dataset.keyboardReady === 'true') return;
      el.dataset.keyboardReady = 'true';
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      const code = el.dataset.code || 'country';
      const rankName = el.querySelector && el.querySelector('.rank-name');
      el.setAttribute('aria-label', `Toggle ${rankName ? rankName.textContent : code} selection`);
      el.addEventListener('keydown', activateOnKeyboard);
    });
  }

  const roots = ['scatter', 'ranking'].map((id) => document.getElementById(id)).filter(Boolean);
  roots.forEach((root) => {
    enhance(root);
    new MutationObserver(() => enhance(root)).observe(root, { childList: true, subtree: true });
  });
})();
