import React from "react";
import { useAuth } from "@/hooks/useAuth";

const IndexSimple = () => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Duke ngarkuar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              RMA Shqip Community
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              Komuniteti shqiptar i Real Madrid
            </p>
          </div>

          {/* Status Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Status i Aplikacionit</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-3 ${user ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-gray-700">
                  Authentication: {user ? '✅ Aktive' : '❌ Jo aktive'}
                </span>
              </div>
              
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-3 ${userProfile ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-gray-700">
                  User Profile: {userProfile ? '✅ Krijuar' : '⏳ Duke krijuar...'}
                </span>
              </div>
            </div>

            {user && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">Informacione të Përdoruesit:</h3>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>ID:</strong> {user.id}</p>
                {userProfile && (
                  <p><strong>Roli:</strong> {userProfile.role}</p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mr-4"
            >
              Rifresko Faqen
            </button>
            
            <button 
              onClick={() => console.log('Environment variables:', {
                url: import.meta.env.VITE_SUPABASE_URL,
                keyExists: !!import.meta.env.VITE_SUPABASE_ANON_KEY
              })}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Kontrollo Console
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexSimple; 