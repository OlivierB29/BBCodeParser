
import {TreeType}  from "./bbCodeParseTree";
import {BBTag} from "./bbTag";
import {BBCodeParseTree} from "./bbCodeParseTree";

//Indicates if the first string ends with the second str
function endsWith(str: string, endStr: string) {
    if (str.length == 0) {
        return false;
    }

    if (endStr.length > str.length) {
        return false;
    }

    let inStrEnd = str.substr(str.length - endStr.length, endStr.length);
    return endStr == inStrEnd;
}

//Indicates if the first string starts with the second string
function startsWith(str: string, startStr: string) {
    if (str.length == 0) {
        return false;
    }

    if (startStr.length > str.length) {
        return false;
    }

    let inStrStart = str.substr(0, startStr.length);
    return startStr == inStrStart;
}

let tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};

//Escapes the given html
function escapeHTML(html: any) : any | any[] {
    return html.replace(/[&<>]/g, function (tag: any) {
        return tagsToReplace[tag] || tag;
    });
}

//Represents a BB code parser
export class BBCodeParser {
    //Creates a new parser with the given tags
    constructor(private bbTags: Array<BBTag>, private options = BBCodeParser.defaultOptions()) {

    }

    //Parses the given string
    public parseString(content: string, stripTags = false, insertLineBreak = true, escapingHtml = true) {
        //Create the parse tree
        let parseTree = BBCodeParseTree.buildTree(content, this.bbTags, this.options);

        //If the tree is invalid, return the input as text
        if (parseTree == null || !parseTree.isValid()) {
            return content;
        }

        //Convert it to HTML
        return this.treeToHtml(parseTree.subTrees, insertLineBreak, escapingHtml, stripTags);
    }

    //Converts the given subtrees into html
    private treeToHtml(subTrees: Array<BBCodeParseTree>, insertLineBreak: boolean, escapingHtml: boolean, stripTags = false) {
        let htmlString = "";
        let suppressLineBreak = false;

        subTrees.forEach(currentTree => {
            if (currentTree.treeType == TreeType.Text) {
                let textContent = currentTree.content;

                if(escapingHtml){
                    textContent = (this.options.escapeHTML) ? escapeHTML(textContent) : textContent;
                }

                if (insertLineBreak && !suppressLineBreak) {
                    textContent = textContent.replace(/(\r\n|\n|\r)/gm, "<br>");
                    suppressLineBreak = false;
                }

                htmlString += textContent;
            } else {
                //Get the tag
                let bbTag = this.bbTags[currentTree.content];
                let content = this.treeToHtml(currentTree.subTrees, bbTag.insertLineBreaks, escapingHtml, stripTags);

                //Check if to strip the tags
                if (!stripTags) {
                    htmlString += bbTag.markupGenerator(bbTag, content, currentTree.attributes);
                } else {
                    htmlString += content;
                }

                suppressLineBreak = bbTag.suppressLineBreaks;
            }
        });

        return htmlString;
    }

    //Returns the default tags
    public static defaultTags(): Array<BBTag> {
        let bbTags = new Array<BBTag>();

        //Simple tags
        bbTags["b"] = new BBTag("b", true, false, false);
        bbTags["i"] = new BBTag("i", true, false, false);
        bbTags["u"] = new BBTag("u", true, false, false);

        bbTags["text"] = new BBTag("text", true, false, true, (tag, content, attr) => {
            return content;
        });

        bbTags["img"] = new BBTag("img", true, false, false, (tag, content, attr) => {
            return "<img src=\"" + content + "\" />";
        });

        bbTags["url"] = new BBTag("url", true, false, false, (tag, content, attr) => {
            let link = content;

            if (attr["url"] != undefined) {
                link = escapeHTML(attr["url"]);
            }

            if (!startsWith(link, "http://") && !startsWith(link, "https://")) {
                link = "http://" + link;
            }

            return "<a href=\"" + link + "\" target=\"_blank\">" + content + "</a>";
        });

        bbTags["code"] = new BBTag("code", true, false, true, (tag, content, attr) => {
            let lang = attr["lang"];

            if (lang !== undefined) {
                return "<code class=\"" + escapeHTML(lang) + "\">" + content + "</code>";
            } else {
                return "<code>" + content + "</code>";
            }
        });

        return bbTags;
    }

    public static defaultOptions() {
            //let attrNameChars = "[a-zA-Z0-9\\.\\-_:;/]";
//let attrNameChars = "\\w";

// original pattern of https://github.com/svenslaggare/BBCodeParser
//let attrValueChars = "[a-zA-Z0-9\\.\\-_:;#/\\s]";

// allow all characters
//let attrValueChars = "[^\'\"]";


// url tag : allow ? , = , & for query parameters

        return {
            escapeHTML: false,
            attrNameChars : "[a-zA-Z0-9\\.\\-_:;/]",
            attrValueChars : "[\?\=\&a-zA-Z0-9\\.\\-_:;#/\\s]"        
     };
    }

    public static escapeHTML(content: string) {
        return escapeHTML(content);
    }

    public static startsWith(str:
        string, startStr: string) {
        return startsWith(str, startStr);
    }

    public static endsWith(str: string, endStr: string) {
        return endsWith(str, endStr);
    }
}
