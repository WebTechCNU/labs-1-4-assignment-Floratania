import React from 'react';
import { api } from '../api';

export default function RequestsSidebar({ isOpen, onClose, books, onRefresh }) {
  
  const handleMarkAsRead = async (bookId, requestData) => {
    try {
      const book = books.find(b => b._id === bookId);
      if (!book) return;

      // Створюємо оновлений масив, де конкретний запит стає прочитаним
      const updatedRequests = book.requests.map(req => {
        // Співставляємо за часом та ID користувача
        if (req.requestedAt === requestData.requestedAt && req.userId === requestData.userId) {
          return { ...req, isRead: true };
        }
        return req;
      });

      await api.updateBook(bookId, { requests: updatedRequests });
      if (onRefresh) onRefresh(); // Перезавантажуємо книги в App.js
    } catch (err) {
      alert("Не вдалося оновити статус");
    }
  };

  // Збираємо всі запити
  const allRequests = books.flatMap(book => 
    (book.requests || []).map(req => ({ 
      ...req, 
      bookId: book._id, 
      bookTitle: book.title 
    }))
  ).sort((a, b) => {
    // Спочатку непрочитані, потім за часом
    if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
    return new Date(b.requestedAt) - new Date(a.requestedAt);
  });

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      )}
      
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-[#1e293b] shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} border-l border-slate-700`}>
        <div className="p-6 h-full flex flex-col text-white">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black uppercase">Запити</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            {allRequests.length > 0 ? allRequests.map((req, i) => (
              <div key={i} className={`p-4 rounded-[5px] border transition-all ${req.isRead ? 'bg-slate-900/50 border-slate-800 opacity-60' : 'bg-slate-800 border-blue-500'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded uppercase font-bold">
                    {req.bookTitle}
                  </span>
                  {!req.isRead && (
                    <button 
                      onClick={() => handleMarkAsRead(req.bookId, req)}
                      className="text-[10px] text-emerald-400 hover:bg-emerald-400 hover:text-white border border-emerald-400 px-2 py-0.5 rounded transition-colors"
                    >
                      ✓ Прочитано
                    </button>
                  )}
                </div>

                <div className="mb-2">
                  <p className="font-bold">{req.userName || req.from}</p>
                  <p className="text-xs text-blue-400">{req.userPhone || req.phone}</p>
                </div>

                {(req.note || req.text) && (
                  <p className="text-xs text-slate-400 italic bg-black/20 p-2 rounded">
                    "{req.note || req.text}"
                  </p>
                )}

                <div className="mt-4 flex gap-2">
                  <a href={`tel:${req.userPhone || req.phone}`} className="flex-1 bg-slate-700 text-center py-2 rounded text-xs font-bold">Дзвінок</a>
                  <a href={`mailto:${req.userEmail}`} className="flex-1 bg-blue-600 text-center py-2 rounded text-xs font-bold">Email</a>
                </div>
              </div>
            )) : (
              <p className="text-center text-slate-500 mt-20">Немає запитів</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}