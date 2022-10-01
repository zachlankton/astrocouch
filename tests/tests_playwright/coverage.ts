const v8toIstanbul = require("v8-to-istanbul");
import * as fs from "fs";
import * as path from "path";

export default function init_coverage(test) {
  test.beforeEach(async ({ page, browserName }) => {
    if (browserName !== "chromium") return;
    await page.coverage.startJSCoverage();
  });

  test.afterEach(
    async ({ page, browserName }, { file, line, column, workerIndex }) => {
      if (browserName !== "chromium") return;
      const coverage = await page.coverage.stopJSCoverage();
      for (const [index, entry] of coverage.entries()) {
        // the coverage object has a lot of files in it
        // skipping ones we are not interested in covering
        const { pathname } = new URL(entry.url);
        if (!pathname.startsWith(`/@fs${process.cwd()}/INSTRUMENTED_SRC`))
          continue;

        // Using v8toInstanbul library to convert the covereage format
        const converter = v8toIstanbul(
          // normalize the path name to use the relative path
          "." + pathname.replace(`/@fs${process.cwd()}`, ""),
          0,
          { source: entry.source }
        );
        await converter.load();
        converter.applyCoverage(entry.functions);

        // saving the file, playwright will run tests async
        // this means we need a way to deal with concurrency
        // here we
        const baseFile = path.basename(file);
        const fileName = `${baseFile}-${line}-${column}-${workerIndex}-${index}.json`;
        fs.appendFileSync(
          "merge-coverage/" + fileName,
          JSON.stringify(converter.toIstanbul())
        );
      }
    }
  );
}
