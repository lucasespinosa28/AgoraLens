import CreateGroup from '@/components/groups/CreateGroup'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><CreateGroup /></div>
}
