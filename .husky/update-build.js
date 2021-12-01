(async () => {
  const fs = require('fs')
  const { exec } = require('child_process')
  const buildJson = require('../build.json')

  await checkGitConnection()
  buildJson.build++
  await writeBuild()
  await addBuildFileToGit()

  console.log('application updated to', buildJson.build, 'build ')

  function checkGitConnection () {
    return new Promise((resolve, reject) => {
      exec('git remote show origin', (e, stdout, stderr) => {
        if (e) return reject(e)
        if (stderr) return reject(stderr)
        return resolve(stdout)
      })
    })
  }

  function writeBuild () {
    return new Promise((resolve, reject) => {
      fs.writeFile('./build.json', JSON.stringify(buildJson), e => {
        if (e) return reject(e)
        return resolve()
      })
    })
  }

  function addBuildFileToGit () {
    return new Promise((resolve, reject) => {
      exec('git add ./build.json', (e, stdout, stderr) => {
        if (e) return reject(e)
        if (stderr) return reject(stderr)
        return resolve(stdout)
      })
    })
  }
})()
