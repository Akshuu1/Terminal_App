# CLI Music Player - Refinement Challenge Submission

## 1. Architecture Diagram

```mermaid
)
```

## 2. AI Chat History

[Link to AI Conversation History](https://gemini.google.com/app/cli-music-player-refinement) *(Make sure to replace this with your actual chat link!)*

## 3. Understanding Questionnaire

**1. Your first arrow-navigation version printed the song list again and again. Why did that happen, and how did you make the list redraw in the same place?**

*Answer:*
Because `console.log()` naturally prints to a new line every time it's called, so the list kept printing under the old one. I fixed this by using an ANSI escape code (`\x1B[2;1H`) to push the cursor back to the top left of the screen before drawing the list again, which overrides the old list in the exact same spot.
```
graph TD
    A[User Keyboard Input] -->|Raw Mode Data| B(Node.js process.stdin)
    B --> C{Key Parser}
    C -->|Up/Down| D[Update Cursor State]
    C -->|Enter| E[Play Audio]
    C -->|Space| F[Pause/Resume Audio]
    
    D --> G[Redraw Terminal UI in-place]
    
    E --> H[Kill Existing Audio Process & Clear Timers]
    H --> I[Spawn New Audio Process]
    I --> J[Start Progress Interval]
    
    F --> K{Is Paused?}
    K -->|Yes| L[Send SIGCONT / Resume Timer]
    K -->|No| M[Send SIGSTOP / Pause Timer]
    
    J --> G
    L --> G
    M --> G
    
    I --> N((System Audio Out)
    ```
**2. Why do we need both cursor movement and line clearing while redrawing the terminal UI? What problem can happen if we only move the cursor?**

*Answer:*
If I just move the cursor back up and write a shorter song name over a longer one, the extra characters from the old song name would still show up at the end of the line. Clearing the line before writing makes sure those leftover characters are completely wiped out.

**3. What does the selected-song variable represent? How do you make sure the user cannot move above the first song or below the last song?**

*Answer:*
It's basically the index of the song in the array that I'm currently pointing at. To stop it from going out of bounds, I used modulo math. For example, if I hit down on the last song, the modulo operation wraps the index back to 0 (the first song), and vice versa when pressing up.

**4. Why was afplay + SIGSTOP/SIGCONT not a reliable solution for a real pause/resume feature? What changed in your final approach?**

*Answer:*
`afplay` is super basic and doesn't tell my node process what the current timestamp is. When I paused it with `SIGSTOP`, I had no idea what second it stopped at. That meant I couldn't build a real progress bar. To fix it in the final approach, I realized I needed a different way to play the audio (like using an external library) that actually spits out progress events so I can track the time properly.

**5. How would you prove that your pause/resume implementation is correct? Describe a small test you would perform.**

*Answer:*
I'd just let a song play until the progress bar hits exactly 10 seconds, hit the spacebar to pause it, and then wait like 5 seconds before resuming. If it's correct, the music should pick up exactly where it left off, and the progress bar shouldn't suddenly jump forward to 15 seconds.

**6. How is the progress percentage calculated? What should happen to the progress value while the song is paused?**

*Answer:*
I take the current time in seconds, divide it by the total duration of the song, and multiply by 100 to get a percentage. When I pause the song, I make sure to also stop the interval that's updating that `currentTime` variable, so the percentage stays totally frozen until I hit play again.

**7. When the user starts a new song while another song is already playing, what needs to be stopped or cleaned up? What could happen if you do not do this?**

*Answer:*
I have to completely kill the current audio process (like the afplay process) and stop the timer interval for the progress bar. If I forget to do that, the old song keeps playing in the background while the new one starts, so it sounds like a mess. Plus, two timers would be fighting to update the screen at the same time.

**8. Describe one bug or unexpected behaviour you faced while refining this application. What did you initially think was wrong, how did you investigate it, and what was the actual fix?**

*Answer:*
Honestly, the arrow keys were driving me crazy. When I pressed an arrow key, it was sometimes just printing weird garbage characters instead of moving my cursor. I thought my math was wrong at first. But when I looked at the raw data coming into `process.stdin`, I realized arrow keys actually send a sequence of 3 bytes (like `0x1b`, `0x5b`, and then a letter). Just doing `.toString()` on the data was ruining it. I fixed it by explicitly checking `data[0]`, `data[1]`, and `data[2]` against those raw hex values.

**9. If you had to add "jump forward 10 seconds" next, which part of your current application would you change and what existing playback information would you reuse?**

*Answer:*
I'd probably map it to the right arrow key. When pressed, I'd take my existing `currentTime` tracker and add 10 to it. Then I'd have to kill the current song process entirely, and start a brand new one, but pass in a flag that tells it to start playing directly from that new `currentTime` mark.
