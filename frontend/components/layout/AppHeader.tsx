'use client';

import {
  Header,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderMenuButton,
} from '@carbon/react';
import { Switcher, Asleep, Awake } from '@carbon/icons-react';
import { useTheme } from '../theme/ThemeProvider';

interface AppHeaderProps {
  onMenuClick: () => void;
}

export default function AppHeader({ onMenuClick }: AppHeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Header aria-label="Closet Whisperer">
      <HeaderMenuButton
        aria-label="Open menu"
        onClick={onMenuClick}
        isActive={false}
      />
      <HeaderName href="/" prefix="">
        Closet Whisperer
      </HeaderName>
      <HeaderGlobalBar>
        <HeaderGlobalAction
          aria-label={theme === 'white' ? 'Switch to dark mode' : 'Switch to light mode'}
          onClick={toggleTheme}
          tooltipAlignment="end"
        >
          {theme === 'white' ? <Asleep size={20} /> : <Awake size={20} />}
        </HeaderGlobalAction>
        <HeaderGlobalAction aria-label="App settings" tooltipAlignment="end">
          <Switcher size={20} />
        </HeaderGlobalAction>
      </HeaderGlobalBar>
    </Header>
  );
}
