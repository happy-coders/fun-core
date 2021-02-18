import * as fs from 'fs';
import {
  matcherHint,
  MatcherHintOptions,
  printExpected,
  printReceived,
} from 'jest-matcher-utils';

function hintMessage(
  matcherName: string,
  expected: any,
  received: any,
  options?: MatcherHintOptions,
) {
  return (
    matcherHint(matcherName, undefined, undefined, options) +
    '\n\n' +
    `Expected: ${printExpected(expected)}\n` +
    `Received: ${printReceived(received)}`
  );
}

export function registerFsMatchers() {
  expect.extend({
    toHaveFileContent(path: string, expectedContent: string) {
      let receivedContent = fs.readFileSync(path).toString();
      let isSameContent = Object.is(receivedContent, expectedContent);

      const message = hintMessage(
        'toHaveFileContent',
        expectedContent,
        receivedContent,
        {
          isNot: this.isNot,
          promise: this.promise,
        },
      );

      return {
        message: () => message,
        pass: isSameContent,
      };
    },

    toHaveBeenCreatedFile(path: string) {
      const exists = fs.existsSync(path);

      return {
        message: () => `Failed asserting file exists in path "${path}"`,
        pass: exists,
      };
    },
  });
}
