/**
 * Click-to-load for third-party embeds.
 *
 * A plain <iframe> from TikTok/YouTube sets third-party cookies and runs
 * tracking scripts as soon as the page loads. The site otherwise sets no
 * cookies, so embeds are replaced with a button that only inserts the iframe
 * once the visitor asks for it.
 *
 * Usage: <button data-embed-src="https://..." data-embed-title="...">
 */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('button[data-embed-src]').forEach((button) => {
    button.addEventListener('click', () => {
      const frame = document.createElement('iframe');
      frame.src = button.dataset.embedSrc;
      frame.title = button.dataset.embedTitle || 'Embedded video';
      frame.className = button.dataset.embedClass || 'block h-full w-full rounded-xl';
      frame.loading = 'lazy';
      frame.allow = 'encrypted-media; fullscreen; picture-in-picture; web-share';
      frame.allowFullscreen = true;
      button.replaceWith(frame);
    });
  });
});
