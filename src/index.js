const core = require('@actions/core')
const github = require('@actions/github')
const tc = require('@actions/tool-cache')
const path = require('path')

async function run() {
  try {
    const githubToken = core.getInput('token')
    const hdtTag = core.getInput('hdt-tag')
    const octokit = github.getOctokit(githubToken)

    core.startGroup(`Downloading HDT release ${hdtTag}`)
    core.info('Fetching release information from rdfhdt/hdt-cpp')
  
    const tagInfos = await octokit.repos.getReleaseByTag({
      owner: 'rdfhdt',
      repo: 'hdt-cpp',
      tag: hdtTag
    })

    core.info(`Downloading release for tag ${tagInfos.data.tag_name}`)
    const hdtZipPath = await tc.downloadTool(`https://codeload.github.com/rdfhdt/hdt-cpp/zip/${tagInfos.data.tag_name}`)

    core.info(`Extracting HDT release ${hdtTag}`)
    const hdtExtractedFolder = await tc.extractZip(hdtZipPath, `./${tagInfos.data.tag_name}`)
    core.info(`HDT source files successfully extracted to ${hdtExtractedFolder}`)
    core.endGroup()

    core.setOutput('source-path', path.resolve(hdtExtractedFolder))
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
