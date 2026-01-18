# Skill: Unit Test Scaffolder

## Goal
Generate a unit test file for a given source code file, covering happy paths and edge cases.

## Instructions
1. Analyze the input file to understand its exported functions and classes.
2. Determine the testing framework in use (e.g., Jest for JS, Pytest for Python) by looking at `package.json` or existing tests.
3. Create a new test file named `<filename>.test.<ext>`.
4. Generate test cases for:
   - The "Happy Path" (expected valid input).
   - One common "Edge Case" (null input, empty arrays, etc.).
5. Mock external dependencies where possible.

## Constraints
- Do not implement complex integration logic; stick to unit isolation.
- Use descriptive test names (e.g., `should_return_error_when_input_is_null`).