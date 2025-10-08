#!/bin/bash

# Test installation script for n8n Cursor Speckit
# This script creates a temporary directory, installs the speckit, and verifies installation

set -e  # Exit on error

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     n8n Cursor Speckit - Installation Test    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}\n"

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Create temporary test directory
TEST_DIR="$SCRIPT_DIR/test-install-$(date +%s)"
echo -e "${YELLOW}Creating test directory: $TEST_DIR${NC}"
mkdir -p "$TEST_DIR"

# Function to cleanup on exit
cleanup() {
  echo -e "\n${YELLOW}Cleaning up test directory...${NC}"
  rm -rf "$TEST_DIR"
}
trap cleanup EXIT

# Change to test directory
cd "$TEST_DIR"

# Test installation
echo -e "\n${BLUE}Testing installation...${NC}"
echo "yes" | node "$SCRIPT_DIR/install.js" --skip-optional

# Verify files were created
echo -e "\n${BLUE}Verifying installation...${NC}"

EXPECTED_FILES=(
  ".cursor/commands/n8n.align.md"
  ".cursor/commands/n8n.analyze.md"
  ".cursor/commands/n8n.checklist.md"
  ".cursor/commands/n8n.clarify.md"
  ".cursor/commands/n8n.implement.md"
  ".cursor/commands/n8n.plan.md"
  ".cursor/commands/n8n.specify.md"
)

ALL_FOUND=true

for file in "${EXPECTED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} Found: $file"
  else
    echo -e "${RED}✗${NC} Missing: $file"
    ALL_FOUND=false
  fi
done

# Test --force flag
echo -e "\n${BLUE}Testing --force flag...${NC}"
echo "yes" | node "$SCRIPT_DIR/install.js" --force --skip-optional > /dev/null 2>&1

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓${NC} Force installation works"
else
  echo -e "${RED}✗${NC} Force installation failed"
  ALL_FOUND=false
fi

# Final result
echo -e "\n${BLUE}════════════════════════════════════════════════${NC}"
if [ "$ALL_FOUND" = true ]; then
  echo -e "${GREEN}✓ All tests passed!${NC}"
  echo -e "${GREEN}✓ Installation script works correctly${NC}"
  exit 0
else
  echo -e "${RED}✗ Some tests failed${NC}"
  exit 1
fi

