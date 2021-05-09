const core = require('@actions/core');
const github = require('@actions/github');
const tc = require('@actions/tool-cache');

try {
  const githubToken = core.getInput('token');
  const hdtTag = core.getInput('hdt-tag')
  const octokit = github.getOctokit(githubToken)

  const tagInfos = await octokit.repos.getReleaseByTag({
    owner: '',
    repo: 'hdt-cpp',
    tag: hdtTag
  });

  console.log(tagInfos);

  const hdtZipPath = await tc.downloadTool(tagInfos.zipball_url);
  const hdtExtractedFolder = await tc.extractZip(hdtZipPath, 'path/to/extract/to');
} catch (error) {
  core.setFailed(error.message);
}
