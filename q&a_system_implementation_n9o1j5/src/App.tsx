import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Toaster } from "sonner";
import { useState } from "react";
import { AdminPage } from "./AdminPage";
import { AdminLoginForm } from "./AdminLoginForm";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const searchResult = useQuery(api.questions.search, { searchTerm: activeSearch });
  const isAdmin = useQuery(api.questions.isAdmin);
  const adminLogout = useMutation(api.questions.adminLogout);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchTerm);
  };

  const handleLogout = async () => {
    await adminLogout();
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b">
        <button 
          onClick={async () => {
            if (isAdmin) {
              await adminLogout();
            }
            window.location.href = '/';
          }} 
          className="text-xl font-semibold accent-text hover:text-blue-600 transition-colors"
        >
          Cooking Q&A
        </button>
        <div className="flex gap-4">
          {isAdmin ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => setShowAdminLogin(true)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </button>
          )}
        </div>
      </header>
      
      {isAdmin ? (
        <AdminPage />
      ) : (
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-8">Ask Your Cooking Question</h1>
            
            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="How do I cook..."
                  className="flex-1 p-4 text-lg border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="submit"
                  className="px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {searchResult && (
              <div className="mt-8 p-6 bg-white rounded-lg shadow-lg text-left">
                <h3 className="font-semibold text-xl mb-2">{searchResult.question}</h3>
                <p className="text-gray-700">{searchResult.answer}</p>
              </div>
            )}

            {activeSearch && !searchResult && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-lg text-left">
                <p className="text-gray-700">No answer found for your question. Try rephrasing or ask something else.</p>
              </div>
            )}
          </div>
        </main>
      )}

      {showAdminLogin && (
        <AdminLoginForm onClose={() => setShowAdminLogin(false)} />
      )}
      
      <Toaster />
    </div>
  );
}
