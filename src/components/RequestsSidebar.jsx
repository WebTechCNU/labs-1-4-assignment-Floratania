import React from "react";
import { api } from "../../api";

export default function RequestsSidebar({
  isOpen,
  onClose,
  books,
  onRefresh,
}) {



  const handleMarkAsRead = async (
    bookId,
    requestIndex
  ) => {
    try {
      await api.markRequestAsRead(
        bookId,
        requestIndex
      );

      onRefresh?.();
    } catch (err) {
      console.error(err);
      alert("Не вдалося оновити статус");
    }
  };


  const allRequests = books
    .flatMap((book) =>
      (book.requests || []).map(
        (req, requestIndex) => ({
          ...req,

          requestIndex,

          bookId: book._id,
          bookTitle: book.title,

          displayMessage:
            req.note ||
            req.message ||
            req.text ||
            "Без повідомлення",
        })
      )
    )
    .sort((a, b) => {


      if (a.isRead !== b.isRead) {
        return a.isRead ? 1 : -1;
      }

      return (
        new Date(b.requestedAt || 0) -
        new Date(a.requestedAt || 0)
      );
    });

  return (
    <>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}


      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-[#1e293b] shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen
            ? "translate-x-0"
            : "translate-x-full"
        } border-l border-slate-700`}
      >
        <div className="p-6 h-full flex flex-col text-white">


          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black uppercase">
              Запити
            </h2>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

        

          <div className="flex-1 overflow-y-auto space-y-4">

            {allRequests.length > 0 ? (
              allRequests.map((req, i) => (

                <div
                  key={`${req.bookId}-${req.requestIndex}-${i}`}
                  className={`p-4 rounded-[5px] border transition-all ${
                    req.isRead
                      ? "bg-slate-900/50 border-slate-800 opacity-60"
                      : "bg-slate-800 border-blue-500"
                  }`}
                >


                  <div className="flex justify-between items-start mb-2">

                    <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded uppercase font-bold">
                      {req.bookTitle}
                    </span>

                    {!req.isRead && (
                      <button
                        type="button"
                        onClick={() =>
                          handleMarkAsRead(
                            req.bookId,
                            req.requestIndex
                          )
                        }
                        className="text-[10px] text-emerald-400 hover:bg-emerald-400 hover:text-white border border-emerald-400 px-2 py-0.5 rounded transition-colors"
                      >
                        ✓ Прочитано
                      </button>
                    )}
                  </div>

    

                  <div className="mb-2">
                    <p className="font-bold text-sm">
                      {req.userName ||
                        req.user ||
                        req.from}
                    </p>
                  </div>


                  <div className="text-xs text-slate-300 italic bg-black/20 p-3 rounded mb-4 border-l-2 border-blue-500">

                    <span className="text-slate-500 block mb-1 text-[10px] uppercase font-bold">
                      Повідомлення:
                    </span>

                    {req.displayMessage}
                  </div>

        

                  <div className="flex gap-2">

                    <a
                      href={`tel:${
                        req.userPhone ||
                        req.phone ||
                        ""
                      }`}
                      className="flex-1 bg-slate-700 text-center py-2 rounded text-xs font-bold hover:bg-slate-600"
                    >
                      Дзвінок
                    </a>

                    <a
                      href={`mailto:${
                        req.userEmail || ""
                      }`}
                      className="flex-1 bg-blue-600 text-center py-2 rounded text-xs font-bold hover:bg-blue-500"
                    >
                      Email
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 mt-20">
                Немає нових запитів
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}