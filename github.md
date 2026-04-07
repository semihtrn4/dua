Run eas build --platform android --profile apk --local --non-interactive --output=duarecorder.apk
Resolved "production" environment for the build. Learn more: https://docs.expo.dev/eas/environment-variables/#setting-the-environment-for-your-builds
No environment variables with visibility "Plain text" and "Sensitive" found for the "production" environment on EAS.

✔ Using remote Android credentials (Expo server)
✔ Using Keystore from configuration: Build Credentials Jm9zmFxiGT (default)
- Computing project fingerprint
✔ Computed project fingerprint
npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
npm warn deprecated rimraf@2.4.5: Rimraf versions prior to v4 are no longer supported
npm warn deprecated lodash.get@4.4.2: This package is deprecated. Use the optional chaining (?.) operator instead.
npm warn deprecated glob@6.0.4: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
npm warn deprecated @xmldom/xmldom@0.7.13: this version has critical issues, please update to the latest version
npm warn deprecated tar@7.5.7: Old versions of tar are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
[SETUP_WORKINGDIR] Preparing workingdir /tmp/runner/eas-build-local-nodejs/7bd0b88f-7cb0-4b95-b7de-86cdba61f56f
[START_BUILD] Starting build
  "job": {
    "type": "managed",
    "platform": "android",
    "projectRootDirectory": ".",
    "projectArchive": {
      "type": "PATH",
      "path": "/tmp/runner/eas-cli-nodejs/b45c14c9-a1fa-4eeb-968a-ee42580a117c.tar.gz"
    },
    "builderEnvironment": {
      "env": {}
    },
    "cache": {
      "disabled": false,
      "paths": [],
      "clear": false
    },
    "updates": {},
    "gradleCommand": ":app:assembleRelease",
    "buildType": "apk",
    "username": "semihtrn4",
    "version": {
      "versionCode": "1"
    },
    "experimental": {},
    "mode": "build",
    "triggeredBy": "EAS_CLI",
    "appId": "63286894-6a58-4277-94be-cfd2a5824c52",
    "initiatingUserId": "05109c7f-27d0-43ef-9434-0c31d770ba66"
  }
Local build, skipping project archive refresh
[READ_EAS_JSON] Using eas.json:
[READ_EAS_JSON] {
  "cli": {
    "version": ">= 12.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {},
    "apk": {
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    }
  },
  "submit": {
    "production": {}
  }
}

[READ_PACKAGE_JSON] Using package.json:
[READ_PACKAGE_JSON] {
  "name": "expo-app",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "scripts": {
    "start": "bunx rork start -p 7vgd7zpmmbzgcs818c1xc --tunnel",
    "start-web": "bunx rork start -p 7vgd7zpmmbzgcs818c1xc --web --tunnel",
    "start-web-dev": "DEBUG=expo* bunx rork start -p 7vgd7zpmmbzgcs818c1xc --web --tunnel",
    "lint": "expo lint"
  },
  "dependencies": {
    "@expo/vector-icons": "^15.0.3",
    "@nkzw/create-context-hook": "^1.1.0",
    "@react-native-async-storage/async-storage": "2.2.0",
    "@react-native-community/slider": "5.0.1",
    "@rork-ai/toolkit-sdk": "^0.2.51",
    "@sheehanmunim/react-native-ffmpeg": "6.0.3",
    "@stardazed/streams-text-encoding": "^1.0.2",
    "@tanstack/react-query": "^5.83.0",
    "@ungap/structured-clone": "^1.3.0",
    "expo": "~54.0.33",
    "expo-av": "~16.0.8",
    "expo-blur": "~15.0.8",
    "expo-camera": "~17.0.10",
    "expo-constants": "~18.0.13",
    "expo-file-system": "~19.0.21",
    "expo-font": "~14.0.11",
    "expo-haptics": "~15.0.8",
    "expo-image": "~3.0.11",
    "expo-image-picker": "~17.0.10",
    "expo-linear-gradient": "~15.0.8",
    "expo-linking": "~8.0.11",
    "expo-location": "~19.0.8",
    "expo-media-library": "~18.2.1",
    "expo-router": "~6.0.23",
    "expo-splash-screen": "~31.0.13",
    "expo-status-bar": "~3.0.9",
    "expo-symbols": "~1.0.8",
    "expo-system-ui": "~6.0.9",
    "expo-web-browser": "~15.0.10",
    "lucide-react-native": "^0.475.0",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.5",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-reanimated": "~4.1.1",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-svg": "15.12.1",
    "react-native-web": "^0.21.0",
    "zustand": "^5.0.2"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@expo/ngrok": "^4.1.0",
    "@types/jest": "^30.0.0",
    "@types/react": "~19.1.10",
    "eslint": "^9.31.0",
    "eslint-config-expo": "~10.0.0",
    "fast-check": "^4.6.0",
    "jest": "^30.3.0",
    "jest-expo": "^55.0.14",
    "ts-jest": "^29.4.9",
    "typescript": "~5.9.2"
  },
  "overrides": {
    "axios": "1.13.2"
  },
  "private": true
}
[INSTALL_DEPENDENCIES] Running "bun install --frozen-lockfile" in /tmp/runner/eas-build-local-nodejs/7bd0b88f-7cb0-4b95-b7de-86cdba61f56f/build directory
[INSTALL_DEPENDENCIES] bun install v1.3.11 (af24e281)
[INSTALL_DEPENDENCIES] + @babel/core@7.26.7
[INSTALL_DEPENDENCIES] + @expo/ngrok@4.1.3
[INSTALL_DEPENDENCIES] + @types/jest@30.0.0
[INSTALL_DEPENDENCIES] + @types/react@19.1.17
[INSTALL_DEPENDENCIES] + eslint@9.31.0
[INSTALL_DEPENDENCIES] + eslint-config-expo@10.0.0
[INSTALL_DEPENDENCIES] + fast-check@4.6.0
[INSTALL_DEPENDENCIES] + jest@30.3.0
[INSTALL_DEPENDENCIES] + jest-expo@55.0.14
[INSTALL_DEPENDENCIES] + ts-jest@29.4.9
[INSTALL_DEPENDENCIES] + typescript@5.9.3
[INSTALL_DEPENDENCIES] + @expo/vector-icons@15.0.3
[INSTALL_DEPENDENCIES] + @nkzw/create-context-hook@1.1.0
[INSTALL_DEPENDENCIES] + @react-native-async-storage/async-storage@2.2.0
[INSTALL_DEPENDENCIES] + @react-native-community/slider@5.0.1
[INSTALL_DEPENDENCIES] + @rork-ai/toolkit-sdk@0.2.54
[INSTALL_DEPENDENCIES] + @sheehanmunim/react-native-ffmpeg@6.0.3
[INSTALL_DEPENDENCIES] + @stardazed/streams-text-encoding@1.0.2
[INSTALL_DEPENDENCIES] + @tanstack/react-query@5.83.0
[INSTALL_DEPENDENCIES] + @ungap/structured-clone@1.3.0
[INSTALL_DEPENDENCIES] + expo@54.0.33
[INSTALL_DEPENDENCIES] + expo-av@16.0.8
[INSTALL_DEPENDENCIES] + expo-blur@15.0.8
[INSTALL_DEPENDENCIES] + expo-camera@17.0.10
[INSTALL_DEPENDENCIES] + expo-constants@18.0.13
[INSTALL_DEPENDENCIES] + expo-file-system@19.0.21
[INSTALL_DEPENDENCIES] + expo-font@14.0.11
[INSTALL_DEPENDENCIES] + expo-haptics@15.0.8
[INSTALL_DEPENDENCIES] + expo-image@3.0.11
[INSTALL_DEPENDENCIES] + expo-image-picker@17.0.10
[INSTALL_DEPENDENCIES] + expo-linear-gradient@15.0.8
[INSTALL_DEPENDENCIES] + expo-linking@8.0.11
[INSTALL_DEPENDENCIES] + expo-location@19.0.8
[INSTALL_DEPENDENCIES] + expo-media-library@18.2.1
[INSTALL_DEPENDENCIES] + expo-router@6.0.23
[INSTALL_DEPENDENCIES] + expo-splash-screen@31.0.13
[INSTALL_DEPENDENCIES] + expo-status-bar@3.0.9
[INSTALL_DEPENDENCIES] + expo-symbols@1.0.8
[INSTALL_DEPENDENCIES] + expo-system-ui@6.0.9
[INSTALL_DEPENDENCIES] + expo-web-browser@15.0.10
[INSTALL_DEPENDENCIES] + lucide-react-native@0.475.0
[INSTALL_DEPENDENCIES] + react@19.1.0
[INSTALL_DEPENDENCIES] + react-dom@19.1.0
[INSTALL_DEPENDENCIES] + react-native@0.81.5
[INSTALL_DEPENDENCIES] + react-native-gesture-handler@2.28.0
[INSTALL_DEPENDENCIES] + react-native-reanimated@4.1.7
[INSTALL_DEPENDENCIES] + react-native-safe-area-context@5.6.2
[INSTALL_DEPENDENCIES] + react-native-screens@4.16.0
[INSTALL_DEPENDENCIES] + react-native-svg@15.12.1
[INSTALL_DEPENDENCIES] + react-native-web@0.21.2
[INSTALL_DEPENDENCIES] + zustand@5.0.3
[INSTALL_DEPENDENCIES] 
[INSTALL_DEPENDENCIES] 1227 packages installed [1.67s]
The NODE_ENV environment variable is required but was not specified. Ensure the project is bundled with Expo CLI or NODE_ENV is set.
Proceeding without mode-specific .env
[READ_APP_CONFIG] Using app configuration:
[READ_APP_CONFIG] {
  "name": "DualShot Recorder",
  "slug": "7vgd7zpmmbzgcs818c1xc",
  "version": "1.0.1",
  "orientation": "portrait",
  "icon": "./assets/images/icon.png",
  "scheme": "rork-app",
  "userInterfaceStyle": "automatic",
  "newArchEnabled": true,
  "splash": {
    "image": "./assets/images/icon.png",
    "resizeMode": "contain",
    "backgroundColor": "#ffffff"
  },
  "ios": {
    "supportsTablet": false,
    "bundleIdentifier": "com.semihtrn4.duarecorder",
    "infoPlist": {
      "NSCameraUsageDescription": "DualShot kamera erişimi gerektirir",
      "NSMicrophoneUsageDescription": "Allow $(PRODUCT_NAME) to access your microphone"
    }
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/images/adaptive-icon.png",
      "backgroundColor": "#ffffff"
    },
    "package": "com.semihtrn4.duarecorder",
    "permissions": [
      "android.permission.CAMERA",
      "android.permission.RECORD_AUDIO",
      "android.permission.READ_MEDIA_VIDEO",
      "android.permission.READ_MEDIA_IMAGES",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.READ_MEDIA_VISUAL_USER_SELECTED",
      "android.permission.READ_MEDIA_AUDIO"
    ]
  },
  "web": {
    "favicon": "./assets/images/favicon.png"
  },
  "plugins": [
    [
      "expo-router",
      {
        "origin": "https://rork.com/"
      }
    ],
    "expo-font",
    "expo-web-browser",
    [
      "expo-camera",
      {
        "cameraPermission": "Kamera erişimi gerekiyor",
        "microphonePermission": "Mikrofon erişimi gerekiyor",
        "recordAudioAndroid": true
      }
    ],
    [
      "expo-media-library",
      {
        "photosPermission": "Galeri erişimi gerekiyor",
        "savePhotosPermission": "Galeriye kaydetme izni gerekiyor"
      }
    ]
  ],
  "experiments": {
    "typedRoutes": true
  },
  "extra": {
    "router": {
      "origin": "https://rork.com/"
    },
    "eas": {
      "projectId": "63286894-6a58-4277-94be-cfd2a5824c52"
    }
  },
  "sdkVersion": "54.0.0",
  "platforms": [
    "ios",
    "android",
    "web"
  ]
}
[RUN_EXPO_DOCTOR] Running "expo doctor"
[RUN_EXPO_DOCTOR] Running 17 checks on your project...
[RUN_EXPO_DOCTOR] 14/17 checks passed. 3 checks failed. Possible issues detected:
[RUN_EXPO_DOCTOR] Use the --verbose flag to see more details about passed checks.
[RUN_EXPO_DOCTOR] ✖ Check that required peer dependencies are installed
[RUN_EXPO_DOCTOR] Missing peer dependency: react-native-worklets
[RUN_EXPO_DOCTOR] Required by: react-native-reanimated
[RUN_EXPO_DOCTOR] Advice:
[RUN_EXPO_DOCTOR] Install missing required peer dependency with "npx expo install react-native-worklets"
[RUN_EXPO_DOCTOR] Your app may crash outside of Expo Go without this dependency. Native module peer dependencies must be installed directly.
[RUN_EXPO_DOCTOR] 
[RUN_EXPO_DOCTOR] ✖ Check that no duplicate dependencies are installed
[RUN_EXPO_DOCTOR] Your project contains duplicate native module dependencies, which should be de-duplicated.
[RUN_EXPO_DOCTOR] Native builds may only contain one version of any given native module, and having multiple versions of a single Native module installed may lead to unexpected build errors.
[RUN_EXPO_DOCTOR] Found duplicates for expo-location:
[RUN_EXPO_DOCTOR]   ├─ expo-location@19.0.8 (at: node_modules/expo-location)
[RUN_EXPO_DOCTOR]   └─ expo-location@15.1.1 (at: node_modules/@teovilla/react-native-web-maps/node_modules/expo-location)
[RUN_EXPO_DOCTOR] Advice:
[RUN_EXPO_DOCTOR] Resolve your dependency issues and deduplicate your dependencies. Learn more: https://expo.fyi/resolving-dependency-issues
[RUN_EXPO_DOCTOR] 
[RUN_EXPO_DOCTOR] ✖ Check that packages match versions required by installed Expo SDK
[RUN_EXPO_DOCTOR] 
[RUN_EXPO_DOCTOR] ❗ Major version mismatches
[RUN_EXPO_DOCTOR] package      expected  found    
[RUN_EXPO_DOCTOR] @types/jest  29.5.14   30.0.0   
[RUN_EXPO_DOCTOR] jest         ~29.7.0   30.3.0   
[RUN_EXPO_DOCTOR] jest-expo    ~54.0.17  55.0.14  
[RUN_EXPO_DOCTOR] 
[RUN_EXPO_DOCTOR] 
[RUN_EXPO_DOCTOR] 
[RUN_EXPO_DOCTOR] 3 packages out of date.
[RUN_EXPO_DOCTOR] Advice:
[RUN_EXPO_DOCTOR] Use 'npx expo install --check' to review and upgrade your dependencies.
[RUN_EXPO_DOCTOR] To ignore specific packages, add them to "expo.install.exclude" in package.json. Learn more: https://expo.fyi/dependency-validation
[RUN_EXPO_DOCTOR] 3 checks failed, indicating possible issues with the project.
[RUN_EXPO_DOCTOR] Command "expo doctor" failed.
Error: npx -y expo-doctor exited with non-zero code: 1
    at ChildProcess.completionListener (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/@expo/spawn-async/build/spawnAsync.js:42:23)
    at Object.onceWrapper (node:events:639:26)
    at ChildProcess.emit (node:events:524:28)
    at maybeClose (node:internal/child_process:1104:16)
    at ChildProcess._handle.onexit (node:internal/child_process:304:5)
    ...
    at spawnAsync (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/@expo/spawn-async/build/spawnAsync.js:7:23)
    at spawn (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/@expo/turtle-spawn/dist/index.js:16:47)
    at runExpoDoctor (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/@expo/build-tools/dist/common/setup.js:142:52)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async /home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/@expo/build-tools/dist/common/setup.js:121:17
    at async BuildContext.runBuildPhase (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/@expo/build-tools/dist/context.js:125:28)
    at async setupAsync (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/@expo/build-tools/dist/common/setup.js:119:9)
    at async buildAsync (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/@expo/build-tools/dist/builders/android.js:41:5)
    at async runBuilderWithHooksAsync (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/@expo/build-tools/dist/builders/common.js:12:13)
    at async Object.androidBuilder (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/@expo/build-tools/dist/builders/android.js:28:16)
[PREBUILD] - Creating native directory (./android)
[PREBUILD] ✔ Created native directory
[PREBUILD] - Updating package.json
[PREBUILD] ✔ Updated package.json
[PREBUILD] - Running prebuild
[PREBUILD] ✔ Finished prebuild
[PREBUILD] Running "bun install" in /tmp/runner/eas-build-local-nodejs/7bd0b88f-7cb0-4b95-b7de-86cdba61f56f/build directory
[PREBUILD] bun install v1.3.11 (af24e281)
[PREBUILD] Checked 1950 installs across 1270 packages (no changes) [46.00ms]
[RESTORE_CACHE] Local builds do not support restoring cache
[PREPARE_CREDENTIALS] Writing secrets to the project's directory
[PREPARE_CREDENTIALS] Injecting signing config into build.gradle
[PREPARE_CREDENTIALS] Signing config injected
[CONFIGURE_ANDROID_VERSION] Injecting version config into build.gradle
[CONFIGURE_ANDROID_VERSION] Version code: 1
[CONFIGURE_ANDROID_VERSION] Version config injected
[EAGER_BUNDLE] Starting Metro Bundler
[EAGER_BUNDLE] Android node_modules/expo-router/entry.js ▓▓▓░░░░░░░░░░░░░ 21.8% ( 7/15)
[EAGER_BUNDLE] Android node_modules/expo-router/entry.js ▓▓▓▓░░░░░░░░░░░░ 29.8% (191/350)
[EAGER_BUNDLE] Android node_modules/expo-router/entry.js ▓▓▓▓▓▓▓▓▓▓▓░░░░░ 70.4% (576/704)
[EAGER_BUNDLE] Android node_modules/expo-router/entry.js ▓▓▓▓▓▓▓▓▓▓▓░░░░░ 74.5% (792/979)
[EAGER_BUNDLE] Android node_modules/expo-router/entry.js ▓▓▓▓▓▓▓▓▓▓▓▓░░░░ 75.9% (1040/1198)
[EAGER_BUNDLE] Android node_modules/expo-router/entry.js ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░ 82.0% (1141/1260)
[EAGER_BUNDLE] Android node_modules/expo-router/entry.js ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░ 86.1% (1434/1577)
[EAGER_BUNDLE] Android Bundling failed 25650ms node_modules/expo-router/entry.js (1827 modules)
[EAGER_BUNDLE] Error: Unable to resolve module fs from /tmp/runner/eas-build-local-nodejs/7bd0b88f-7cb0-4b95-b7de-86cdba61f56f/build/node_modules/@sheehanmunim/react-native-ffmpeg/index.js: fs could not be found within the project or in these directories:
[EAGER_BUNDLE]   node_modules
[EAGER_BUNDLE]   12 |
[EAGER_BUNDLE]   13 | // Ensure smart-exception-java fix is available
[EAGER_BUNDLE] > 14 | const fs = require("fs");
[EAGER_BUNDLE]      |                     ^
[EAGER_BUNDLE]   15 | const path = require("path");
[EAGER_BUNDLE]   16 |
[EAGER_BUNDLE]   17 | // Auto-apply fix on import (for development)
[EAGER_BUNDLE] 
[EAGER_BUNDLE] Import stack:
[EAGER_BUNDLE] 
[EAGER_BUNDLE]  node_modules/@sheehanmunim/react-native-ffmpeg/index.js
[EAGER_BUNDLE]  | import "fs"
[EAGER_BUNDLE] 
[EAGER_BUNDLE]  app/post-recording.tsx
[EAGER_BUNDLE]  | import "@sheehanmunim/react-native-ffmpeg"
[EAGER_BUNDLE] 
[EAGER_BUNDLE]  app (require.context)
[EAGER_BUNDLE] error: "expo" exited with code 1
[EAGER_BUNDLE] 
Error: bun expo export:embed --eager --platform android --dev false exited with non-zero code: 1
    at ChildProcess.completionListener (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/@expo/spawn-async/build/spawnAsync.js:42:23)
    at Object.onceWrapper (node:events:639:26)
    at ChildProcess.emit (node:events:524:28)
    at maybeClose (node:internal/child_process:1104:16)
    at ChildProcess._handle.onexit (node:internal/child_process:304:5)
    ...
    at spawnAsync (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/@expo/spawn-async/build/spawnAsync.js:7:23)
    at spawn (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/@expo/turtle-spawn/dist/index.js:16:47)
    at runExpoCliCommand (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/@expo/build-tools/dist/utils/project.js:34:43)
    at eagerBundleAsync (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/@expo/build-tools/dist/common/eagerBundle.js:11:43)
    at /home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/@expo/build-tools/dist/builders/android.js:121:54
    at BuildContext.runBuildPhase (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/@expo/build-tools/dist/context.js:125:34)
    at buildAsync (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/@expo/build-tools/dist/builders/android.js:120:19)
    at async runBuilderWithHooksAsync (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/@expo/build-tools/dist/builders/common.js:12:13)
    at async Object.androidBuilder (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/@expo/build-tools/dist/builders/android.js:28:16)
    at async buildAndroidAsync (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/eas-cli-local-build-plugin/dist/android.js:43:12)

Build failed
Unknown error. See logs of the Bundle JavaScript build phase for more information.
Error: Unknown error. See logs of the Bundle JavaScript build phase for more information.
    at resolveBuildPhaseErrorAsync (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/@expo/build-tools/dist/buildErrors/detectError.js:61:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async BuildContext.handleBuildPhaseErrorAsync (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/@expo/build-tools/dist/context.js:192:28)
    at async BuildContext.runBuildPhase (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/@expo/build-tools/dist/context.js:137:35)
    at async buildAsync (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/@expo/build-tools/dist/builders/android.js:120:9)
    at async runBuilderWithHooksAsync (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/@expo/build-tools/dist/builders/common.js:12:13)
    at async Object.androidBuilder (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/@expo/build-tools/dist/builders/android.js:28:16)
    at async buildAndroidAsync (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/eas-cli-local-build-plugin/dist/android.js:43:12)
    at async buildAsync (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/eas-cli-local-build-plugin/dist/build.js:54:29)
    at async main (/home/runner/.npm/_npx/bdeb8f3c693a5400/node_modules/eas-cli-local-build-plugin/dist/main.js:16:9)
npx -y eas-cli-local-build-plugin@18.5.0 eyJqb2IiOnsidHlwZSI6Im1hbmFnZWQiLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJwcm9qZWN0Um9vdERpcmVjdG9yeSI6Ii4iLCJwcm9qZWN0QXJjaGl2ZSI6eyJ0eXBlIjoiUEFUSCIsInBhdGgiOiIvdG1wL3J1bm5lci9lYXMtY2xpLW5vZGVqcy9iNDVjMTRjOS1hMWZhLTRlZWItOTY4YS1lZTQyNTgwYTExN2MudGFyLmd6In0sImJ1aWxkZXJFbnZpcm9ubWVudCI6eyJlbnYiOnt9fSwiY2FjaGUiOnsiZGlzYWJsZWQiOmZhbHNlLCJwYXRocyI6W10sImNsZWFyIjpmYWxzZX0sInNlY3JldHMiOnsiYnVpbGRDcmVkZW50aWFscyI6eyJrZXlzdG9yZSI6eyJkYXRhQmFzZTY0IjoiL3UzKzdRQUFBQUlBQUFBQkFBQUFBUUFnWm1GbFpEVm1aREptWW1Ka1pUVm1ObVE1WldJellXUXdNekZpTjJabVpEWUFBQUdkWllDdnN3QUFCUUV3Z2dUOU1BNEdDaXNHQVFRQktnSVJBUUVGQUFTQ0JPa1hJVXdRaDc2STBBNzk4NGhQenlPQmlIYnVFMmZ6OUNHL3JhSUVkVFZwZFExUnZFMzRpbGpjeDRNL29vdXhXTlJnR09FeG82UUszZWthRzNFZndvcUovT0hpZm4vcTBOcGFTZUhpTTJXNlVqUTR2ZGlueFFXVjVKcCtycFI0MlJLRFkzTlRkcUVTek1CdnNrbU9OZENkY1QyL2h5YkdVVVFGTWE4YW1iSjkvNkZmRzhWZkhhV3dZWjZITEtLV1h0N3BZc2NncW9aVFowdVlTZUo0UzhSR0JXSkdXRzV3bGhMd2plNDZseTFoV2FhU2l0QThmbmR6WWgvYjh6bEVRTVVQckxGVW14M0R4aEs5d0laVkVLSkoyalEwYTl6NHZvSjFKOW9mWXA5b0JrVnZQQ3dzSGNiOHl2emNNVVRKYzhub25Eb3hCL2xWMXc5SFd4T1ZqeHNKbjJKRU5nVGY5R25IRk5lK3VObGU0WjlxaVp0ZHdENTc1M3lVOHRZOHRsNmNndnlnKzFzdE9OTVVFUjYyMnlWMU85eGt5by8zLy8zdjUyYnpnN1RrV2tNSkVzUmZEUU1UajdEaU9UK2pxbEpOdXExYjlXRzcwc2lWa0Fsd0R4QnBCUWlXN2VKRDFHdkk1UEpWYVZTZzd1cGZJb0ZzSllSL25XamlUdFhJNG8yN29wczhFVkZNUWZUVzNYWnhzRjhtYm93QzdGRm5ZbXZtSWM4YnZqcURQd0VyL0RvcW9IQmtzVzd2SjIrV1FtU29nblFtODdSODVVQXY4NE4rQjRIUDRzd2JjQW5VaWxsdWZDZDNqVWh1UnpnNGVhS1AxK0xJcnYzMnhES0E3Nkl3OGhQNENOSmhhMXJTeDBIU1lUMWtWNmI1TTJVcTJzekZ5NCt2alVjamtPRzBrRUJNOVBPUG5DUnAvVGRLU0g0T2VlemlUTG9sa0xnWURuNlpKUXYwYTVQUU9CL2I4aWdBSkMvYU5vY01rei9OYlhKTjl0cjJMRE5LV01JRzl2ZTU2Q3FVM0I5NGprSS82dkxna09RZ295UUFqL1hLcWt5bElXTVZKMlBoaE5UWmhMMDFDdmhJeVpSOTZSS3pxNmVNTU4vTVdxZEJLUHB0NzRWWGVjSEFZZlVDNExHNjhWeDJ0dmpVZitpcUt0WXU0a24wL1FNdGlmL3dWQkxqOTd4TGFKa081R1hKK1VlSXlEVklGamJoQzVIOUZxL0F3UGtvTXRId05QT0VKRVVLRkVwTGMzcCt3SUh0T0pHbUxrWHE2WEg3WW5kazd3MzNzY25DOWZLYVhQUnNNaFRMeVRzK3dSZHNzVWhBdFg0MlJMRVFjUE1oRSs1Mk8zZFk3ejVTQ3ZlbW1IU0hYaGdJSU12Q2pvSG5IVHZDUjdCbnpaMml0ZzdTUlo0c0dxZWdSR2s5TkJiN3c5WjAyY0gwM2dLejliVW8zM3dRWGVoRFpNK1psc0o4aVR0TXRlTXRMczVNWmxvQkRHeU9rZWx3UWF5UklkaVlFbzM2OTRyTGZuL3plMXVvVTlaQTIrZGJrNEpxRHFvZnl0MUsxVnl5NUVxRXl5Mjc5ODViYUJoWVgxeER3QUF0RkRRaGlMaTNFNlB0emVoWngxRmUyZGltQ1hrWHhva0Y1YjFSaytSeitPM0d5S1piSnlnNVVxeE5EWTUyY1dFR2FtNVpzV25vQXIyZjloK3RVdGpTLzNiS2pJSWtxWlZ0WmlZQjNKdDFjSTZoanIxNm96WlVpblJHdXdWR1dKelR3emR6WXdtZmhjcDhYeDF5MnlTTTRpNC9IVWI5NnNOb1RhYmNpT05wZnA3aG5rK1dzcEp5c2drakx0UURxR1QrVWZaRy9FTnd4TTdhK21paVFVTWRvby8ydDhvNm5KQ2h4RVBRT2U1dUtGbHBjL29CTUJzQmVqNXVNdktpS3BVTmp4ZU8wZ1NKSEVQU0pnbVRybTBYM0JJT2ZPZXdReXJqRnBYZVh5cEF3eDhXZWJoaENCZitTZWx2RmtOOWVKTm5QRFhyL0xGcktTYzl5WERaSFdhaUU5Y2pOblovUUxIZEo0ckNkcXZSeWVhMHVPUzJITldFcGdpK2NibE95ZS9oMjdUL1lLU0Q5bUd2RWtLcU9IU05rSkVoUnUzUXpIYUlkNWVNWWRuTC9jZWNUbUd1TkFPMlRSbFNrdVBzRDVERWZPbzY1Zi9HdkNVeDRPTGhJZ0VkVStNQUFBQUJBQVZZTGpVd09RQUFBekl3Z2dNdU1JSUNGcUFEQWdFQ0Fna0ErQXNRQjNnTVprRXdEUVlKS29aSWh2Y05BUUVMQlFBd1JERUxNQWtHQTFVRUJoTUNWVk14Q1RBSEJnTlZCQWdUQURFSk1BY0dBMVVFQnhNQU1Ra3dCd1lEVlFRS0V3QXhDVEFIQmdOVkJBc1RBREVKTUFjR0ExVUVBeE1BTUNBWERUSTJNRFF3TnpBeE1UTTBOVm9ZRHpJd05UTXdPREl6TURFeE16UTFXakJFTVFzd0NRWURWUVFHRXdKVlV6RUpNQWNHQTFVRUNCTUFNUWt3QndZRFZRUUhFd0F4Q1RBSEJnTlZCQW9UQURFSk1BY0dBMVVFQ3hNQU1Ra3dCd1lEVlFRREV3QXdnZ0VpTUEwR0NTcUdTSWIzRFFFQkFRVUFBNElCRHdBd2dnRUtBb0lCQVFDMjdzSnZXc1hldjhONUk4S2EvdnVmVzZZSkNVTEI0Yis3VjYvejBYQ0N2VWpBeHFNK2cwSmM1REtCcUJPVzVBRG9CanJzTTV0a0tvSU5uQTF6bFZDMHdsaHdXR2dVQzNPbUZpNFhOUHRBTGJTTnh4RVdSbmRzTU5kc2RLazNtUmpMVFM5MUhLRlh3a0I4Qk5PYU1hSzlvSmE0UytYaHZ6eURPOXhSUDBZSUJmdXd6UkozQmJBeld6Y3U5Y1dDeFVGbGwyTU1WL0Y2Y25RbnN0SG1KYVVqVHM2bUk5SzZSY25nRkJVOFozK3B6NzNKczZaQ0czd01TRUtpdDc4b2JBRTZPaTNnTFNLL3VhYVMzRFRYcmZuandnRlJaWHEyL1JHeTZYSFdLWGdIYXdtM05MZmtVWkxKSXoxdURCc2JnVE1iaFY0MzlyVkdybEN0OW16dGVaQmhBZ01CQUFHaklUQWZNQjBHQTFVZERnUVdCQlJrWjNnWkZoQTV4ZzR0N3dLK0puamdXdVhBbXpBTkJna3Foa2lHOXcwQkFRc0ZBQU9DQVFFQUJYZVM3eXBzeDJ1UkJrMlNSMnplejV3Vm56MHh2MmhFYU9UdjRlZS84UTRhdTIzMVRWYW5DYkhqZUYzcTc2QWhSWURvZEJETjBzQW8rTEVOUU9ETVUvMlU5ZnJpb3plR21PdHNaUG85Zm1ycXd1VlZqRkVPZlIzTmV1VEdoZEZ6WG5tZklNWEZrYzNMT2kvZFA1eXQvSTN2TDJ5L0JZTEhzUzhPeU84MmdkMEJwY0F1Tk95eWtDTm03SnpEZDJiTnhyTFFjN1d6VkNZc3orSG9BNHJ0bER0RHpCNHU2VDBkbFdERU03QitQNzNuMTI1Wkx2dTJXdGhoQ25oUEVjWitwalM0dzNNendIS1pVQmFoSzBzSDhEVWhvaEd1ZVZJTW10b215QUxzaWpLekMvMDZXNElqQThpb1hQNXBzM0QrWk1kSitxYk5DUG9oRjZKYW14akxJbXBMWnVway9yVUYvZWdHSVI5L25TZk9nSE9uIiwia2V5c3RvcmVQYXNzd29yZCI6IjRlYzIwYWNjOTcxODViMGJkMDJlZDJhMTU4NGYyMTk3Iiwia2V5QWxpYXMiOiJmYWVkNWZkMmZiYmRlNWY2ZDllYjNhZDAzMWI3ZmZkNiIsImtleVBhc3N3b3JkIjoiNmU0NWRhODRhYjc2MGMyYzVhODQ0YTQxMzA4ZTA4YWIifX19LCJ1cGRhdGVzIjp7fSwiZ3JhZGxlQ29tbWFuZCI6IjphcHA6YXNzZW1ibGVSZWxlYXNlIiwiYnVpbGRUeXBlIjoiYXBrIiwidXNlcm5hbWUiOiJzZW1paHRybjQiLCJ2ZXJzaW9uIjp7InZlcnNpb25Db2RlIjoiMSJ9LCJleHBlcmltZW50YWwiOnt9LCJtb2RlIjoiYnVpbGQiLCJ0cmlnZ2VyZWRCeSI6IkVBU19DTEkiLCJhcHBJZCI6IjYzMjg2ODk0LTZhNTgtNDI3Ny05NGJlLWNmZDJhNTgyNGM1MiIsImluaXRpYXRpbmdVc2VySWQiOiIwNTEwOWM3Zi0yN2QwLTQzZWYtOTQzNC0wYzMxZDc3MGJhNjYifSwibWV0YWRhdGEiOnsidHJhY2tpbmdDb250ZXh0Ijp7InRyYWNraW5nX2lkIjoiNTFhYzQyMzctOWMxNC00ZjYxLWFmZTUtNDcxZWVhMmNmOTU2IiwicGxhdGZvcm0iOiJhbmRyb2lkIiwic2RrX3ZlcnNpb24iOiI1NC4wLjAiLCJhY2NvdW50X2lkIjoiNzZkNGY1OTctZmU0Zi00Y2M2LTlmNjEtNjBmYTZmMTc5OGEyIiwicHJvamVjdF9pZCI6IjYzMjg2ODk0LTZhNTgtNDI3Ny05NGJlLWNmZDJhNTgyNGM1MiIsInByb2plY3RfdHlwZSI6Im1hbmFnZWQiLCJkZXZfY2xpZW50IjpmYWxzZSwibm9fd2FpdCI6ZmFsc2UsInJ1bl9mcm9tX2NpIjp0cnVlLCJsb2NhbCI6dHJ1ZX0sImFwcEJ1aWxkVmVyc2lvbiI6IjEiLCJhcHBWZXJzaW9uIjoiMS4wLjEiLCJjbGlWZXJzaW9uIjoiMTguNS4wIiwid29ya2Zsb3ciOiJtYW5hZ2VkIiwiY3JlZGVudGlhbHNTb3VyY2UiOiJyZW1vdGUiLCJzZGtWZXJzaW9uIjoiNTQuMC4wIiwiZmluZ2VycHJpbnRIYXNoIjoiYzUzMmRhNGY0YWVhZWM1OTY4ZmJlYWEwMjM1ZTA0NjdmZjdlNWI1YiIsInJlYWN0TmF0aXZlVmVyc2lvbiI6IjAuODEuNSIsImRpc3RyaWJ1dGlvbiI6InN0b3JlIiwiYXBwTmFtZSI6IkR1YWxTaG90IFJlY29yZGVyIiwiYXBwSWRlbnRpZmllciI6ImNvbS5zZW1paHRybjQuZHVhcmVjb3JkZXIiLCJidWlsZFByb2ZpbGUiOiJhcGsiLCJnaXRDb21taXRIYXNoIjoiMDBiMGZhZThjOTY0ZGRjYmJmYjdkOGM0YTdhM2ZjMTBkMjlkNTkxMCIsImdpdENvbW1pdE1lc3NhZ2UiOiJmaXg6IEBzaGVlaGFubXVuaW0vcmVhY3QtbmF0aXZlLWZmbXBlZyB2ZXJzaXlvbiA2LjAuMyB2ZSBpbXBvcnQgZHV6ZWx0bWVzaSIsImlzR2l0V29ya2luZ1RyZWVEaXJ0eSI6dHJ1ZSwidXNlcm5hbWUiOiJzZW1paHRybjQiLCJydW5XaXRoTm9XYWl0RmxhZyI6ZmFsc2UsInJ1bkZyb21DSSI6dHJ1ZSwiZGV2ZWxvcG1lbnRDbGllbnQiOmZhbHNlLCJyZXF1aXJlZFBhY2thZ2VNYW5hZ2VyIjoiYnVuIiwic2ltdWxhdG9yIjpmYWxzZX19 exited with non-zero code: 1
    Error: build command failed.
Error: Process completed with exit code 1.