import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/schedule')({
  component: Schedule,
})

function Schedule() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">Schedule</h1>
      <p className="mt-4 text-sm text-white/80">View your upcoming schedule.</p>
    </div>
  )
}
