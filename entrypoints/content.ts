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

    function addBranchCopyUI() {
      // filesページでない場合は何もしない
      if (!window.location.pathname.includes('/files')) {
        return;
      }

      // すでに追加済みの場合はスキップ
      if (document.querySelector('.branch-copy-ui')) {
        return;
      }

      // ブランチ名をURLから取得
      const branchInfo = getBranchInfo();
      if (!branchInfo) {
        return;
      }

      // PR情報のヘッダー部分を探す
      const prHeader = document.querySelector('.gh-header-meta, .merge-pr-more-info, .pr-toolbar');
      if (!prHeader) {
        // フォールバック: ページ上部のコンテナを探す
        const fallbackContainer = document.querySelector('.container-xl.px-3.px-md-4.px-lg-5');
        if (fallbackContainer) {
          insertBranchCopyUI(fallbackContainer, branchInfo, true);
        }
        return;
      }

      insertBranchCopyUI(prHeader, branchInfo, false);
    }

    function getBranchInfo() {
      // URLパターン: /owner/repo/pull/number/files
      // ページ内からブランチ情報を取得する複数の方法を試す
      
      // 方法1: ページ内のspan要素からブランチ名を取得（最も確実）
      const branchSpans = document.querySelectorAll('span.commit-ref');
      if (branchSpans.length >= 2) {
        return {
          from: branchSpans[0]?.textContent?.trim() || 'unknown',
          to: branchSpans[1]?.textContent?.trim() || 'main'
        };
      }

      // 方法2: メタ情報からブランチ名を取得
      const headRefElement = document.querySelector('[data-hovercard-type="pull_request"] .head-ref');
      const baseRefElement = document.querySelector('[data-hovercard-type="pull_request"] .base-ref');
      if (headRefElement && baseRefElement) {
        return {
          from: headRefElement.textContent?.trim() || 'unknown',
          to: baseRefElement.textContent?.trim() || 'main'
        };
      }

      // 方法3: GitHubのPRページの一般的なパターンを使用
      const prBranchInfo = document.querySelector('.gh-header-meta');
      if (prBranchInfo) {
        // テキストコンテンツからブランチ名を抽出
        const text = prBranchInfo.textContent || '';
        const branchMatch = text.match(/(\w+[\w\-\/]*)\s+into\s+(\w+[\w\-\/]*)/);
        if (branchMatch) {
          return {
            from: branchMatch[1],
            to: branchMatch[2]
          };
        }
      }

      // 方法4: URLやページコンテキストから推測
      const pathParts = window.location.pathname.split('/');
      if (pathParts.length >= 5 && pathParts[3] === 'pull') {
        // PRページなので、最低限の情報は提供
        return {
          from: 'HEAD',  // ソースブランチの一般的な参照
          to: 'base'     // ターゲットブランチの一般的な参照
        };
      }

      return null;
    }

    function insertBranchCopyUI(container: Element, branchInfo: {from: string, to: string}, isTopLevel: boolean) {
      const branchUI = document.createElement('div');
      branchUI.className = 'branch-copy-ui';
      branchUI.style.cssText = `
        margin: ${isTopLevel ? '16px 0' : '8px 0'};
        padding: 12px;
        background: #f6f8fa;
        border: 1px solid #d0d7de;
        border-radius: 6px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
      `;

      const branchText = document.createElement('span');
      branchText.textContent = `${branchInfo.from} → ${branchInfo.to}`;
      branchText.style.cssText = `
        font-family: ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
        color: #24292f;
      `;

      const copyFromButton = createCopyButton(branchInfo.from, 'Copy source branch');
      const copyToButton = createCopyButton(branchInfo.to, 'Copy target branch');

      branchUI.appendChild(branchText);
      branchUI.appendChild(copyFromButton);
      branchUI.appendChild(copyToButton);

      if (isTopLevel) {
        container.insertBefore(branchUI, container.firstChild);
      } else {
        container.appendChild(branchUI);
      }
    }

    function createCopyButton(text: string, title: string): HTMLButtonElement {
      const button = document.createElement('button');
      button.className = 'btn btn-sm';
      button.type = 'button';
      button.title = title;
      button.style.cssText = `
        padding: 4px 8px;
        font-size: 12px;
        line-height: 16px;
        border: 1px solid #d0d7de;
        border-radius: 4px;
        background: #ffffff;
        color: #24292f;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      `;

      // アイコンSVG（GitHubのコピーアイコン）
      button.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
          <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>
          <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
        </svg>
        ${text}
      `;

      button.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(text);
          const originalText = button.innerHTML;
          button.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
            </svg>
            Copied!
          `;
          setTimeout(() => {
            button.innerHTML = originalText;
          }, 2000);
        } catch (err) {
          console.error('Failed to copy text: ', err);
        }
      });

      button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = '#f3f4f6';
      });

      button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = '#ffffff';
      });

      return button;
    }

    showCodeowners();
    addBranchCopyUI();

    const observer = new MutationObserver((mutations) => {
      let shouldProcessCodeowners = false;
      let shouldProcessBranchUI = false;

      mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (isElement(node)) {
              if (node.querySelector('.file-header') || node.classList?.contains('file-header')) {
                shouldProcessCodeowners = true;
              }
              // ページ構造の変更を検知してブランチUIも再処理
              if (node.querySelector('.gh-header-meta, .merge-pr-more-info, .pr-toolbar, .container-xl')) {
                shouldProcessBranchUI = true;
              }
            }
          });
        }
      });

      if (shouldProcessCodeowners) {
        showCodeowners();
      }
      if (shouldProcessBranchUI) {
        addBranchCopyUI();
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
