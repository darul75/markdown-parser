/* 
GITHUB MARKDOWN EXTRACTOR RULES

https://guides.github.com/features/mastering-markdown/
*/

{
 var others = [];

 function extractList(list, index) {
    var headings = [], lists = [], sections= [], 
    italics = [], strikethroughs= [], bolds= [],
    lists = [], listsOrdered= [], tasks= [],
    links= [], codes= [], i;

    for (i = 0; i < list.length; i++) {
      if (list[i].heading)
       headings.push(list[i].heading);
      if (list[i].lists)
       lists.push(list[i].lists);
      if (list[i].section)
       sections.push(list[i].section);
      if (list[i].bold)
       bolds.push(list[i].bold);
      if (list[i].italic)
       italics.push(list[i].italic);
      if (list[i].strikethrough)
       strikethroughs.push(list[i].strikethrough);
      if (list[i].listsOrdered)
       listsOrdered.push(list[i].listsOrdered);
      if (list[i].tasks)
       tasks.push(list[i].tasks);
      if (list[i].link)
       links.push(list[i].link);
      if (list[i].code)
       codes.push(list[i].code);
   
    }

    return {
     bolds: bolds,
     codes: codes,
     headings: headings,
     italics: italics,
     italics: italics,
     links: links,
     lists: lists,
     listsOrdered: listsOrdered,
     sections: sections,
     strikethroughs: strikethroughs,
     tasks: tasks
    };
 }

}

start
  = info:Markdown+ {
  return extractList(info);
}

Markdown
  = EndOfLine / Heading / Bold / Italic / Strikethrough / Tasks / Lists / OrderedLists / InlineCode / MultiplelLineCode / Link / Link2 / Section / Others 

Digit1_9      = [1-9]
EOF = !.
crlf = '\r\n' / '\r' / '\n'
EatLine = (!crlf !EOF .)*
EndOfLine = ('\r\n' / '\n' / '\r')+
Space = ' '+ / '\t' / EndOfLine
AnyText = [\x20-\x27] / [\x2B-\x40] / [\x41-\x5A] / [\x61-\x7A]
ListText = [\x20-\x27] / [\x2B-\x40] / [\x41-\x5A] / [\x60-\x7A]
LinkText = [\x20-\x2A] / [\x2B-\x40] / [\x41-\x5B] / [\x61-\x7A]
CodeText = [\x20-\x2A] / [\x2B-\x40] / [\x41-\x5D] / [\x61-\x7E] / EndOfLine
AnyText2 = [\x20-\x40] / [\x41-\x60] / [\x61-\xFFFF]
SectionText = [-]+ / ([\x20-\x40] / [\x41-\x60] / [\x61-\x7A])

Others
  = text:AnyText2+ Space? {
    return {
     others: text.join("")
    }
}

Heading
  = "#"+ text:AnyText+ Space? {
    return {
     heading: text.join("")
    }
}

/* Sceenshot ------------- */
Section
  = text:SectionText+ ('\r\n' / '\n' / '\r') [-]+ EndOfLine? {
    return {
     section: text.join("")
    }
}

/* *Italic* */
Italic
  = (AnyText+)? [\x2A] text:AnyText+ [\x2A] Space?  {
    return {
     italic: text.join("")
    }
}

/* **Italic** */
Bold
  = (AnyText+)? [\x2A][\x2A] text:AnyText+ [\x2A][\x2A] Space?  {
    return {
     bold: text.join("")
    }
  }

/* ~~Mistaken text.~~ */
Strikethrough
  = [\x7E][\x7E] text:AnyText+ [\x7E][\x7E] Space?  {
    return {
     strikethrough : text.join("")
    }
  }

ListItem
 = ("\x2A " / "\x2D ") text:ListText+ Space?  {return text.join("").trim()}

TaskItem
 = (("- [x] " / "- [ ] ") text:AnyText+ Space?) {return text.join("").trim()}

OrderedListItem
 = "  "? (Digit1_9+ "\x2E ") text:AnyText+ Space? {return text.join("").trim()}

Lists
 = lists:ListItem+ {
   return {
    lists: lists
   }
}

// - [ ] this is an incomplete item
Tasks
 = tasks:TaskItem+ {
   return {
    tasks: tasks
   }
}

OrderedLists
 = lists:OrderedListItem+ {
   return {
    listsOrdered: lists
   }
}

InlineCode
  = AnyText [\x60] text:AnyText+ [\x60] AnyText+ Space? {return text.join("")}

LineCode
  = text:CodeText+ {return text.join("").trim()}

MultiplelLineCode
  = ("```" Space? / "```html" Space? / "```javascript" Space?) code:LineCode+ "```" Space? {
  return {
    code: code
  }
}

// [Visit GitHub!](www.github.com)
LinkTitle
  = ([\x5B] text:LinkText+ [\x5D]) {return text.join("")}

LinkRef
  = [\x28] text:AnyText+ [\x29] {return text.join("")}

Link
  = AnyText+ title:LinkTitle href:LinkRef Space? {
     return {
      link: {
        title: title,
        href: href
      }
     }
    }

Link2
  = title:LinkTitle href:LinkRef Space? {
     return {
      link: {
        title: title,
        href: href
      }
     }
    }


/* Macros */

h
  = [0-9a-f]i

nonascii
  = [\x80-\uFFFF]

unicode
  = "\\" digits:$(h h? h? h? h? h?) ("\r\n" / [ \t\r\n\f])? {
      return String.fromCharCode(parseInt(digits, 16));
    }

escape
  = unicode
  / "\\" ch:[^\r\n\f0-9a-f]i { return ch; }

nmstart
  = [_a-z]i
  / nonascii
  / escape

nmchar
  = [_a-z0-9-]i
  / nonascii
  / escape

string1
  = '"' chars:([^\n\r\f\\"] / "\\" nl:nl { return ""; } / escape)* '"' {
      return chars.join("");
    }

string2
  = "'" chars:([^\n\r\f\\'] / "\\" nl:nl { return ""; } / escape)* "'" {
      return chars.join("");
    }

string
  = chars: (string1 / [_a-zA-Z0-9-\n]+) { return chars.join("")}

comment
  = "/*" [^*]* "*"+ ([^/*] [^*]* "*"+)* "/"

ident
  = prefix:$"-"? start:nmstart chars:nmchar* {
      return prefix + start + chars.join("");
    }

name
  = chars:nmchar+ { return chars.join(""); }

num
  = [+-]? ([0-9]+ / [0-9]* "." [0-9]+) ("e" [+-]? [0-9]+)? {
      return parseFloat(text());
    }

url
  = chars:([!#$%&*-\[\]-~] / nonascii / escape)* { return chars.join(""); }

s
  = [ \t\r\n\f]+

w
  = s?

nl
  = "\n"
  / "\r\n"
  / "\r"
  / "\f"