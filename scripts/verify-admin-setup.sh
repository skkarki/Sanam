#!/bin/bash

# Admin Panel Verification Script
# This script helps verify that the admin panel is set up correctly

echo "🔍 Verifying Admin Panel Setup..."
echo ""

# Check if .env file exists
if [ -f .env ]; then
    echo "✅ .env file found"
else
    echo "❌ .env file not found"
    echo "   Create .env with DATABASE_URL"
    exit 1
fi

# Check if DATABASE_URL is set
if grep -q "DATABASE_URL" .env; then
    echo "✅ DATABASE_URL configured"
else
    echo "❌ DATABASE_URL not found in .env"
    exit 1
fi

# Check if node_modules exists
if [ -d node_modules ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Dependencies not installed"
    echo "   Run: npm install"
    exit 1
fi

# Check if Prisma client is generated
if [ -d node_modules/.prisma/client ]; then
    echo "✅ Prisma client generated"
else
    echo "⚠️  Prisma client not generated"
    echo "   Run: npx prisma generate"
fi

# Check if required API routes exist
echo ""
echo "📁 Checking API Routes..."

routes=(
    "src/app/api/admin/categories/route.ts"
    "src/app/api/admin/categories/[id]/route.ts"
    "src/app/api/admin/brands/route.ts"
    "src/app/api/admin/brands/[id]/route.ts"
    "src/app/api/admin/products/route.ts"
    "src/app/api/admin/products/[id]/route.ts"
    "src/app/api/admin/inventory/route.ts"
    "src/app/api/admin/inventory/[id]/route.ts"
    "src/app/api/admin/customers/route.ts"
    "src/app/api/admin/customers/[id]/route.ts"
    "src/app/api/admin/orders/route.ts"
    "src/app/api/admin/orders/[id]/route.ts"
)

for route in "${routes[@]}"; do
    if [ -f "$route" ]; then
        echo "✅ $route"
    else
        echo "❌ $route missing"
    fi
done

# Check if required admin pages exist
echo ""
echo "📄 Checking Admin Pages..."

pages=(
    "src/app/admin/categories/page.tsx"
    "src/app/admin/brands/page.tsx"
    "src/app/admin/inventory/page.tsx"
    "src/app/admin/customers/page.tsx"
    "src/app/admin/orders/page.tsx"
)

for page in "${pages[@]}"; do
    if [ -f "$page" ]; then
        echo "✅ $page"
    else
        echo "❌ $page missing"
    fi
done

# Check if old files are removed
echo ""
echo "🗑️  Checking Removed Files..."

old_files=(
    "src/app/admin/categories-new.tsx"
    "src/app/admin/brands-new.tsx"
)

for file in "${old_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "✅ $file removed"
    else
        echo "⚠️  $file still exists (should be removed)"
    fi
done

echo ""
echo "📊 Setup Verification Complete!"
echo ""
echo "Next Steps:"
echo "1. Update database schema: cp prisma/schema-updated.prisma prisma/schema.prisma"
echo "2. Run migration: npx prisma migrate dev --name remove_coupons"
echo "3. Generate Prisma client: npx prisma generate"
echo "4. Start dev server: npm run dev"
echo "5. Test admin panel at: http://localhost:3000/admin"
echo ""
echo "📖 Read ADMIN_PANEL_GUIDE.md for detailed testing instructions"
