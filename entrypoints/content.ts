export default defineContentScript({
  matches: ['*://github.com/*/*/pull/*'],
  main() {
    console.log('GitHub CODEOWNERS 拡張が有効になりました');

    // 初期表示の diff に CODEOWNERS を表示
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

    // 初回実行
    showCodeowners();

    // DOM変更を監視して新しく追加された diff にも対応
    const observer = new MutationObserver((mutations) => {
      let shouldProcess = false;

      mutations.forEach(mutation => {
        // 新しいノードが追加された場合
        if (mutation.addedNodes.length > 0) {
          // file-header が含まれている可能性があるか確認
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.querySelector('.file-header') || element.classList?.contains('file-header')) {
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

    // ページ全体を監視
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  },
});
