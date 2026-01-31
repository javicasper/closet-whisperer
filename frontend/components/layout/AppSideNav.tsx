'use client';

import { usePathname } from 'next/navigation';
import {
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
} from '@carbon/react';
import {
  Home,
  Image,
  Clean,
  ConnectionSignal,
  Catalog,
} from '@carbon/icons-react';

interface AppSideNavProps {
  isOpen: boolean;
}

export default function AppSideNav({ isOpen }: AppSideNavProps) {
  const pathname = usePathname();

  return (
    <SideNav
      aria-label="Side navigation"
      isRail
      expanded={isOpen}
      isChildOfHeader={false}
      isPersistent={false}
    >
      <SideNavItems>
        <SideNavLink
          renderIcon={Home}
          href="/"
          isActive={pathname === '/'}
        >
          Home
        </SideNavLink>
        <SideNavLink
          renderIcon={Catalog}
          href="/closet"
          isActive={pathname === '/closet'}
        >
          My Closet
        </SideNavLink>
        <SideNavLink
          renderIcon={Image}
          href="/outfits"
          isActive={pathname === '/outfits'}
        >
          Outfits
        </SideNavLink>
        <SideNavLink
          renderIcon={ConnectionSignal}
          href="/builder"
          isActive={pathname === '/builder'}
        >
          Outfit Builder
        </SideNavLink>
        <SideNavLink
          renderIcon={Clean}
          href="/laundry"
          isActive={pathname === '/laundry'}
        >
          Laundry
        </SideNavLink>
      </SideNavItems>
    </SideNav>
  );
}
