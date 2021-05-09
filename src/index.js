const core = require('@actions/core')
const github = require('@actions/github')
const tc = require('@actions/tool-cache')
const path = require('path')

async function run() {
  try {
    const githubToken = core.getInput('token')
    const hdtTag = core.getInput('hdt-tag')
    const octokit = github.getOctokit(githubToken)

    core.info('Fetching release information from rdfhdt/hdt-cpp')
    const tagInfos = await octokit.repos.getReleaseByTag({
      owner: 'rdfhdt',
      repo: 'hdt-cpp',
      tag: hdtTag
    })

    core.startGroup(`Downloading HDT release ${hdtTag}`)
    core.info(`Downloading release for tag ${tagInfos.data.tag_name}`)
    // TODO use generic infos provided by GitHub for computing the zipball download link
    const hdtZipPath = await tc.downloadTool(`https://codeload.github.com/rdfhdt/hdt-cpp/zip/${tagInfos.data.tag_name}`)

    core.info(`Extracting HDT release ${hdtTag}`)

    let targetLocation = `./${tagInfos.data.tag_name}`
    // if required, use 'source-path' as the target for extrating the zipball,
    if (core.getInput('source-path') !== 'null') {
      targetLocation = core.getInput('source-path')
    }

    const hdtExtractedFolder = await tc.extractZip(hdtZipPath, targetLocation)
    const sourcePath = path.resolve(hdtExtractedFolder)
    core.info(`HDT source files successfully extracted to ${sourcePath}`)
    core.endGroup()

    core.setOutput('source-path', sourcePath)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
