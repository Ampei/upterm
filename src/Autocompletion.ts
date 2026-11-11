import {leafNodeAt, ASTNode} from "./shell/Parser";
import * as _ from "lodash";
import {Environment} from "./shell/Environment";
import {OrderedSet} from "./utils/OrderedSet";
import {Aliases} from "./shell/Aliases";

type GetSuggestionsOptions = {
    currentText: string;
    currentCaretPosition: number;
    ast: ASTNode;
    environment: Environment;
    historicalPresentDirectoriesStack: OrderedSet<string>;
    aliases: Aliases;
};

export async function getSuggestions({
    currentCaretPosition,
    ast,
    environment,
    historicalPresentDirectoriesStack,
    aliases,
}: GetSuggestionsOptions) {
    const node = leafNodeAt(currentCaretPosition, ast);
    const suggestions = await node.suggestions({
        environment: environment,
        historicalPresentDirectoriesStack: historicalPresentDirectoriesStack,
        aliases: aliases,
    });

    return _.uniqBy(suggestions, suggestion => suggestion.label).map(suggestion => ({
        ...suggestion,
        kind: monaco.languages.CompletionItemKind.Interface,
    }));
}
