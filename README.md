# rhythmvision: body-controlled Dance Dance Revolution
### Uses MediaPipe pose estimation to control Dance Dance Revolution game.

![ezgif com-gif-maker (3)](https://user-images.githubusercontent.com/30610197/131271155-d74aa804-ef4b-4839-afd7-994e3ce9b8a3.gif)

### [Play it online!](https://knosmos.github.io/rhythmvision/)

## Adding a new track
Currently the process for adding new songs is a bit convoluted. It may be streamlined in the future.

1. Download the code and open `record.html` in a browser.
2. Input the filename of the song and press `start`.
3. Record the track by making the desired movements as the song plays.
4. Press `copy track to clipboard`.
5. Make a new js file in the `songs` folder.
6. In the file, type `let track_{name} = ` (where {name} is the name of the song). Then paste the track into the file.
7. Open `index.html` in a text editor. Inside the `select` div, add `<button onclick="selectSong({name})">{name}</button>`. Under the comment saying "Song track files", add a line `<script src=songs/{name}.js></script>`.
8. Open `scripts/select.js` in a text editor. Add an item `"{name}":[track_{name},"{filename}"]` (where {filename} is the filename of the song music file) to the `songs` object.