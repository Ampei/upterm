import {Session} from "../shell/Session";
import {PluginManager} from "../PluginManager";
import * as remote from "@electron/remote";

PluginManager.registerEnvironmentObserver({
    presentWorkingDirectoryWillChange: () => { /* do nothing */ },

    presentWorkingDirectoryDidChange: (_session: Session, directory: string) => {
        remote.app.addRecentDocument(directory);
    },
});
