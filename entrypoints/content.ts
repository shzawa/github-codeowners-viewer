export default defineContentScript({
  matches: ['*://github.com/*/*/pull/*'],
  main() {
    function showCodeowners() {
      const headers = Array.from(document.querySelectorAll('.file-header'));
      headers.forEach(header => {
        // すでに処理済みの場合はスキップ
        if (header.getAttribute('data-codeowners-processed')) {
          return;
        }

        const fileInfoLink = header.querySelector(".file-info > .Link--secondary > span");
        if (fileInfoLink) {
          const ownedByUserDescription = fileInfoLink.getAttribute('aria-label');
          if (ownedByUserDescription) {
            const codeownersElement = document.createElement("div");
            codeownersElement.className = "codeowners-info";
            codeownersElement.textContent = ownedByUserDescription;
            codeownersElement.style.marginLeft = "10px";
            codeownersElement.style.color = "#6e7781";
            codeownersElement.style.fontSize = "12px";
            header.appendChild(codeownersElement);

            // 処理済みとしてマーク
            header.setAttribute('data-codeowners-processed', 'true');
          }
        }
      });
    }

    showCodeowners();

    const observer = new MutationObserver((mutations) => {
      let shouldProcess = false;

      mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (isElement(node)) {
              if (node.querySelector('.file-header') || node.classList?.contains('file-header')) {
                shouldProcess = true;
              }
            }
          });
        }
      });

      if (shouldProcess) {
        showCodeowners();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  },
});

function isElement(node: Node): node is Element {
  return node instanceof Element;
}
