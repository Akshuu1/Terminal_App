# Terminal App Experiments

This repository contains small Node.js exercises for terminal keyboard input and a basic command-line music player.

## Requirements

- macOS
- [Node.js](https://nodejs.org/)
- An interactive Terminal window
- `afplay`, the macOS command-line audio player

The music player is macOS-only because it uses `afplay`.

## Run the Music Player

Open Terminal and run:

```bash
cd "/Users/BADMSOH/App dev CLI/Music Player"
node player.js
```

Replace the path if you cloned the repository somewhere else.

### Controls

| Key | Action |
| --- | --- |
| Up Arrow | Select the previous song |
| Down Arrow | Select the next song |
| Enter | Play the selected song |
| Space | Pause or resume playback |
| Ctrl+C | Exit |

MP3 files can be added to [Music Player/songs](./Music%20Player/songs). The player lists every file in that directory, so keep only supported audio files there.

## Run the Keyboard Tests

Display key characters and their raw byte values:

```bash
cd "/Users/BADMSOH/App dev CLI"
node keycode-detector.js
```

Detect arrow-key sequences:

```bash
cd "/Users/BADMSOH/App dev CLI"
node raw_io.js
```

Run these scripts in an interactive terminal. Piped input or a non-terminal environment does not provide `process.stdin.setRawMode()`.

## How Buffer Logging Works

A keyboard event provides a Node.js `Buffer`, not only a plain string. Passing the buffer directly to `console.log()` preserves its raw hexadecimal value:

```javascript
process.stdin.on("data", (data) => {
    console.log(
        "You have pressed",
        data.toString().trim(),
        "with raw bytes",
        data
    );
});
```

Do not embed `data` in a template literal when debugging raw input. JavaScript converts the buffer to a string, hiding the separate byte values used for arrow-key detection.

## Current Limitations

- The player is a basic terminal prototype, not a complete package or application.
- It has no progress bar or playback timer.
- Pause/resume uses `SIGSTOP` and `SIGCONT`; it does not report a reliable playback position.
- The screen redraw does not clear old lines, which can leave artifacts from longer filenames.
- Left and right arrow keys do not currently seek or skip.
- There is no error handling for missing songs or an unavailable `afplay`.
- There is no package manifest or install command.
