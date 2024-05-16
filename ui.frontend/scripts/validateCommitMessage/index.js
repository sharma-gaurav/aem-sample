const fs = require('fs');
const path = require('path');

const pattern = /^(TicketID)-\d+ .*/;

const checkIfCommitMessageIsValid = (message) => {
  const MERGE_CONFLICT_INDICATOR = '# Conflicts:';
  const isResolutionOfMergeConflict = message.includes(MERGE_CONFLICT_INDICATOR);
  if (isResolutionOfMergeConflict) {
    return true;
  }
  return pattern.test(message);
};

const COMMIT_MESSAGE_FILE_FLAG = '--commit-message-file';

const commitMessageFileFlagIndex = process.argv.findIndex((arg) => arg === COMMIT_MESSAGE_FILE_FLAG);
const commitMessageFilePath = process.argv[commitMessageFileFlagIndex + 1];

const gitRootDir = __dirname + '/../../../';
const commitMessageFile = path.normalize(gitRootDir + '/' + commitMessageFilePath);
const commitMessage = fs.readFileSync(commitMessageFile, 'utf8').trim();

const isCommitMessageValid = checkIfCommitMessageIsValid(commitMessage);

if (!isCommitMessageValid) {
  console.log(
    '\n\nCommit message should start with TicketID-[ID with only digits]. Example: TicketID-3240 changing name of field X'
  );

  process.exit(1);
}
