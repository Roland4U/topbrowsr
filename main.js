const {
	app,
	BrowserWindow,
	session,
	Menu,
	ipcMain
} = require('electron'),
	path = require("path"),
	{
		ElectronBlocker,
		fullLists,
		Request
	} = require('@cliqz/adblocker-electron'),
	fetch = require('node-fetch');

require('electron-widevinecdm').load(app);

let mainWindow;

function createWindow() {
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
			webviewTag: true
		}
	});
	mainWindow.loadFile('./views/index.html');
	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
	});
	mainWindow.on('closed', function () {
		mainWindow = null;
	});
	mainWindow.on('minimize',function(event){
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
