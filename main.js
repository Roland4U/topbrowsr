const {
	app,
	BrowserWindow,
	session,
	Menu,
	ipcMain
} = require('electron'),
	Store = require('electron-store'),
	path = require("path"),
	{
		ElectronBlocker,
		fullLists,
		Request
	} = require('@cliqz/adblocker-electron'),
	fetch = require('node-fetch');

require('electron-widevinecdm').load(app);

let mainWindow;
const store = new Store();

async function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		show: false,
		transparent: true,
		alwaysOnTop: true,
		minWidth: 300,
		minHeight: 150,
		title: "TopBrowser",
		webPreferences: {
			nodeIntegration: true,
			plugins: true,
			webviewTag: true
		},
		backgroundColor: '#00000000'
	});

	if (store.get('options.adblock')) {
		let engineCachePath = path.join(
			app.getPath('userData'),
			'adblock-engine-cache.txt'
		);

		if (fs.existsSync(engineCachePath)) {
			console.log('Adblock engine cache found. Loading it into app.');
			var engine = await ElectronBlocker.deserialize(
				fs.readFileSync(engineCachePath)
			);
		} else {
			var engine = await ElectronBlocker.fromLists(fetch, fullLists);
		}
		engine.enableBlockingInSession(session.defaultSession);

		// Backup Engine Cache to Disk
		fs.writeFile(engineCachePath, engine.serialize(), err => {
			if (err) throw err;
			console.log('Adblock Engine file cache has been updated!');
		});
	}

	mainWindow.loadFile('./views/index.html');
	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
	});
	mainWindow.on('closed', function () {
		mainWindow = null;
	});
	mainWindow.on('minimize', function (event) {
		console.log("Clickthrough disabled");
		mainWindow.setIgnoreMouseEvents(false);
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow();
	}
});
