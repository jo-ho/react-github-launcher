
# React GitHub Launcher

This app was bootstrapped by [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)

Manage and launch github apps from one program.

![react-github-launcher](https://user-images.githubusercontent.com/27314018/147320877-6380cb29-7aeb-44c4-9ff5-6b5c722c9123.png)

## Features

- Display and retrieve repo information, including its README 
- Download and auto-extract latest repo releases
- Add custom apps to the library
- Launch apps from the program
- Edit description of apps 

## Usage

- File -> Add Repo
- Enter owner and name, e.g. "angband", "angband"
- Click "Add"
- Select release from dropdown and download
- Set app path with "Select exe"
- Click "Launch"


## Development

### Starting Development

Start the app in the `dev` environment:

```bash
npm start
```

### Packaging for Production

To package apps for the local platform:

```bash
npm run package
```

To package apps for the windows platform:

```bash
npm run package-win
```




## License

[MIT](https://github.com/jo-ho/react-github-launcher/blob/master/LICENSE)
