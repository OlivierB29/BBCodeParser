
import {BBCodeParser} from "../src/bbCodeParser";


describe("BBCodeParser parseString", () => {

    const parser = new BBCodeParser(BBCodeParser.defaultTags(),
     {
        escapeHTML: false,
        attrNameChars : "[a-zA-Z0-9\\.\\-_:;/]",
        attrValueChars : "[\?\=\&a-zA-Z0-9\\.\\-_:;#/\\s]"        
 });
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

    it("Should parse url with query" , () => {
        let expected = '<a href="https://somesite.org/read/0000000000000000000?authid=aaaaaaaaaaaaaa&amp;fbclid=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" target="_blank">here</a>';      
        expect(parser.parseString("[url=\"https://somesite.org/read/0000000000000000000?authid=aaaaaaaaaaaaaa&fbclid=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\"]here[/url]") === expected ).toBeTruthy();
    });

    it("Should not parse url with query" , () => {
        let parser2 = new BBCodeParser(BBCodeParser.defaultTags(),
        {
           escapeHTML: false,
           attrNameChars : "[a-zA-Z0-9\\.\\-_:;/]",
           attrValueChars : "[a-zA-Z0-9\\.\\-_:;#/\\s]"        
        });

        let expected = "<a href=\"https://drive.google.com/file/d/abcdefghijklmnopqrstuvwxyz/view?usp=sharing\" target=\"_blank\">document</a>";
        expect(parser2.parseString("[url=\"https://drive.google.com/file/d/abcdefghijklmnopqrstuvwxyz/view?usp=sharing\"]document[/url]") === expected ).toBeFalsy();
    });


} );
