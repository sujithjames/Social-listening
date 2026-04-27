export default function Header({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
      {subtitle && <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>}
    </div>
  )
}
