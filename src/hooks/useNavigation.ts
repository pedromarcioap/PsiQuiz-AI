import { useState } from 'react';

export type Page = 'dashboard' | 'generate' | 'analytics' | 'study' | 'library' | 'results';

export const useNavigation = () => {
  const [currentPage, setPage] = useState<Page>('dashboard');

  const navigateTo = (page: Page) => {
    setPage(page);
  };

  return {
    currentPage,
    navigateTo
  };
};

export const useNavigationItems = () => {
  return [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'generate', label: 'Gerar Quiz' },
    { id: 'analytics', label: 'Análise IA' },
    { id: 'library', label: 'Biblioteca' },
  ] as const;
};
