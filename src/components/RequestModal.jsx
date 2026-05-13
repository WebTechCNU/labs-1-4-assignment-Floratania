function RequestModal({ book, onClose, onConfirm }) {
  const [note, setNote] = useState(""); 

  if (!book) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1e293b] text-white p-6 rounded-[5px] w-[90%] max-w-md">
        <h2 className="text-xl font-bold">{book.title}</h2>
        <p className="text-slate-400 text-sm">{book.author}</p>

        
        <div className="mt-4">
          <label className="text-xs text-slate-400 block mb-1">Додати зауваження до запиту:</label>
          <textarea
            className="w-full bg-[#0f172a] p-3 rounded-[5px] text-sm text-slate-300 border border-slate-700 focus:outline-none focus:border-blue-500"
            rows="3"
            placeholder="Наприклад: Коли зручно зустрітися?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <p className="mt-4 text-xs text-slate-400">
          Надсилаючи запит, власник побачить ваші контакти (Email та телефон).
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-slate-700 rounded-[5px]">
            Скасувати
          </button>
          <button
            onClick={() => onConfirm(note)} 
            className="px-4 py-2 bg-blue-600 rounded-[5px] font-bold hover:bg-blue-500"
          >
            Надіслати запит
          </button>
        </div>
      </div>
    </div>
  );
}