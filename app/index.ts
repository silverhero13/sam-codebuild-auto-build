import { CodeBuild, CodeCommit, config } from 'aws-sdk'
import * as Event from './testEvent.json'

config.update({ region: process.env.REGION })

const cb = new CodeBuild({ apiVersion: '2016-10-06' })
const cc = new CodeCommit({ apiVersion: '2015-04-13' })

const generateCodeBuildUrl = (
  region: string,
  projectName: string,
  buildId: string,
): string =>
  `https://${region}.console.aws.amazon.com/codesuite/codebuild/projects/${projectName}/build/${buildId}/log?region=${region}`

const handler = async (event: typeof Event): Promise<string> => {
  const codeBuildProject = process.env.CODE_BUILD_PROJECT_NAME
  const region = process.env.REGION

  if (!codeBuildProject) {
    return new Promise((resolve, reject) =>
      reject('Environment variable CODE_BUILD_PROJECT_NAME not defined'),
    )
  }

  if (!region) {
    return new Promise((resolve, reject) =>
      reject('Environment variable REGION not defined'),
    )
  }

  const {
    detail: { pullRequestId, sourceCommit, destinationCommit, repositoryNames },
  } = event

  const {
    build: { projectName: buildProject, id: buildId },
  } = await cb
    .startBuild({
      projectName: codeBuildProject,
      sourceVersion: sourceCommit,
    })
    .promise()

  await cc
    .postCommentForPullRequest({
      pullRequestId: pullRequestId,
      repositoryName: repositoryNames[0],
      beforeCommitId: destinationCommit,
      afterCommitId: sourceCommit,
      content: `[Build](${generateCodeBuildUrl(
        region,
        buildProject,
        buildId,
      )}) initiated for source ${sourceCommit.substring(0, 8)}`,
    })
    .promise()

  return new Promise(resolve => {
    resolve(
      `Build process initiated with the following details: ${JSON.stringify({
        pullRequest: {
          pullRequestId,
          sourceCommit,
          destinationCommit,
          repositoryName: repositoryNames[0],
        },
        build: { buildProject, buildId },
      })}`,
    )
  })
}

export { handler }
