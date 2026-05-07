export default function AddBookModal({ 
  isOpen, 
  onClose, 
  onSave,
  editData 
}) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    onSave(Object.fromEntries(formData));

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-3xl max-w-lg w-full shadow-2xl">
        <h2 className="text-2xl font-black mb-6 text-slate-800">
          {editData ? "Редагувати книгу" : "Додати нову книгу"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <input
              name="title"
              placeholder="Назва книги"
              defaultValue={editData?.title || ""}
              className="w-full p-3 border rounded-xl"
              required
            />

            <input
              name="author"
              placeholder="Автор"
              defaultValue={editData?.author || ""}
              className="w-full p-3 border rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">
                Статус
              </label>

              <select
                name="status"
                defaultValue={editData?.status || "Available"}
                className="w-full p-3 border rounded-xl bg-slate-50"
              >
                <option value="Available">Вільна</option>
                <option value="Reserved">Заброньована</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">
                Намір
              </label>

              <select
                name="intent"
                defaultValue={editData?.intent || "Exchange"}
                className="w-full p-3 border rounded-xl bg-slate-50"
              >
                <option value="Exchange">На обмін</option>
                <option value="Lend">Позичу</option>
                <option value="Both">Обмін або Позичу</option>
              </select>
            </div>
          </div>

          <textarea
            name="description"
            placeholder="Опишіть стан книги або умови"
            defaultValue={editData?.description || ""}
            className="w-full p-3 border rounded-xl h-24 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-slate-400 font-bold"
            >
              Скасувати
            </button>

            <button
              type="submit"
              className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition"
            >
              {editData ? "Зберегти" : "Опублікувати"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}