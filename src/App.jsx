// import React, { useState, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBell, faPlus, faSignOutAlt, faSearch } from '@fortawesome/free-solid-svg-icons';

// import { api } from '../api';
// import Auth from './components/Auth';
// import BookModal from './components/AddBookModal';
// import BookCard from './components/BookCard';
// import RequestsSidebar from './components/RequestsSidebar';

// const globalStyles = `
//   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
//   * { box-sizing: border-box; }
//   html, body {
//     margin: 0; padding: 0; width: 100%; min-height: 100vh;
//     background-color: #333333; color: #f1f5f9;
//     font-family: 'Inter', sans-serif; overflow-x: hidden;
//   }
//   #root { width: 100%; min-height: 100vh; display: flex; flex-direction: column; background-color: #333333; }
//   button { transition: all 0.2s ease; cursor: pointer; }
//   .custom-scrollbar::-webkit-scrollbar { width: 5px; }
//   .custom-scrollbar::-webkit-scrollbar-track { background: #1e293b; }
//   .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 5px; }
// `;

// function RequestModal({ book, onClose, onConfirm }) {
//   const [note, setNote] = useState("");
//   if (!book) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//       <div className="bg-[#1e293b] text-white p-6 rounded-[5px] w-full max-w-md shadow-2xl">
//         <h2 className="text-xl font-bold">{book.title}</h2>
//         <p className="text-slate-400 text-sm">{book.author}</p>
//         <div className="mt-4">
//           <label className="text-xs text-slate-400 block mb-1">Повідомлення власнику:</label>
//           <textarea
//             className="w-full bg-[#0f172a] p-3 rounded-[5px] text-sm text-slate-300 border border-slate-700 focus:outline-none focus:border-blue-500"
//             rows="3"
//             placeholder="Наприклад: Чи можу я взяти її на вихідні?"
//             value={note}
//             onChange={(e) => setNote(e.target.value)}
//           />
//         </div>
//         <div className="flex justify-end gap-3 mt-6">
//           <button onClick={onClose} className="px-4 py-2 bg-slate-700 rounded-[5px]">Скасувати</button>
//           <button onClick={() => onConfirm(note)} className="px-4 py-2 bg-blue-600 rounded-[5px] font-bold hover:bg-blue-500">Надіслати</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function App() {
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem('book_user')));
//   const [books, setBooks] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [editingBook, setEditingBook] = useState(null);
//   const [requestBook, setRequestBook] = useState(null);

//   const [statusFilter, setStatusFilter] = useState('all');
//   const [typeFilter, setTypeFilter] = useState('all');

//   const loadBooks = async () => {
//     try {
//       // Виклик GraphQL через api.js
//       const data = await api.getBooks(searchTerm);
//       setBooks(data || []);
//     } catch (err) {
//       console.error("Помилка GraphQL:", err);
//     }
//   };

//   useEffect(() => {
//     if (user) loadBooks();
//   }, [user, searchTerm]);

//   const handleLogin = (userData) => {
//     const session = { name: userData.username, id: userData._id, email: userData.email, phone: userData.phone };
//     localStorage.setItem('book_user', JSON.stringify(session));
//     setUser(session);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('book_user');
//     window.location.reload();
//   };

//   const handleSaveBook = async (data) => {
//     try {
//       if (editingBook) {
//         await api.updateBook(editingBook._id, data);
//       } else {
//         await api.addBook(data);
//       }
//       loadBooks();
//       setIsModalOpen(false);
//       setEditingBook(null);
//     } catch (err) {
//       alert("Помилка збереження через GraphQL");
//     }
//   };

//   const handleDeleteBook = async (id) => {
//     if (window.confirm("Видалити цю книгу?")) {
//       try {
//         await api.deleteBook(id);
//         loadBooks();
//       } catch (err) {
//         alert("Помилка видалення");
//       }
//     }
//   };

//   const filteredBooks = books.filter(book => {
//     const matchesStatus = statusFilter === 'all' || 
//       (statusFilter === 'available' && book.status === 'Available') ||
//       (statusFilter === 'reserved' && book.status !== 'Available');
//     const matchesType = typeFilter === 'all' || book.intent === typeFilter;
//     return matchesStatus && matchesType;
//   });

//   if (!user) return <Auth onLogin={handleLogin} />;

//   const myBooks = books.filter(b => b.ownerId === user.id);
//   const totalUnread = myBooks.reduce((sum, b) => sum + (b.requests || []).filter(r => !r.isRead).length, 0);

//   return (
//     <>
//       <style>{globalStyles}</style>
//       <div className="w-full min-h-screen flex flex-col bg-[#333333]">
//         <div className="w-full p-6 md:p-8 max-w-[1440px] mx-auto">

//           {/* HEADER */}
//           <header className="flex justify-between items-center mb-10">
//             <div>
//               <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Книжкова Поличка</h1>
//               <p className="text-slate-500 text-xs mt-1 uppercase font-bold tracking-widest">Користувач: {user.name}</p>
//             </div>
//             <div className="flex gap-4">
//               <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-[#1e293b] rounded-[5px] relative hover:bg-[#2d3a4f]">
//                 <FontAwesomeIcon icon={faBell} className="text-white" />
//                 {totalUnread > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#333333] font-bold animate-pulse">
//                     {totalUnread}
//                   </span>
//                 )}
//               </button>
//               <button onClick={() => { setIsModalOpen(true); setEditingBook(null); }} className="bg-blue-600 px-5 py-3 rounded-[5px] font-bold hover:bg-blue-500">
//                 <FontAwesomeIcon icon={faPlus} /> Додати
//               </button>
//               <button onClick={handleLogout} className="text-slate-400 hover:text-white p-3">
//                 <FontAwesomeIcon icon={faSignOutAlt} />
//               </button>
//             </div>
//           </header>

//           {/* SEARCH */}
//           <div className="flex flex-col gap-6 mb-8">
//             <div className="relative">
//               <FontAwesomeIcon icon={faSearch} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
//               <input
//                 className="w-full p-5 pl-12 bg-[#1e293b] rounded-[5px] text-white focus:outline-none border border-transparent focus:border-blue-500 shadow-xl"
//                 placeholder="Пошук за назвою або автором..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             <div className="flex flex-wrap items-center gap-4 text-sm">
//               <div className="flex items-center gap-2 bg-[#1e293b] p-1 rounded-[5px]">
//                 <button onClick={() => setStatusFilter('all')} className={`px-4 py-2 rounded-[3px] ${statusFilter === 'all' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}>Всі</button>
//                 <button onClick={() => setStatusFilter('available')} className={`px-4 py-2 rounded-[3px] ${statusFilter === 'available' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}>В наявності</button>
//               </div>
//             </div>
//           </div>

//           {/* GRID */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {filteredBooks.length > 0 ? filteredBooks.map(book => (
//               <BookCard
//                 key={book._id}
//                 book={book}
//                 currentUser={user}
//                 onDelete={handleDeleteBook}
//                 onEdit={(b) => { setEditingBook(b); setIsModalOpen(true); }}
//                 onRequest={() => setRequestBook(book)}
//               />
//             )) : (
//               <div className="col-span-full text-center py-20 bg-[#1e293b] rounded-[5px] border border-dashed border-slate-700 text-slate-500">
//                 Нічого не знайдено
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <BookModal 
//         isOpen={isModalOpen} 
//         onClose={() => { setIsModalOpen(false); setEditingBook(null); }} 
//         onSave={handleSaveBook} 
//         editData={editingBook} 
//       />
//       <RequestsSidebar 
//         isOpen={isSidebarOpen} 
//         onClose={() => setIsSidebarOpen(false)} 
//         books={myBooks} 
//         onRefresh={loadBooks} 
//       />
//       <RequestModal 
//         book={requestBook} 
//         onClose={() => setRequestBook(null)} 
//         onConfirm={(note) => { console.log(note); setRequestBook(null); }} 
//       />
//     </>
//   );
// }

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faPlus, faSignOutAlt, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';

import { api } from '../api';
import Auth from './components/Auth';
import BookModal from './components/AddBookModal';
import BookCard from './components/BookCard';
import RequestsSidebar from './components/RequestsSidebar';

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0; width: 100%; min-height: 100vh;
    background-color: #333333; color: #f1f5f9;
    font-family: 'Inter', sans-serif; overflow-x: hidden;
  }
  #root { width: 100%; min-height: 100vh; display: flex; flex-direction: column; background-color: #333333; }
  button { transition: all 0.2s ease; cursor: pointer; }
  input::placeholder { color: #475569; }
  .custom-scrollbar::-webkit-scrollbar { width: 5px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: #1e293b; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 5px; }
`;


function RequestModal({ book, onClose, onConfirm }) {
  const [note, setNote] = useState("");
  if (!book) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e293b] text-white p-6 rounded-[5px] w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold">{book.title}</h2>
        <p className="text-slate-400 text-sm">{book.author}</p>
        <div className="mt-4">
          <label className="text-xs text-slate-400 block mb-1">Повідомлення власнику:</label>
          <textarea
            className="w-full bg-[#0f172a] p-3 rounded-[5px] text-sm text-slate-300 border border-slate-700 focus:outline-none focus:border-blue-500"
            rows="3"
            placeholder="Наприклад: Чи можу я взяти її на вихідні?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-slate-700 rounded-[5px]">Скасувати</button>
          <button onClick={() => onConfirm(note)} className="px-4 py-2 bg-blue-600 rounded-[5px] font-bold hover:bg-blue-500">Надіслати</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('book_user')));
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [requestBook, setRequestBook] = useState(null);

  const [statusFilter, setStatusFilter] = useState('all'); 
  const [typeFilter, setTypeFilter] = useState('all'); 

  const loadBooks = async () => {
    try {
      const data = await api.getBooks();
      setBooks(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { if (user) loadBooks(); }, [user]);

 const handleLogin = (data) => {
  
  if (data.token && data.user) {
    const session = { 
      name: data.user.username, 
      id: data.user._id, 
      email: data.user.email, 
      phone: data.user.phone 
    };
    
    
    localStorage.setItem('book_user', JSON.stringify(session));
    localStorage.setItem('token', data.token); 
    
    setUser(session);
  }
};

  const handleLogout = () => { localStorage.removeItem('book_user'); window.location.reload(); };

  const handleSaveBook = async (data) => {
    try {
      if (editingBook) await api.updateBook(editingBook._id, data);
      else await api.addBook({ ...data, ownerId: user.id, ownerName: user.name });
      loadBooks(); setIsModalOpen(false); setEditingBook(null);
    } catch (err) { alert("Помилка збереження"); }
  };

  const confirmRequest = async (note) => {
  try {
    
    await api.sendBookRequest(requestBook._id, {
      userName: user.name,
      note: note
    });

    setRequestBook(null); 
    loadBooks(); 
    alert("Запит успішно надіслано!");
  } catch (err) { 
    console.error(err);
    alert("Помилка відправки: " + err.message); 
  }
};

  const filteredBooks = books.filter(book => {
    const s = searchTerm.toLowerCase();
    const matchesSearch = book.title?.toLowerCase().includes(s) || book.author?.toLowerCase().includes(s) || 
      (b.description?.toLowerCase().includes(s));
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'available' && book.status === 'Available') ||
      (statusFilter === 'reserved' && book.status !== 'Available');

    const matchesType = typeFilter === 'all' || book.intent === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  if (!user) return <Auth onLogin={handleLogin} />;

  const myBooks = books.filter(b => b.ownerId === user.id);
  const totalUnread = myBooks.reduce((sum, b) => sum + (b.requests || []).filter(r => !r.isRead).length, 0);

  return (
    <>
      <style>{globalStyles}</style>
      <div className="w-full min-h-screen flex flex-col bg-[#333333]">
        <div className="w-full p-6 md:p-8 max-w-[1440px] mx-auto">

          
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Книжкова Поличка</h1>
              <p className="text-slate-500 text-xs mt-1 uppercase font-bold tracking-widest">Користувач: {user.name}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-[#1e293b] rounded-[5px] relative hover:bg-[#2d3a4f]">
                <FontAwesomeIcon icon={faBell} className="text-white" />
                {totalUnread > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#333333] font-bold animate-pulse">
                    {totalUnread}
                  </span>
                )}
              </button>
              <button onClick={() => { setIsModalOpen(true); setEditingBook(null); }} className="bg-blue-600 px-5 py-3 rounded-[5px] font-bold hover:bg-blue-500">
                <FontAwesomeIcon icon={faPlus} /> Додати
              </button>
              <button onClick={handleLogout} className="text-slate-400 hover:text-white p-3"><FontAwesomeIcon icon={faSignOutAlt} /></button>
            </div>
          </header>

          
          <div className="flex flex-col gap-6 mb-8">
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                className="w-full p-5 pl-12 bg-[#1e293b] rounded-[5px] text-white focus:outline-none border border-transparent focus:border-blue-500 shadow-xl"
                placeholder="Пошук за назвою, автором або описом..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

           
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-[#1e293b] p-1 rounded-[5px]">
                <button 
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 rounded-[3px] ${statusFilter === 'all' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >Всі</button>
                <button 
                  onClick={() => setStatusFilter('available')}
                  className={`px-4 py-2 rounded-[3px] ${statusFilter === 'available' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >В наявності</button>
                <button 
                  onClick={() => setStatusFilter('reserved')}
                  className={`px-4 py-2 rounded-[3px] ${statusFilter === 'reserved' ? 'bg-orange-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >Зайняті</button>
              </div>

              <div className="flex items-center gap-2 bg-[#1e293b] p-1 rounded-[5px]">
                <button 
                  onClick={() => setTypeFilter('all')}
                  className={`px-4 py-2 rounded-[3px] ${typeFilter === 'all' ? 'bg-slate-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >Будь-який тип</button>
                <button 
                  onClick={() => setTypeFilter('Exchange')}
                  className={`px-4 py-2 rounded-[3px] ${typeFilter === 'Exchange' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >Обмін</button>
                <button 
                  onClick={() => setTypeFilter('Lend')}
                  className={`px-4 py-2 rounded-[3px] ${typeFilter === 'Lend' ? 'bg-pink-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >Оренда</button>
              </div>
            </div>
          </div>

         
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.length > 0 ? filteredBooks.map(book => (
              <BookCard
                key={book._id}
                book={book}
                currentUser={user}
                onDelete={(id) => api.deleteBook(id).then(loadBooks)}
                onEdit={(b) => { setEditingBook(b); setIsModalOpen(true); }}
                onRequest={() => setRequestBook(book)}
              />
            )) : (
              <div className="col-span-full text-center py-20 bg-[#1e293b] rounded-[5px] border border-dashed border-slate-700">
                <p className="text-slate-500">За вашим запитом нічого не знайдено</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <BookModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingBook(null); }} onSave={handleSaveBook} editData={editingBook} />
      <RequestsSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} books={myBooks} onRefresh={loadBooks} />
      <RequestModal book={requestBook} onClose={() => setRequestBook(null)} onConfirm={confirmRequest} />
    </>
  );
}