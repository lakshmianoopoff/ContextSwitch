import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { TestState } from '../types.js';

const execAsync = promisify(exec);

export async function captureTestResults(repoPath: string, runLive = false): Promise<TestState> {
  const pkgPath = path.join(repoPath, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    return { failing: [], passing: 0 };
  }

  let hasTestScript = false;
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    hasTestScript = Boolean(pkg.scripts && pkg.scripts.test && !pkg.scripts.test.includes('no test specified'));
  } catch {
    return { failing: [], passing: 0 };
  }

  if (!hasTestScript) {
    return { failing: [], passing: 0 };
  }

  // Look for any cached test run artifacts or run test if requested
  const testOutputFile = path.join(repoPath, '.test-output.log');
  let testOutput = '';

  if (runLive) {
    try {
      const { stdout, stderr } = await execAsync('npm test -- --runInBand --ci', {
        cwd: repoPath,
        timeout: 15000,
        env: { ...process.env, CI: 'true' },
      });
      testOutput = stdout + '\n' + stderr;
    } catch (error: any) {
      testOutput = (error.stdout || '') + '\n' + (error.stderr || '') + '\n' + (error.message || '');
    }
  } else if (fs.existsSync(testOutputFile)) {
    testOutput = fs.readFileSync(testOutputFile, 'utf8');
  }

  if (!testOutput) {
    return { failing: [], passing: 0 };
  }

  return parseTestOutput(testOutput);
}

export function parseTestOutput(output: string): TestState {
  const failingTests: string[] = [];
  let passingCount = 0;
  let diagnostics = '';

  const lines = output.split('\n');

  for (const line of lines) {
    // Match Jest/Vitest/Mocha failing test lines
    // e.g. "FAIL tests/webhook.test.ts" or "✕ should reject forged webhook signatures"
    if (line.includes('FAIL ') || line.includes('✕ ') || line.includes('failed:')) {
      const clean = line.replace(/FAIL |✕ |[●\s]+/g, ' ').trim();
      if (clean && clean.length > 3 && !failingTests.includes(clean)) {
        failingTests.push(clean);
      }
    }

    // Match passing counts
    // e.g. "Tests:  1 failed, 12 passed, 13 total" or "12 passing (450ms)"
    const passMatch = line.match(/(\d+)\s+pass(ed|ing)/i);
    if (passMatch) {
      passingCount = parseInt(passMatch[1], 10);
    }

    // Capture error diagnostics
    if (line.includes('AssertionError') || line.includes('Error: expected') || line.includes('InvalidSignatureError')) {
      if (!diagnostics) {
        diagnostics = line.trim();
      }
    }
  }

  return {
    failing: failingTests,
    passing: passingCount,
    diagnostics: diagnostics || undefined,
  };
}
