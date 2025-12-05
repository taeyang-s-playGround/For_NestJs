import React, { useEffect, useState } from 'react';
import {
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} from '../api.boards';

function Board() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedBoard(null);
  };

  const fetchBoards = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBoards();
      setBoards(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.data?.message || '게시글 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 간단 프론트 검증 (백엔드 DTO에 validator 없음)
    if (!title.trim() || !description.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (selectedBoard) {
        const updated = await updateBoard(selectedBoard.id, {
          title,
          description,
        });
        setBoards((prev) =>
          prev.map((b) => (b.id === updated.id ? updated : b)),
        );
      } else {
        const created = await createBoard({
          title,
          description,
        });
        setBoards((prev) => [created, ...prev]);
      }
      resetForm();
    } catch (e) {
      setError(e.data?.message || '저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (board) => {
    setSelectedBoard(board);
    setTitle(board.title || '');
    setDescription(board.description || '');
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDelete = async (board) => {
    if (!window.confirm(`"${board.title}" 게시글을 삭제하시겠습니까?`)) return;
    setError(null);
    try {
      await deleteBoard(board.id);
      setBoards((prev) => prev.filter((b) => b.id !== board.id));
      if (selectedBoard && selectedBoard.id === board.id) {
        resetForm();
      }
    } catch (e) {
      setError(e.data?.message || '삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="BoardPage">
      <h1>게시판</h1>

      {error && <div className="BoardPage-error">{error}</div>}

      <section className="BoardPage-formSection">
        <h2>{selectedBoard ? '게시글 수정' : '새 게시글 작성'}</h2>
        <form className="BoardForm" onSubmit={handleSubmit}>
          <div className="BoardForm-row">
            <label htmlFor="title">제목</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
            />
          </div>
          <div className="BoardForm-row">
            <label htmlFor="description">내용</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="내용을 입력하세요"
              rows={4}
            />
          </div>
          <div className="BoardForm-actions">
            {selectedBoard && (
              <button
                type="button"
                className="BoardForm-button secondary"
                onClick={handleCancelEdit}
                disabled={saving}
              >
                취소
              </button>
            )}
            <button
              type="submit"
              className="BoardForm-button primary"
              disabled={saving}
            >
              {saving
                ? '저장 중...'
                : selectedBoard
                ? '수정 완료'
                : '작성 완료'}
            </button>
          </div>
        </form>
      </section>

      <section className="BoardPage-listSection">
        <div className="BoardPage-listHeader">
          <h2>게시글 목록</h2>
          <button
            type="button"
            className="BoardForm-button ghost"
            onClick={fetchBoards}
            disabled={loading}
          >
            {loading ? '불러오는 중...' : '새로고침'}
          </button>
        </div>
        {loading && boards.length === 0 ? (
          <div className="BoardPage-empty">게시글을 불러오는 중입니다...</div>
        ) : boards.length === 0 ? (
          <div className="BoardPage-empty">
            아직 게시글이 없습니다. 첫 글을 작성해보세요!
          </div>
        ) : (
          <ul className="BoardList">
            {boards.map((board) => (
              <li key={board.id} className="BoardItem">
                <div className="BoardItem-main">
                  <h3 className="BoardItem-title">{board.title}</h3>
                  <p className="BoardItem-description">
                    {board.description}
                  </p>
                </div>
                <div className="BoardItem-meta">
                  {board.createdAt && (
                    <span className="BoardItem-date">
                      {new Date(board.createdAt).toLocaleString()}
                    </span>
                  )}
                  <div className="BoardItem-actions">
                    <button
                      type="button"
                      className="BoardForm-button secondary small"
                      onClick={() => handleEdit(board)}
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      className="BoardForm-button danger small"
                      onClick={() => handleDelete(board)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Board;

