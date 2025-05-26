import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'

import type { QueryClient } from '@tanstack/react-query'

import { ThemeProvider } from '@/components/theme-provider.tsx'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu.tsx'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="p-8 space-y-8">
          <NavigationMenu>
            <NavigationMenuList>
              <Link to={'/'}>
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    AdaKeys.com
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </Link>
              <Link
                to={'/keys'}
                search={{
                  style: 'ae2td',
                }}
              >
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Icarus-Style (Ae2td)
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </Link>
              <Link
                to={'/keys'}
                search={{
                  style: 'addr1',
                }}
              >
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Shelley-Era (Addr1)
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </Link>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="px-4  ">
            <Outlet />
          </div>
        </div>
      </ThemeProvider>
      <TanStackRouterDevtools />

      <TanStackQueryLayout />
    </>
  ),
})
