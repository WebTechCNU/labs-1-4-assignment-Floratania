import React, { useState } from 'react';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.isLogin = isLogin;

    try {
      const response = await fetch("/.netlify/functions/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();

      if (response.ok) {
        onLogin(result);
      } else {
        setError(result.error || "Виникла помилка");
      }
    } catch (err) {
      setError("Помилка з'єднання з сервером");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#333333] p-4 font-['Inter']">
      <form 
        onSubmit={handleSubmit} 
        className="bg-[#1e293b] p-8 rounded-[5px] shadow-2xl w-full max-w-md border border-slate-700/50"
      >
        <h2 className="text-3xl font-black mb-8 text-white text-center tracking-tighter uppercase">
          {isLogin ? 'Вхід' : 'Реєстрація'}
        </h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-[5px] mb-6 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {!isLogin && (
            <input 
              name="username" 
              type="text"
              placeholder="Ваше ім'я" 
              className="w-full p-4 bg-[#0f172a] border-none text-white rounded-[5px] outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder-slate-600" 
              required 
            />
          )}
          
          <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            className="w-full p-4 bg-[#0f172a] border-none text-white rounded-[5px] outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder-slate-600" 
            required 
          />
          
          <input 
            name="password" 
            type="password" 
            placeholder="Пароль" 
            className="w-full p-4 bg-[#0f172a] border-none text-white rounded-[5px] outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder-slate-600" 
            required 
          />
          
          {!isLogin && (
            <input 
              name="phone" 
              type="tel" 
              placeholder="Номер телефону" 
              className="w-full p-4 bg-[#0f172a] border-none text-white rounded-[5px] outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder-slate-600" 
              required 
            />
          )}
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white p-4 rounded-[5px] font-black uppercase tracking-widest mt-8 hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
        >
          {isLogin ? 'Увійти' : 'Створити акаунт'}
        </button>

        <p className="mt-6 text-center text-sm text-slate-500 font-medium">
          {isLogin ? 'Немає акаунту?' : 'Вже є акаунт?'}
          <button 
            type="button" 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }} 
            className="ml-2 text-blue-500 font-black hover:text-blue-400 transition-colors uppercase tracking-tighter"
          >
            {isLogin ? 'Зареєструватися' : 'Увійти'}
          </button>
        </p>
      </form>
    </div>
  );
}