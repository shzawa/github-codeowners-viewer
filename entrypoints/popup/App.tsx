import './App.css';

function App() {
  return (
    <>
      <div className="container">
        <h1>GitHub CODEOWNERS Viewer</h1>
        <p className="description">
          GitHub の Pull requests ページで CODEOWNERS 情報を常に表示します。
        </p>
        <div className="features">
          <h2>機能</h2>
          <ul>
            <li>Pull request の Files changed タブで各ファイルの CODEOWNERS 情報を表示</li>
            <li>非同期で読み込まれる diff にも対応</li>
          </ul>
        </div>
        <div className="usage">
          <h2>使い方</h2>
          <p>
            GitHub の Pull request ページにアクセスするだけで自動的に動作します。
            各ファイルの diff ヘッダーに CODEOWNERS 情報が表示されます。
          </p>
        </div>
        <footer>
          <p>
            <a href="https://github.com/shzawa/always-show-codeowners" target="_blank" rel="noopener noreferrer">
              GitHub リポジトリ
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;
