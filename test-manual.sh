#!/bin/bash

# Manual test script for interactive installation
# This creates a test project and walks through the installation

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
TEST_DIR="$SCRIPT_DIR/manual-test-project"

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Manual Installation Test                     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}\n"

# Cleanup old test directory
if [ -d "$TEST_DIR" ]; then
  echo -e "${YELLOW}Removing old test directory...${NC}"
  rm -rf "$TEST_DIR"
fi

echo -e "${BLUE}Test directory: $TEST_DIR${NC}\n"

# Run installer (will prompt for directory)
echo -e "${GREEN}Running installer...${NC}"
echo -e "${YELLOW}When prompted, enter: $TEST_DIR${NC}\n"

node "$SCRIPT_DIR/install.js"

# Verify
echo -e "\n${BLUE}Verifying installation...${NC}"

if [ -d "$TEST_DIR/.cursor/commands" ]; then
  echo -e "${GREEN}✓${NC} .cursor/commands directory created"
  echo -e "  Files: $(ls -1 $TEST_DIR/.cursor/commands | wc -l | tr -d ' ')"
else
  echo -e "${RED}✗${NC} .cursor/commands not found"
fi

if [ -d "$TEST_DIR/.specify" ]; then
  echo -e "${GREEN}✓${NC} .specify directory created"
else
  echo -e "${YELLOW}⚠${NC} .specify directory not found (may be optional)"
fi

echo -e "\n${BLUE}Files in test directory:${NC}"
tree -L 2 "$TEST_DIR" 2>/dev/null || find "$TEST_DIR" -maxdepth 2 -type f

echo -e "\n${YELLOW}Test directory preserved at: $TEST_DIR${NC}"
echo -e "${YELLOW}To clean up: rm -rf $TEST_DIR${NC}\n"

