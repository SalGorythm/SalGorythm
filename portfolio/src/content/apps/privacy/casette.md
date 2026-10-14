## Overview

Casette is an audio player for files you own. We do not run servers, we do not have user accounts, and we do not collect, sell, or share personal data. Everything Casette knows about your library stays on your device, or in services you choose to connect.

## Data storage

Audio files you import are copied into the app's private storage on your device. Folders, playlists, tags, bookmarks, playback positions, and preferences are stored locally (AsyncStorage / UserDefaults).

**Library backups.** Casette backs up your library details — folders, playlists, tags, bookmarks, playback positions, track details, and preferences — automatically (daily by default; you can change or turn this off in Settings → Backup & restore). Backups do not include your audio files or purchase status. If iCloud Drive is on, they are saved in your own iCloud Drive (iCloud Drive › Casette › Backups) under your Apple ID; otherwise they stay on your device. You can also export a backup file and save it wherever you choose. We never receive or have access to your backups.

Sign-in tokens for cloud services you connect (Google Drive, Dropbox, WebDAV) are stored in the iOS Keychain / Android Keystore on your device and are never sent to us.

## Network usage

Casette only uses the network when you ask it to:

- **Cloud folders you link** — Casette talks directly from your device to Google Drive (drive.file scope — only files you pick), Dropbox, iCloud Drive / Files providers, or your own WebDAV server to list, stream, and download audio. Those requests go straight to that provider; nothing passes through us.
- **Play from URL / share links** — When you paste a link, Casette fetches that URL directly to play or download the audio.
- **iCloud backups and resume sync** — Library backups (see above) are written to your iCloud Drive. If you turn on iCloud resume sync (off by default), playback positions and bookmarks are also stored in your private iCloud key-value store. Both live under your Apple ID; we cannot read them.
- **Wi‑Fi Transfer** — A temporary local web server runs on your device while the screen is open. Uploads come from devices on your local network and never leave it.
- **In-App Purchase** — Apple processes the purchase. We do not receive payment details.

Siri and Shortcuts actions (resume, pause, play a folder) run on your device and are handled by Apple's standard Siri and Shortcuts privacy terms; Casette sends nothing to us.

## Analytics & tracking

Casette contains no analytics, advertising, crash-reporting, or tracking SDKs.

## Third-party services

Only the services you choose to use, each governed by its own privacy policy:

- Apple (App Store purchases, iCloud)
- Google Drive
- Dropbox
- Any WebDAV server or URL you enter

## Deleting your data

Deleting the app removes all data stored on your device. Backups in iCloud Drive are kept so you can restore after reinstalling; delete them in the Files app (iCloud Drive › Casette), or remove all Casette iCloud data in iOS Settings → [your name] → iCloud → Manage Storage. Turn off automatic backup in Settings → Backup & restore to stop new backups. Disconnect a cloud source from Manage sources to remove its stored token. Turning off iCloud resume sync stops syncing.

## Children's privacy

Casette does not collect personal information from anyone, including children.

## Changes

If this policy changes, the updated version will be published at the same address and linked from the app's Settings.
