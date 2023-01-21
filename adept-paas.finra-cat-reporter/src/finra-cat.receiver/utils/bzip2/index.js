const { exec }                          = require("child_process");

function cmd(_cmd, _opts) {
  _opts || (_opts = {});
  return new Promise((resolve, reject) => {
      const child = exec(_cmd, _opts,
          (err, stdout, stderr) => err ? reject(err) : resolve({
              stdout: stdout,
              stderr: stderr
          }));

      if (_opts.stdout) {
          child.stdout.pipe(_opts.stdout);
      }
      if (_opts.stderr) {
          child.stderr.pipe(_opts.stderr);
      }
  });
}

const compress = async (file) => {
  return await cmd(`bzip2 -k ${file}`);
};

const decompress = async (file) => {
  return await cmd(`bzip2 -fdk ${file}`);
};

module.exports = {
  compress,
  decompress,
};
