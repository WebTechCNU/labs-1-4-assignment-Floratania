import React from 'react';

export default function BookCard({ book, currentUser, onDelete, onEdit, onRequest }) {
  const isOwner = book.ownerId === currentUser.id;

  return (
    <div className={`group p-6 rounded-3xl border transition-all duration-300 ${
      book.status === 'Available' 
      ? 'bg-white border-slate-200 shadow-sm hover:shadow-xl' 
      : 'bg-slate-50 border-transparent opacity-75'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 leading-tight">{book.title}</h3>
          <p className="text-slate-500 italic text-sm">{book.author}</p>
        </div>
        {isOwner && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(book)} className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100">✎</button>
            <button onClick={() => onDelete(book._id)} className="p-2 bg-red-50 text-red-400 rounded-full hover:bg-red-100">✕</button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`text-[10px] font-black px-2 py-1 rounded shadow-sm ${book.status === 'Available' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}>
          {book.status === 'Available' ? 'Вільна' : 'Заброньована'}
        </span>
        <span className="text-[10px] font-black px-2 py-1 rounded bg-indigo-100 text-indigo-700 uppercase">
  {book.intent === 'Both' ? 'Обмін / Позичу' : book.intent === 'Exchange' ? 'Обмін' : 'Позичу'}
</span>
      </div>

      <p className="text-sm text-slate-600 bg-slate-100/50 p-3 rounded-2xl mb-6 line-clamp-3">
        {book.description}
      </p>

      {!isOwner && (
        <button 
          onClick={() => onRequest(book._id)}
          disabled={book.status !== 'Available'}
          className={`w-full py-3 rounded-2xl font-bold transition-all ${
            book.status === 'Available' 
            ? 'bg-slate-900 text-white hover:bg-indigo-600 shadow-lg active:scale-95' 
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {book.status === 'Available' ? 'Хочу цю книгу' : 'Вже заброньовано'}
        </button>
      )}
      
      {isOwner && (
        <div className="text-center py-2 border-t border-dashed border-slate-200 mt-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ваше оголошення</span>
        </div>
      )}
    </div>
  );
}