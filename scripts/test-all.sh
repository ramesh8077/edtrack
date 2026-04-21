    #!/bin/bash
# save as scripts/test-all.sh
set -e

echo "🧪 Running full test suite..."

echo "→ Type checking..."
npm run typecheck

echo "→ Linting..."
npm run lint

echo "→ Format check..."
npm run format:check

echo "→ Unit tests..."
npm test -- run

echo "→ Build..."
npm run build

echo "→ E2E tests..."
npm run test:e2e

echo "→ Security audit..."
npm audit --prod --audit-level=high

echo "→ Bundle size check..."
du -sh .next/static/chunks/*.js | awk '$1 ~ /M/ && $1+0 > 0.3 {print "⚠️  Large chunk:", $0}'

echo "✅ All checks passed! Ready to deploy."
