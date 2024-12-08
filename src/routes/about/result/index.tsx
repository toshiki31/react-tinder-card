import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about/result/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/about/result/tsx/"!</div>
}
