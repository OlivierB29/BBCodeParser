
import {BBCodeParser} from "../src/bbCodeParser";


describe("BBCodeParser parseString", () => {

    
    it("Should parse basic url tag" , () => {
        const parser = new BBCodeParser(BBCodeParser.defaultTags());;
        expect(parser.parseString("[url]https://github.com[/url]")).toMatch('<a href="https://github.com" target="_blank">https://github.com</a>');
    });

    it("Should parse url tag" , () => {
        const parser = new BBCodeParser(BBCodeParser.defaultTags());;
        expect(parser.parseString("[url=\"https://github.com\"]GitHub[/url]")).toMatch('<a href="https://github.com" target="_blank">GitHub</a>');
    });

    it("Should parse url with query" , () => {
        const parser = new BBCodeParser(BBCodeParser.defaultTags());;
        expect(parser.parseString("[url=\"https://drive.google.com/file/d/abcdefghijklmnopqrstuvwxyz/view?usp=sharing\"]document[/url]")).toMatch('<a href="https://drive.google.com/file/d/abcdefghijklmnopqrstuvwxyz/view?usp=sharing" target="_blank">document</a>');
    });


} );
