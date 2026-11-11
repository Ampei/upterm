export function requireMonaco(callback: () => void) {
    const g = (global as any);
    const nodeRequire = g.require;

    const loaderScript = document.createElement("script");
    loaderScript.type = "text/javascript";
    loaderScript.src = "../../../node_modules/monaco-editor/min/vs/loader.js";

    loaderScript.addEventListener("load", () => {
        const amdRequire = g.require;
        g.require = nodeRequire;
        // require node modules before loader.js comes in
        const path = require("path");

        function uriFromPath(_path: string) {
            let pathName = path.resolve(_path).replace(/\\/g, "/");
            if (pathName.length > 0 && pathName.charAt(0) !== "/") {
                pathName = "/" + pathName;
            }
            return encodeURI("file://" + pathName);
        }

        amdRequire.config({
            baseUrl: uriFromPath(path.join(__dirname, "../../../node_modules/monaco-editor/min")),
        });
        // Monaco's CSS/TS workers misread Node's module and process.
        // Put them back before app code loads, or UMD packages such as lodash
        // register with the AMD loader and export an empty module.
        const nodeModule = (self as any).module;
        (self as any).module = undefined;
        (self as any).process.browser = true;
        amdRequire(["vs/editor/editor.main"], () => {
            (self as any).module = nodeModule;
            g.define = undefined;
            callback();
        });

        // window.require(["vs/editor/editor.main"], () => require("./Main"));
    });
    document.body.appendChild(loaderScript);
}
