import { createFileRoute } from '@tanstack/react-router'
import { Banner } from '../../pages/Banner'

export const Route = createFileRoute('/banner/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Banner />
}
