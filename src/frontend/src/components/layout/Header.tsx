import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth'; // Ajoutez cette import
import { useNavigate } from 'react-router-dom'; // Ajoutez cette import

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout, user } = useAuth(); // Utilisez le contexte d'authentification
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      console.log('Déconnexion...');
      await logout(); // Utilisez la fonction logout du contexte
      navigate('/login'); // Utilisez navigate au lieu de window.location
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Utilisez l'email de l'utilisateur depuis le contexte
  const userEmail = user?.email;

  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            NOAA Analytics
          </h1>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 rounded-full bg-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-700">{userEmail || 'User'}</span>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
