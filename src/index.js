const cache = require('@actions/cache');
const core = require('@actions/core');
const github = require('@actions/github');
const tc = require('@actions/tool-cache');
const path = require('path');

async function run() {
  try {
    const githubToken = core.getInput('token');
    const hdtTag = core.getInput('hdt-tag');
    let targetSourceLocation = core.getInput('source-path');
    const octokit = github.getOctokit(githubToken);

    core.info('Fetching release information from rdfhdt/hdt-cpp');
    const tagInfos = await octokit.repos.getReleaseByTag({
      owner: 'rdfhdt',
      repo: 'hdt-cpp',
      tag: hdtTag,
    });

    const sourcesCacheKey = `rdfhdt-hdt-cpp-sources-${tagInfos.data.tag_name}`;
    if (targetSourceLocation === 'null') {
      targetSourceLocation = `./${tagInfos.data.tag_name}`;
    }
    const sourcesCachePaths = [path.resolve(targetSourceLocation)];

    // try to find the sources in the cache, otherwise download them
    const existingCacheKey = await cache.restoreCache(sourcesCachePaths, sourcesCacheKey);
    if (existingCacheKey === undefined) {
      core.startGroup(`Downloading HDT release ${tagInfos.data.tag_name}`);
      core.info(`Downloading release for tag ${tagInfos.data.tag_name}`);
      // TODO use generic infos provided by GitHub for computing the zipball download link
      const hdtZipPath = await tc.downloadTool(`https://codeload.github.com/rdfhdt/hdt-cpp/zip/${tagInfos.data.tag_name}`);

      core.info(`Extracting HDT release ${tagInfos.data.tag_name}`);

      const hdtExtractedFolder = await tc.extractZip(hdtZipPath, targetSourceLocation);
      const sourcePath = path.resolve(hdtExtractedFolder);
      core.info(`HDT source files successfully extracted to ${sourcePath}`);
      core.endGroup();
      core.setOutput('source-path', sourcePath);
    } else {
      core.info(`Found a cache entry for HDT version ${tagInfos.data.tag_name}, skipping download`);
      core.info(`Restoring HDT version from cache to ${sourcesCachePaths[0]}`);
      core.setOutput('source-path', sourcesCachePaths[0]);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
