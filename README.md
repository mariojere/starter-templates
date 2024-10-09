# Capsule Starter Templates

This repository provides minimal starter templates for integrating Capsule into various frameworks and environments.
Each template folder is designed to be used as a starting point for your project, providing a basic setup with the
Capsule client initialized.

## Available Templates

- `with-react-native`
- More Coming Soon!

## Template Structure

Each template in this repository follows a consistent structure:

1. Basic project setup for the respective framework
2. Capsule client initialization
3. A simple "Hello World" component that displays the Capsule API key and environment

## Features

- Barebones setup for quick start
- Capsule client class creation
- Minimal "Hello World" output
- Pre-configured polyfills, shims, or configurations for passkeys (where applicable)

## Usage

1. Clone this repository:

   ```
   git clone https://github.com/your-org/capsule-starter-templates.git
   ```

2. Copy the desired template folder to your project location:

   ```
   cp -r capsule-starter-templates/with-react my-new-project
   ```

3. Navigate to your new project directory:

   ```
   cd my-new-project
   ```

4. Install dependencies:

   ```
   npm install
   ```

5. Run the development server:

   ```
   npm run dev
   ```

6. Open the application in your browser or emulator to see the Capsule client information.

## Important Notes

- Each template folder is meant to be used independently as a starting point for your project.
- These templates provide only the basic setup for Capsule integration.
- There is no additional UI or usage of the Capsule client for authentication or signing.
- The templates are intended as starting points and should be built upon for your specific use case.

## Support

For questions or issues related to Capsule integration, please refer to the
[Capsule documentation](https://docs.usecapsule.org) or open an issue in this repository.
