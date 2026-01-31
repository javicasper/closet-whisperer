# Contributing to Closet Whisperer

Thank you for considering contributing to Closet Whisperer! 🎉

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (OS, Node version, etc.)

### Suggesting Features

Feature suggestions are welcome! Please open an issue describing:
- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered
- Mockups or examples if applicable

### Pull Requests

1. **Fork the repository**

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation

4. **Commit with conventional commits**
   ```
   feat: add new feature
   fix: resolve bug in component
   docs: update README
   test: add tests for service
   refactor: restructure component
   style: format code
   chore: update dependencies
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe what you changed and why
   - Reference any related issues
   - Add screenshots for UI changes

## Development Setup

See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed setup instructions.

## Code Style

### TypeScript
- Use TypeScript strict mode
- Prefer functional components in React
- Use async/await over promises
- Document complex logic with comments

### Naming Conventions
- Components: PascalCase (`GarmentCard.tsx`)
- Files: kebab-case (`garments.store.ts`)
- Functions: camelCase (`getGarments()`)
- Constants: UPPER_SNAKE_CASE (`API_URL`)

### Testing
- Write tests for new features
- Maintain test coverage above 70%
- Use descriptive test names

## Project Structure

- `backend/` - Fastify API server
- `frontend/` - Next.js frontend
- `docker/` - Docker configurations
- `scripts/` - Utility scripts

## Questions?

Feel free to open an issue for any questions or join discussions!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
