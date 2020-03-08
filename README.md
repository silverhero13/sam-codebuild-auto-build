# sam-codebuild-auto-build

This application automatically triggers a CodeBuild project everytime a pull request is created or updated in CodeCommit. It also comments the build details in the pull request for easier navigation.

This project is configured to use TypeScript, ESLint, and Prettier.

## Deploy the sample application

To use the SAM CLI, you need the following tools.

- SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- Node.js - [Install Node.js 12](https://nodejs.org/en/), including the NPM package management tool.
- Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)

Build the TypeScript code first by going to the app directory and running the build script:

```bash
cd app
npm run build
```

Go back to the project's root directory.

Build and deploy the application with the following commands:

```bash
sam build
sam deploy --guided
```

The first command will build the source of your application. The second command will package and deploy your application to AWS, with a series of prompts.
