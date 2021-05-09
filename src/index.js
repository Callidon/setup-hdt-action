const core = require('@actions/core');
const github = require('@actions/github');
const tc = require('@actions/tool-cache');

async function run() {
  try {
    const githubToken = core.getInput('token')
    const hdtTag = core.getInput('hdt-tag')
    const octokit = github.getOctokit(githubToken)

    core.startGroup(`Downloading HDT release ${hdtTag}`)
  
    const tagInfos = await octokit.repos.getReleaseByTag({
      owner: 'rdfhdt',
      repo: 'hdt-cpp',
      tag: hdtTag
    })
  
    core.info(JSON.stringify(tagInfos))
  
    const hdtZipPath = await tc.downloadTool(tagInfos.zipball_url);
    core.endGroup()

    core.startGroup(`Extracting HDT release ${hdtTag} to ???`)
    const hdtExtractedFolder = await tc.extractZip(hdtZipPath, './')

    core.endGroup()

    console.log(hdtExtractedFolder)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
