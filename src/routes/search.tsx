import Search from '@/components/groups/Search'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/search')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><Search/></div>
}
