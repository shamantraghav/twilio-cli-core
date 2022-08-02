const core = require('@actions/core');
const { Octokit } = require("@octokit/core");


/**
 * Functionality from tubone24/update_release.
 * Link: https://github.com/tubone24/update_release
 */
const updateRelease = async () => {
  try {
    console.log("test 1");
    const octokit = new Octokit({
      auth: process.env.REPO_ACCESS_TOKEN
    })
    console.log("test 2");
    const [owner, repo] = process.env.REPO_NAME ? process.env.REPO_NAME.split('/') : [null, null];
    console.log("test 3");
    const tag = process.env.TAG_NAME;
    console.log("test 4");
    const getReleaseResponse = await octokit.request('GET /repos/{owner}/{repo}/releases/tags/{tag}',{
      owner,
      repo,
      tag,
    });
    console.log("test 5");
    console.log("getReleaseResponse:"+ getReleaseResponse);

    const {
      data: {
        id: oldReleaseId,
        html_url: oldHtmlUrl,
        upload_url: oldUploadUrl,
        body: oldBody,
        draft: oldDraft,
        name: oldName,
        prerelease: oldPrerelease,
      },
    } = getReleaseResponse;

    core.info(`Got release info: '${oldReleaseId}', ${oldName}, '${oldHtmlUrl}', '${oldUploadUrl},'`);
    core.info(`Body: ${oldBody}`);
    core.info(`Draft: ${oldDraft}, Prerelease: ${oldPrerelease}`);

    const newBody = process.env.RELEASE_BODY;
    const newPrerelease = process.env.PRE_RELEASE;

    let body;
    if (newBody === '') {
      body = oldBody;
    } else {
      body = `${oldBody}\n${newBody}`;
    }

    let prerelease;
    if (newPrerelease !== '' && Boolean(newPrerelease)) {
      prerelease = newPrerelease === 'true';
    } else {
      prerelease = oldPrerelease;
    }

    await octokit.request('PATCH /repos/{owner}/{repo}/releases/{release_id}',{
      owner,
      release_id: oldReleaseId,
      repo,
      body,
      name: oldName,
      draft: oldDraft,
      prerelease,
    });

    core.info(`Updated release with body: ${body}`);
  } catch (error) {
    console.log(error);
    core.setFailed(error.message);
  }
};


updateRelease();
module.exports = {
  updateRelease,
};
