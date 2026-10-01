import nextVitals from 'eslint-config-next/core-web-vitals'

const config = [
  ...nextVitals,
  { ignores: ['.next/**', 'node_modules/**', 'src/generated/**', 'next-env.d.ts'] },
]

export default config
