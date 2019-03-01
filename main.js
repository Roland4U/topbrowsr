const {
	app,
	BrowserWindow
} = require('electron');
const path = require("path");

app.commandLine.appendSwitch('widevine-cdm-path', path.join(__dirname, 'lib/widewine-cdm/1.4.8.903/widevinecdmadapter.plugin'));
app.commandLine.appendSwitch('widevine-cdm-version', '1.4.8.903');

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		show: false,
		frame: false,
		transparent: true,
		alwaysOnTop: true,
		minWidth: 300,
		minHeight: 150,
		title: "TopBrowser"
	});
	mainWindow.loadFile('./views/index.html');
	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
	});
	mainWindow.on('closed', function() {
		mainWindow = null;
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function() {
	if (mainWindow === null) {
		createWindow();
	}
});
