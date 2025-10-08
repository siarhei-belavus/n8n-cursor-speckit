# Contributing to n8n Cursor Speckit

Thank you for your interest in contributing! This project aims to provide a systematic approach to building production-ready n8n workflows.

## How to Contribute

### Reporting Issues

If you find a bug or have a suggestion:

1. Check if the issue already exists
2. Create a new issue with:
   - Clear description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - n8n version and environment details

### Suggesting Improvements

Have an idea for improvement?

1. Open an issue with the "enhancement" label
2. Describe the problem you're solving
3. Propose your solution
4. Share examples or mockups if applicable

### Contributing Code

#### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/yourusername/n8n-cursor-speckit.git
cd n8n-cursor-speckit

# Test the installation script
npm test
```

#### Making Changes

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style
   - Update documentation if needed
   - Add tests if applicable

4. **Test your changes**
   ```bash
   npm test
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

#### Commit Message Guidelines

We follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Maintenance tasks

Examples:
```
feat: add support for workflow decomposition
fix: installer fails on Windows
docs: update quick start guide
```

### Contributing Documentation

Documentation improvements are always welcome!

**Areas to improve:**
- Add more examples to USAGE_EXAMPLES.md
- Improve clarity in README.md
- Add troubleshooting guides
- Create video tutorials
- Translate to other languages

### Contributing Command Templates

Want to improve the cursor commands?

**Files to edit:**
- `.cursor/commands/n8n.*.md`

**Guidelines:**
- Keep commands focused and single-purpose
- Use clear, actionable language
- Include examples
- Test thoroughly before submitting

### Testing Your Changes

#### Test the Installer
```bash
npm test
```

#### Manual Testing
```bash
# Create test directory
mkdir test-project
cd test-project

# Test installation
node /path/to/n8n-cursor-speckit/install.js

# Verify commands appear in Cursor
cursor .
# Type /n8n. to see commands
```

#### Test Commands
1. Open test project in Cursor
2. Run each command: `/n8n.specify`, `/n8n.plan`, etc.
3. Verify expected outputs
4. Check for errors or inconsistencies

## Project Structure

```
n8n-cursor-speckit/
├── .cursor/commands/        # Cursor command definitions
│   ├── n8n.align.md
│   ├── n8n.analyze.md
│   ├── n8n.checklist.md
│   ├── n8n.clarify.md
│   ├── n8n.implement.md
│   ├── n8n.plan.md
│   └── n8n.specify.md
├── install.js               # Installation script
├── test-install.sh          # Installation test
├── package.json             # npm package configuration
├── README.md                # Main documentation
├── QUICK_START.md           # Quick start guide
├── USAGE_EXAMPLES.md        # Usage examples
├── CONTRIBUTING.md          # This file
├── LICENSE                  # MIT license
└── .gitignore              # Git ignore rules
```

## Development Workflow

### Adding a New Command

1. Create `.cursor/commands/n8n.newcommand.md`
2. Follow existing command structure
3. Update `FILES_TO_INSTALL` in `install.js`
4. Test installation
5. Update README.md with command documentation
6. Add usage example to USAGE_EXAMPLES.md

### Improving Existing Command

1. Edit the command file in `.cursor/commands/`
2. Test the command in Cursor
3. Update related documentation
4. Run installation test
5. Submit PR with clear description of changes

### Adding New Features to Installer

1. Edit `install.js`
2. Add tests to `test-install.sh`
3. Test on multiple platforms if possible
4. Update package.json if adding new scripts
5. Document new flags/options

## Code Style

### JavaScript (install.js)
- Use clear variable names
- Add comments for complex logic
- Handle errors gracefully
- Provide user-friendly messages
- Use colors to improve readability

### Markdown (commands, docs)
- Use clear headings
- Include code examples
- Use tables for structured data
- Add emojis sparingly for visual cues
- Keep line length reasonable

### Shell Scripts (test-install.sh)
- Use `set -e` for error handling
- Add comments for complex operations
- Echo status messages
- Clean up temporary files

## Pull Request Process

1. **Update documentation** - All code changes need docs updates
2. **Test thoroughly** - Run `npm test` and manual tests
3. **Small PRs** - Keep changes focused and reviewable
4. **Clear description** - Explain what and why
5. **Be patient** - Reviews may take time

### PR Checklist

- [ ] Code follows existing style
- [ ] Tests pass (`npm test`)
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] No breaking changes (or clearly marked)
- [ ] PR description is clear and complete

## Questions?

- Open an issue for questions
- Tag with "question" label
- Check existing issues first

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md (if we create one)
- Mentioned in release notes
- Thanked in the community

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Accept different viewpoints
- Show empathy

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to n8n Cursor Speckit!** 🎉

Your contributions help make n8n workflow development more systematic, reliable, and enjoyable for everyone.

