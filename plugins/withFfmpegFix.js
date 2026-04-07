const { withProjectBuildGradle } = require('@expo/config-plugins');

/**
 * FFmpegKit binaries are retired and removed from some repos.
 * This plugin adds the working Maven Snapshot repository to ensure the build can find the artifacts.
 */
const withFfmpegFix = (config) => {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents = addMavenRepo(config.modResults.contents);
    } else {
      console.warn('withFfmpegFix: Only Groovy build.gradle is supported currently.');
    }
    return config;
  });
};

function addMavenRepo(buildGradle) {
  const mavenRepo = `        maven { url 'https://central.sonatype.com/repository/maven-snapshots/' }`;
  
  if (buildGradle.includes(mavenRepo)) {
    return buildGradle;
  }

  // repositories { internal bloğuna ekle
  return buildGradle.replace(
    /repositories\s*{/,
    `repositories {\n${mavenRepo}`
  );
}

module.exports = withFfmpegFix;
