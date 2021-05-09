const core = require('@actions/core');
const github = require('@actions/github');
const tc = require('@actions/tool-cache');
const glob = require('@actions/glob');

async function run() {
  try {
    const githubToken = core.getInput('token')
    const hdtTag = core.getInput('hdt-tag')
    const octokit = github.getOctokit(githubToken)

    core.startGroup(`Downloading HDT release ${hdtTag}`)
    core.info('Fetching release information')
  
    const tagInfos = await octokit.repos.getReleaseByTag({
      owner: 'rdfhdt',
      repo: 'hdt-cpp',
      tag: hdtTag
    })
  
    const hdtZipPath = await tc.downloadTool(`https://codeload.github.com/rdfhdt/hdt-cpp/zip/${tagInfos.data.tag_name}`);
    core.endGroup()

    core.startGroup(`Extracting HDT release ${hdtTag} to ./`)
    const hdtExtractedFolder = await tc.extractZip(hdtZipPath, `./${tagInfos.data.tag_name}`)

    core.endGroup()

    console.log(hdtExtractedFolder)

    const patterns = ['./', hdtExtractedFolder]
    const globber = await glob.create(patterns.join('\n'))
    const files = await globber.glob()
    console.log(files);
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
