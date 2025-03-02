#!/bin/bash

# Build the web component
echo "Building destinations web component..."

# Ensure dist directory exists
mkdir -p dist

# Run TypeScript compiler
pnpm run build:wc

# Ensure the compilation succeeded before continuing
if [ $? -ne 0 ]; then
  echo "Error: TypeScript compilation failed"
  exit 1
fi

# Copy data file
echo "Copying data files..."
cp -r src/data dist/

# Create a package.json for the dist folder
echo "Creating package.json in dist folder..."
cat > dist/package.json << EOF
{
  "name": "destinations-wc",
  "version": "0.1.0",
  "main": "index.js",
  "types": "index.d.ts",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "three": "^0.160.0",
    "@react-three/fiber": "^8.15.16",
    "@react-three/drei": "^9.96.4",
    "three-stdlib": "^2.35.14"
  }
}
EOF

echo "Done building web component!" 