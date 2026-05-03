export default function Header({ title, subtitle }) {
  return (
    <div>
      <h1 className="text-[16px] font-semibold text-gray-900">{title}</h1>
      {subtitle && <p className="text-[13px] text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  )
}
