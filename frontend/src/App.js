import React, { useState } from 'react';
import './App.css';
import Board from './components/Board';
import Statistics from './components/Statistics';

function App() {
  const [activeTab, setActiveTab] = useState('board'); // 'board' or 'statistics'

  return (
    <div className="App">
      <div className="App-layout">
        {/* 좌측 사이드바 */}
        <aside className="App-sidebar">
          <div className="App-sidebar-header">
            <h2>메뉴</h2>
          </div>
          <nav className="App-sidebar-nav">
            <button
              className={`App-sidebar-item ${activeTab === 'board' ? 'active' : ''}`}
              onClick={() => setActiveTab('board')}
            >
              게시판
            </button>
            <button
              className={`App-sidebar-item ${activeTab === 'statistics' ? 'active' : ''}`}
              onClick={() => setActiveTab('statistics')}
            >
              통계
            </button>
          </nav>
        </aside>

        {/* 메인 콘텐츠 영역 */}
        <main className="App-main">
          {activeTab === 'board' && <Board />}
          {activeTab === 'statistics' && <Statistics />}
        </main>
      </div>
    </div>
  );
}

export default App;
