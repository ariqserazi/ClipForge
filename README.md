# ClipForge

ClipForge is a macOS Adobe Premiere Pro CEP extension that generates random broll clips from local video files with `ffmpeg` and `ffprobe`, then optionally imports those generated clips into the current Premiere Pro project.

The clip generation behavior follows the provided shell workflow closely:

- scan only the top level of the input folder
- support `mp4`, `mkv`, `mov`, `avi`, and `m4v`
- randomly choose a source video for each output clip
- use `ffprobe` to read duration
- skip source files that are too short
- avoid the first and last 90 seconds by default
- generate 30 clips at 6 seconds each by default
- export silent H.264 `.mp4` files named `broll_0001.mp4`, `broll_0002.mp4`, and so on

## Features

- Dockable CEP panel for Premiere Pro
- Clean dark UI built with vanilla HTML, CSS, and JavaScript
- Uses Node inside CEP via `child_process`
- Uses ExtendScript to import generated clips into the current Premiere project
- Live panel log with readable progress and error messages
- Manual CEP install flow for macOS
- Validation script for the required project files and CEP wiring

## Requirements

- macOS
- Adobe Premiere Pro with CEP panel support
- `ffmpeg` and `ffprobe`
- Node.js if you want to run the local validation and zip scripts

## Windows Version

If you want the Windows version of ClipForge, go here:

[ClipForge-WindowsVersion](https://github.com/ariqserazi/ClipForge-WindowsVersion)

## Install ffmpeg

Install `ffmpeg` with Homebrew:

```bash
brew install ffmpeg
```

`ffprobe` is included with that install.

## macOS Extension Install

The extension folder you install must be the folder that directly contains:

- `CSXS/manifest.xml`
- `index.html`
- `src/`
- `jsx/`
- `lib/`

### System-wide install

Copy the extension folder to:

```text
/Library/Application Support/Adobe/CEP/extensions/ClipForge
```

Example:

```bash
sudo mkdir -p "/Library/Application Support/Adobe/CEP/extensions"
sudo cp -R "/path/to/ClipForge" "/Library/Application Support/Adobe/CEP/extensions/"
```

### User-level install

You can also install it for the current user only:

```text
~/Library/Application Support/Adobe/CEP/extensions/ClipForge
```

Example:

```bash
mkdir -p "$HOME/Library/Application Support/Adobe/CEP/extensions"
cp -R "/path/to/ClipForge" "$HOME/Library/Application Support/Adobe/CEP/extensions/"
```

## Enable CEP Debug Mode

Unsigned CEP extensions require Adobe debug mode.

Run:

```bash
defaults write com.adobe.CSXS.11 PlayerDebugMode 1
defaults write com.adobe.CSXS.12 PlayerDebugMode 1
defaults write com.adobe.CSXS.13 PlayerDebugMode 1
```

Optional refresh:

```bash
killall cfprefsd
```

## Premiere Install Instructions

1. Install `ffmpeg` with Homebrew.
2. Copy the `ClipForge` folder into one of the CEP extensions folders above.
3. Enable CEP debug mode.
4. Restart Premiere Pro.
5. Open `Window > Extensions > ClipForge`.

If your Premiere build labels CEP panels as legacy, also check:

- `Window > Extensions (Legacy) > ClipForge`

## Default Workflow

1. Open Premiere Pro.
2. Open `Window > Extensions > ClipForge`.
3. Choose or enter an input folder.
4. Choose or enter an output folder.
5. Set clip count, clip length, skip first seconds, and skip last seconds.
6. Click `Generate Clips`.
7. Watch the panel log as `ffprobe` checks durations and `ffmpeg` creates clips.
8. Click `Import Generated Clips`.
9. The generated clips are imported into the current Premiere project.

Default values:

- Input folder: `/Users/ariqserazi/3GLore/top10Romance2026/10`
- Output folder: `/Users/ariqserazi/3GLore/top10Romance2026/10/clips`
- Clip count: `30`
- Clip length: `6`
- Skip first seconds: `90`
- Skip last seconds: `90`

## Development

This repo is intentionally lightweight. There are no runtime dependencies for the panel itself.

Useful commands:

```bash
npm run validate
npm run zip
```

The zip command creates:

```text
dist/ClipForge.zip
```

## Validation

Run:

```bash
npm run validate
```

The validation script checks:

- required project files exist
- `manifest.xml` exists and contains `ClipForge`
- `manifest.xml` enables Node with `--enable-nodejs`
- `src/main.js` uses `child_process`
- `jsx/clipforge-host.jsx` contains the Premiere import function
- key JavaScript files pass a syntax check

## Troubleshooting

### The panel does not appear in Premiere

- Make sure the installed folder is named `ClipForge`
- Confirm `CSXS/manifest.xml` exists inside that installed folder
- Re-run the `defaults write com.adobe.CSXS.* PlayerDebugMode 1` commands
- Fully quit and restart Premiere Pro
- Check `Window > Extensions` and `Window > Extensions (Legacy)`

### ffmpeg or ffprobe cannot be found

Install them with:

```bash
brew install ffmpeg
```

ClipForge tries these locations:

- `ffmpeg` and `ffprobe` from `PATH`
- `/opt/homebrew/bin/ffmpeg`
- `/opt/homebrew/bin/ffprobe`
- `/usr/local/bin/ffmpeg`
- `/usr/local/bin/ffprobe`

### No clips were generated

- Make sure the input folder contains supported video files at the top level
- Very short source videos are skipped
- If `skip first seconds` and `skip last seconds` leave no valid start range, the video will be skipped
- Read the panel log for the exact source file that failed or was skipped

### Import failed

- Make sure the panel is running inside Premiere Pro, not in a regular browser
- Open a Premiere project before importing
- Check the panel log for the returned ExtendScript message

## Notes About Unsigned CEP Extensions

- This project is designed for manual CEP installation
- It is not packaged as a `.ccx`
- It does not require the UXP Developer Tool
- Adobe may treat CEP panels as legacy depending on the Premiere version
- Debug mode is required for unsigned local installs

## License

MIT License. See [LICENSE](./LICENSE).
