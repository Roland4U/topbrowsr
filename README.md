# electron_top_browser

Minimal electron browser that always stays on top.

**Frameworks used**

Vue.js for databinding, bootstrap css, and obviously electron that comes with Node.js and Chromium.

**Launch**
npm install
npm start

**Build**
[npm install] //if you did not install before to test
npm run build

This will delete any previous build, build the app again, copy the icon file to the app directory, hide the source file inside with ASAR, and delete the source file. Only tested in macOS so if you want to build on windows, you should probably change the paths.
