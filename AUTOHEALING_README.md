# AI Auto-Healing Test Automation POC

This repository demonstrates a proof-of-concept for AI-powered auto-healing test automation using the TodoMVC React application.

## 🎯 Overview

This POC implements an automated test pipeline that:
- Runs Cypress E2E tests on every push/PR
- Detects test failures automatically
- Triggers AI-powered analysis and fixes
- Creates pull requests with automated repairs

## 🏗️ Architecture

### GitHub Actions Workflows

1. **`cypress-e2e.yml`** - Main test execution workflow
   - Runs on push/PR to master/main
   - Scheduled daily monitoring at 2 AM UTC
   - Captures screenshots and videos on failure
   - Triggers auto-healing pipeline on failure

2. **`auto-healing.yml`** - AI-powered repair workflow
   - Activates when main test workflow fails
   - Downloads test artifacts (screenshots/videos)
   - Analyzes failure patterns
   - Generates AI-powered fixes
   - Creates pull requests with repairs

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- GitHub repository with Actions enabled

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm start

# Run E2E tests locally
npm run test:e2e

# Run unit tests
npm run test:unit
```

### GitHub Actions Setup
1. Fork this repository
2. Enable GitHub Actions in your repository settings
3. Push changes to trigger the workflow

## 🤖 Auto-Healing Integration Points

### Current Implementation
- ✅ GitHub Actions workflow setup
- ✅ Test failure detection
- ✅ Artifact collection (screenshots/videos)
- ✅ Automated PR creation

### Future AI Integrations
- [ ] **OpenAI API Integration**
  - Analyze test failure patterns
  - Generate natural language explanations
  - Suggest code fixes

- [ ] **Visual Regression AI**
  - Testim or Mabl integration
  - Screenshot comparison and repair
  - Layout change detection

- [ ] **Selector Intelligence**
  - Smart selector updates
  - Element change detection
  - Fallback selector strategies

- [ ] **Timing Optimization**
  - Dynamic wait strategies
  - Performance-based timeouts
  - Retry mechanism optimization

## 📊 Test Coverage

### E2E Tests
- **`tests/e2e/new-todo.spec.js`** - Basic todo creation test
- More tests can be added to `tests/e2e/` directory

### Unit Tests
- Component tests in `src/components/*/*.spec.js`
- Reducer tests in `src/store/reducers/*.spec.js`
- Selector tests in `src/store/selectors/*.spec.js`

## 🔧 Customization

### Adding New Tests
1. Create test files in `tests/e2e/`
2. Follow Cypress best practices
3. Include descriptive test names
4. Add appropriate assertions

### Modifying Auto-Healing Logic
1. Edit `.github/workflows/auto-healing.yml`
2. Add your AI service integration
3. Customize fix generation logic
4. Update PR creation templates

### Environment Variables
Add these to your repository secrets:
- `OPENAI_API_KEY` - For OpenAI integration
- `TESTIM_API_KEY` - For Testim integration
- `MABL_API_KEY` - For Mabl integration

## 📈 Monitoring

### GitHub Actions Dashboard
- View workflow runs in Actions tab
- Monitor test execution times
- Track auto-healing success rates

### Test Metrics
- Pass/fail ratios
- Auto-healing effectiveness
- Time to fix resolution

## 🛠️ Troubleshooting

### Common Issues
1. **Tests failing locally but passing in CI**
   - Check Node.js version compatibility
   - Verify dependency versions
   - Review environment differences

2. **Auto-healing not triggering**
   - Ensure workflow dependencies are correct
   - Check branch name matching
   - Verify workflow permissions

3. **PR creation failing**
   - Check GitHub token permissions
   - Verify branch protection rules
   - Review workflow syntax

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your improvements
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Original TodoMVC React implementation
- Cypress for E2E testing framework
- GitHub Actions for CI/CD automation
- AI/ML community for inspiration 