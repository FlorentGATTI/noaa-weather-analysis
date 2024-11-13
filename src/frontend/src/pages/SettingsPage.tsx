// src/pages/SettingsPage.tsx
import { useState } from 'react';
import { useAuth } from '../features/auth/AuthProvider';
import {
  Bell,
  Shield,
  Globe,
  BarChart,
  User
} from 'lucide-react';
import { Switch } from '@headlessui/react';
import type { SettingsSection } from '../types/settings';

const SettingsPage = () => {
  const { user } = useAuth();

  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      weatherAlerts: true,
      systemUpdates: false,
    },
    display: {
      darkMode: false,
      compactView: false,
      metricSystem: true,
    },
    data: {
      autoRefresh: true,
      cacheData: true,
      showHistorical: true,
    },
    analysis: {
      showConfidenceIntervals: true,
      includeOutliers: false,
      autoCalculate: true,
    }
  });

  const sections: SettingsSection[] = [
    {
      id: 'account',
      title: 'Compte',
      icon: User,
      description: 'Gérez vos informations de compte et préférences de sécurité'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'Configurez comment et quand vous souhaitez être notifié'
    },
    {
      id: 'security',
      title: 'Sécurité',
      icon: Shield,
      description: 'Gérez la sécurité de votre compte et les options d\'authentification'
    },
    {
      id: 'data',
      title: 'Données',
      icon: Globe,
      description: 'Configurez les paramètres de données et d\'affichage'
    },
    {
      id: 'analysis',
      title: 'Analyse',
      icon: BarChart,
      description: 'Personnalisez vos préférences d\'analyse et de visualisation'
    }
  ];

  const handleToggle = (category: string, setting: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof settings],
        [setting]: !prev[category as keyof typeof settings][setting as keyof typeof settings[keyof typeof settings]]
      }
    }));
  };

  const renderSettingToggle = (category: string, setting: string, label: string) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-700">{label}</span>
      <Switch
        checked={settings[category as keyof typeof settings][setting as keyof typeof settings[keyof typeof settings]]}
        onChange={() => handleToggle(category, setting)}
        className={`${
          settings[category as keyof typeof settings][setting as keyof typeof settings[keyof typeof settings]]
            ? 'bg-blue-600'
            : 'bg-gray-200'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      >
        <span className="sr-only">{label}</span>
        <span
          className={`${
            settings[category as keyof typeof settings][setting as keyof typeof settings[keyof typeof settings]]
              ? 'translate-x-6'
              : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Paramètres
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos préférences pour NOAA Weather Analysis
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-6 md:grid-cols-2">
        {sections.map((section) => (
          <div
            key={section.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center">
                <section.icon className="h-6 w-6 text-blue-500" />
                <h3 className="ml-3 text-lg font-medium text-gray-900">
                  {section.title}
                </h3>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {section.description}
              </p>
              <div className="mt-4 space-y-4">
                {section.id === 'notifications' && (
                  <>
                    {renderSettingToggle('notifications', 'emailAlerts', 'Alertes par email')}
                    {renderSettingToggle('notifications', 'weatherAlerts', 'Alertes météo')}
                    {renderSettingToggle('notifications', 'systemUpdates', 'Mises à jour système')}
                  </>
                )}
                {section.id === 'data' && (
                  <>
                    {renderSettingToggle('data', 'autoRefresh', 'Actualisation automatique')}
                    {renderSettingToggle('data', 'cacheData', 'Mise en cache des données')}
                    {renderSettingToggle('data', 'showHistorical', 'Afficher les données historiques')}
                  </>
                )}
                {section.id === 'display' && (
                  <>
                    {renderSettingToggle('display', 'darkMode', 'Mode sombre')}
                    {renderSettingToggle('display', 'compactView', 'Vue compacte')}
                    {renderSettingToggle('display', 'metricSystem', 'Système métrique')}
                  </>
                )}
                {section.id === 'analysis' && (
                  <>
                    {renderSettingToggle('analysis', 'showConfidenceIntervals', 'Intervalles de confiance')}
                    {renderSettingToggle('analysis', 'includeOutliers', 'Inclure les valeurs aberrantes')}
                    {renderSettingToggle('analysis', 'autoCalculate', 'Calcul automatique')}
                  </>
                )}
                {section.id === 'account' && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">Connecté en tant que :</p>
                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <p className="text-xs text-gray-400 mt-1">Rôle : {user?.role}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
