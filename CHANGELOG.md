5.0.0 / 2019-07-04
------------------

- travis: update node versions (#205)
- Refactor buffer constructor (#200)
- lib: fix for negative numbers: imuln, modrn, idivn (#185)
- bn: fix Red#imod (#178)
- check unexpected high bits for invalid characters (#173)
- document support very large integers (#158)
- only define toBuffer if Buffer is defined (#172)
- lib: better validation of string input (#151)
- tests: reject decimal input in constructor (#91)
- bn: make .strip() an internal method (#105)
- lib: deprecate `.modn()` introduce `.modrn()`  (#112 #129 #130)
- bn: don't accept invalid characters (#141)
- package: use `files` insteadof `.npmignore`  (#152)
- bn: improve allocation speed for buffers (#167)
- toJSON to default to interoperable hex (length % 2) (#164)
