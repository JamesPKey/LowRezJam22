# LowRezJam22

_Escape_ is a game created for [LOWREZJAM 2022](https://itch.io/jam/lowrezjam-2022). The aim for this jam, was to create a game limited to 64x64 pixels.   
   
This is an escape room style game, where the player wakes up in an unknown house, and much attempt to leave.
   
It is powered by [Phaser3](https://phaser.io/phaser3) and written in Typescript, utilising Vite, and Rollup.  
All art (or lack thereof 😅) minus the `Phaser` logo, and all sound assets are original.

[Play it on Itch.io](https://jameskey.itch.io/escape)

<img src="https://img.itch.zone/aW1hZ2UvMTY2MjY0NS85Nzg3ODIyLnBuZw==/original/4T8Wtj.png" width="300px" />

## Available Commands

| Command | Description |
|---------|-------------|
| `yarn install` | Install project dependencies |
| `yarn dev` | Builds project and open web server, watching for changes |
| `yarn build` | Builds code bundle with production settings  |
| `yarn serve` | Run a web server to serve built code bundle |

## Development

Run `yarn install` from your project directory. Then, you can start the local development
server by running `yarn dev` and navigate to http://localhost:3000.

## Production

After running `yarn build`, the files you need for production will be on the `dist` folder. To test code on your `dist` folder, run `yarn serve` and navigate to http://localhost:5000
