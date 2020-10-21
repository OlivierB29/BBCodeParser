
import {BBCodeParser} from "../src/bbCodeParser";


describe("BBCodeParser parseString", () => {

    const parser = new BBCodeParser(BBCodeParser.defaultTags());
    it("Should parse basic url tag" , () => {
        
        expect(parser.parseString("[url]https://github.com[/url]")).toMatch('<a href="https://github.com" target="_blank">https://github.com</a>');
    });

    it("Should parse url tag" , () => {

        expect(parser.parseString("[url=\"https://github.com\"]GitHub[/url]")).toMatch('<a href="https://github.com" target="_blank">GitHub</a>');
    });

    it("Should parse url with query" , () => {
        let expected = "<a href=\"https://drive.google.com/file/d/abcdefghijklmnopqrstuvwxyz/view?usp=sharing\" target=\"_blank\">document</a>";
        expect(parser.parseString("[url=\"https://drive.google.com/file/d/abcdefghijklmnopqrstuvwxyz/view?usp=sharing\"]document[/url]") === expected ).toBeTruthy();
    });


} );
