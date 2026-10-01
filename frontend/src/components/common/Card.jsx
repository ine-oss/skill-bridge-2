export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`card-surface p-5 ${className}`} {...props}>
      {children}
    </div>
  )
}
