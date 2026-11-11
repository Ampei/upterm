import {services} from "../services/index";
import * as _ from "lodash";

monaco.languages.setMonarchTokensProvider("shell-history", {
    tokenizer: {
        root: [
            {
                regex: /.+/,
                action: {token: "history-item"},
            },
        ],
    },
    defaultToken: "invalid",
    tokenPostfix: ".shell-history",
});

monaco.languages.register({
    id: "shell-history",
});

monaco.languages.registerCompletionItemProvider("shell-history", {
    triggerCharacters: [" ", "/"],
    provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = new monaco.Range(
            position.lineNumber,
            word.startColumn,
            position.lineNumber,
            position.column,
        );

        return {
            incomplete: false,
            suggestions: _.uniqBy(services.history.all, record => record.command).map(record => ({
                label: record.command,
                kind: monaco.languages.CompletionItemKind.Text,
                insertText: record.command,
                range,
            })),
        };
    },
});

monaco.languages.setLanguageConfiguration("shell-history", {
    wordPattern: /.*/g,
});
