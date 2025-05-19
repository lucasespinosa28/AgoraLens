import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Sidebar, SidebarMobile } from '@/components/ui/sidebar'

export const Route = createRootRoute({
  component: () => (
    <>
      <Sidebar />
      <div className="md:pl-64">
        <SidebarMobile />
        <hr />
        <Outlet />
        <TanStackRouterDevtools />
      </div>
    </>
  ),
})