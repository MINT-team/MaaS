ace.define("ace/mode/doc_comment_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
    
    var DocCommentHighlightRules = function() {
        this.$rules = {
            "start" : [ {
                token : "comment.doc.tag",
                regex : "@[\\w\\d_]+" // TODO: fix email addresses
            }, 
            DocCommentHighlightRules.getTagRule(),
            {
                defaultToken : "comment.doc",
                caseInsensitive: true
            }]
        };
    };
    
    oop.inherits(DocCommentHighlightRules, TextHighlightRules);
    
    DocCommentHighlightRules.getTagRule = function(start) {
        return {
            token : "comment.doc.tag.storage.type",
            regex : "\\b(?:TODO|FIXME|XXX|HACK)\\b"
        };
    };
    
    DocCommentHighlightRules.getStartRule = function(start) {
        return {
            token : "comment.doc", // doc comment
            regex : "\\/\\*(?=\\*)",
            next  : start
        };
    };
    
    DocCommentHighlightRules.getEndRule = function (start) {
        return {
            token : "comment.doc", // closing comment
            regex : "\\*\\/",
            next  : start
        };
    };
    
    exports.DocCommentHighlightRules = DocCommentHighlightRules;

});








ace.define("ace/mode/dsl_highlight_rules",["require","exports","module","ace/lib/oop", "ace/mode/doc_comment_highlight_rules", "ace/mode/text_highlight_rules"],function(require, exports, module) {
"use strict";

    var oop = require("../lib/oop");
    var DocCommentHighlightRules = require("./doc_comment_highlight_rules").DocCommentHighlightRules;
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
    var identifierRe = "[a-zA-Z\\$_\u00a1-\uffff][a-zA-Z\\d\\$_\u00a1-\uffff]*";
    
    var DSLHighlightRules = function() {
    
        var keywordControls = (
        "Export|SendEmail|function"
    );
    
    var storageType = (
        "Dashboard|Collection|Document|row|Cell|action|column"
    );
    
    var properties = (
        "columnLabel|label|name|order|query|sortby|table|type|transformation|value|" +
        "perpage|populate|selectable|sortable"
    );

    var builtinConstants = (
        "true|false|null"
    );
    
        var keywordMapper = this.$keywords = this.createKeywordMapper({
            "keyword.control" : keywordControls,
            "storage.type" : storageType,
            "variable.language": "this",
            "variable" : properties,
            "constant.language": builtinConstants
        }, "identifier");
    
        
        var kwBeforeRe = "case|do|else|finally|in|instanceof|return|throw|try|typeof|yield|void";
        var escapedRe = "\\\\(?:x[0-9a-fA-F]{2}|" + // hex
        "u[0-9a-fA-F]{4}|" + // unicode
        "u{[0-9a-fA-F]{1,6}}|" + // es6 unicode
        "[0-2][0-7]{0,2}|" + // oct
        "3[0-7][0-7]?|" + // oct
        "[4-7][0-7]?|" + //oct
        ".)";
        
        this.$rules = {
            "no_regex" : [
                DocCommentHighlightRules.getStartRule("doc-start"),
                comments("no_regex"),
                {
                token : "string",
                regex : "'(?=.)",
                next  : "qstring"
                }, {
                    token : "string",
                    regex : '"(?=.)',
                    next  : "qqstring"
                }, {
                    token : "constant.numeric", // hex
                    regex : /0(?:[xX][0-9a-fA-F]+|[bB][01]+)\b/
                }, {
                    token : "constant.numeric", // float
                    regex : /[+-]?\d[\d_]*(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?\b/
                }, {
                    token : [
                        "storage.type", "punctuation.operator", "support.function",
                        "punctuation.operator", "entity.name.function", "text","keyword.operator"
                    ],
                    regex : "(" + identifierRe + ")(\\.)(prototype)(\\.)(" + identifierRe +")(\\s*)(=)",
                    next: "function_arguments"
                }, {
                    token : [
                        "storage.type", "punctuation.operator", "entity.name.function", "text",
                        "keyword.operator", "text", "storage.type", "text", "paren.lparen"
                    ],
                    regex : "(" + identifierRe + ")(\\.)(" + identifierRe +")(\\s*)(=)(\\s*)(function)(\\s*)(\\()",
                    next: "function_arguments"
                }, {
                    token : [
                        "entity.name.function", "text", "keyword.operator", "text", "storage.type",
                        "text", "paren.lparen"
                    ],
                    regex : "(" + identifierRe +")(\\s*)(=)(\\s*)(function)(\\s*)(\\()",
                    next: "function_arguments"
                }, {
                    token : [
                        "storage.type", "punctuation.operator", "entity.name.function", "text",
                        "keyword.operator", "text",
                        "storage.type", "text", "entity.name.function", "text", "paren.lparen"
                    ],
                    regex : "(" + identifierRe + ")(\\.)(" + identifierRe +")(\\s*)(=)(\\s*)(function)(\\s+)(\\w+)(\\s*)(\\()",
                    next: "function_arguments"
                }, {
                    token : [
                        "storage.type", "text", "entity.name.function", "text", "paren.lparen"
                    ],
                    regex : "(function)(\\s+)(" + identifierRe + ")(\\s*)(\\()",
                    next: "function_arguments"
                }, {
                    token : [
                        "entity.name.function", "text", "punctuation.operator",
                        "text", "storage.type", "text", "paren.lparen"
                    ],
                    regex : "(" + identifierRe + ")(\\s*)(:)(\\s*)(function)(\\s*)(\\()",
                    next: "function_arguments"
                }, {
                    token : [
                        "text", "text", "storage.type", "text", "paren.lparen"
                    ],
                    regex : "(:)(\\s*)(function)(\\s*)(\\()",
                    next: "function_arguments"
                }, {
                    token : "keyword",
                    regex : "(?:" + kwBeforeRe + ")\\b",
                    next : "start"
                }, {
                    token : ["support.constant"],
                    regex : /that\b/
                }, {
                    token : ["storage.type", "punctuation.operator", "support.function.firebug"],
                    regex : /(console)(\.)(warn|info|log|error|time|trace|timeEnd|assert)\b/
                }, {
                    token : keywordMapper,
                    regex : identifierRe
                }, {
                    token : "punctuation.operator",
                    regex : /[.](?![.])/,
                    next  : "property"
                }, {
                    token : "keyword.operator",
                    regex : /--|\+\+|\.{3}|===|==|=|!=|!==|<+=?|>+=?|!|&&|\|\||\?:|[!$%&*+\-~\/^]=?/,
                    next  : "start"
                }, {
                    token : "punctuation.operator",
                    regex : /[?:,;.]/,
                    next  : "start"
                }, {
                    token : "paren.lparen",
                    regex : /[\[({]/,
                    next  : "start"
                }, {
                    token : "paren.rparen",
                    regex : /[\])}]/
                }, {
                    token: "comment",
                    regex: /^#!.*$/
                }
            ],
            property: [{
                    token : "text",
                    regex : "\\s+"
                }, {
                    token : [
                        "storage.type", "punctuation.operator", "entity.name.function", "text",
                        "keyword.operator", "text",
                        "storage.type", "text", "entity.name.function", "text", "paren.lparen"
                    ],
                    regex : "(" + identifierRe + ")(\\.)(" + identifierRe +")(\\s*)(=)(\\s*)(function)(?:(\\s+)(\\w+))?(\\s*)(\\()",
                    next: "function_arguments"
                }, {
                    token : "punctuation.operator",
                    regex : /[.](?![.])/
                }, {
                    token : "support.function",
                    regex : /(s(?:h(?:ift|ow(?:Mod(?:elessDialog|alDialog)|Help))|croll(?:X|By(?:Pages|Lines)?|Y|To)?|t(?:op|rike)|i(?:n|zeToContent|debar|gnText)|ort|u(?:p|b(?:str(?:ing)?)?)|pli(?:ce|t)|e(?:nd|t(?:Re(?:sizable|questHeader)|M(?:i(?:nutes|lliseconds)|onth)|Seconds|Ho(?:tKeys|urs)|Year|Cursor|Time(?:out)?|Interval|ZOptions|Date|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Date|FullYear)|FullYear|Active)|arch)|qrt|lice|avePreferences|mall)|h(?:ome|andleEvent)|navigate|c(?:har(?:CodeAt|At)|o(?:s|n(?:cat|textual|firm)|mpile)|eil|lear(?:Timeout|Interval)?|a(?:ptureEvents|ll)|reate(?:StyleSheet|Popup|EventObject))|t(?:o(?:GMTString|S(?:tring|ource)|U(?:TCString|pperCase)|Lo(?:caleString|werCase))|est|a(?:n|int(?:Enabled)?))|i(?:s(?:NaN|Finite)|ndexOf|talics)|d(?:isableExternalCapture|ump|etachEvent)|u(?:n(?:shift|taint|escape|watch)|pdateCommands)|j(?:oin|avaEnabled)|p(?:o(?:p|w)|ush|lugins.refresh|a(?:ddings|rse(?:Int|Float)?)|r(?:int|ompt|eference))|e(?:scape|nableExternalCapture|val|lementFromPoint|x(?:p|ec(?:Script|Command)?))|valueOf|UTC|queryCommand(?:State|Indeterm|Enabled|Value)|f(?:i(?:nd|le(?:ModifiedDate|Size|CreatedDate|UpdatedDate)|xed)|o(?:nt(?:size|color)|rward)|loor|romCharCode)|watch|l(?:ink|o(?:ad|g)|astIndexOf)|a(?:sin|nchor|cos|t(?:tachEvent|ob|an(?:2)?)|pply|lert|b(?:s|ort))|r(?:ou(?:nd|teEvents)|e(?:size(?:By|To)|calc|turnValue|place|verse|l(?:oad|ease(?:Capture|Events)))|andom)|g(?:o|et(?:ResponseHeader|M(?:i(?:nutes|lliseconds)|onth)|Se(?:conds|lection)|Hours|Year|Time(?:zoneOffset)?|Da(?:y|te)|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Da(?:y|te)|FullYear)|FullYear|A(?:ttention|llResponseHeaders)))|m(?:in|ove(?:B(?:y|elow)|To(?:Absolute)?|Above)|ergeAttributes|a(?:tch|rgins|x))|b(?:toa|ig|o(?:ld|rderWidths)|link|ack))\b(?=\()/
                }, {
                    token : "support.function.dom",
                    regex : /(s(?:ub(?:stringData|mit)|plitText|e(?:t(?:NamedItem|Attribute(?:Node)?)|lect))|has(?:ChildNodes|Feature)|namedItem|c(?:l(?:ick|o(?:se|neNode))|reate(?:C(?:omment|DATASection|aption)|T(?:Head|extNode|Foot)|DocumentFragment|ProcessingInstruction|E(?:ntityReference|lement)|Attribute))|tabIndex|i(?:nsert(?:Row|Before|Cell|Data)|tem)|open|delete(?:Row|C(?:ell|aption)|T(?:Head|Foot)|Data)|focus|write(?:ln)?|a(?:dd|ppend(?:Child|Data))|re(?:set|place(?:Child|Data)|move(?:NamedItem|Child|Attribute(?:Node)?)?)|get(?:NamedItem|Element(?:sBy(?:Name|TagName|ClassName)|ById)|Attribute(?:Node)?)|blur)\b(?=\()/
                }, {
                    token :  "support.constant",
                    regex : /(s(?:ystemLanguage|cr(?:ipts|ollbars|een(?:X|Y|Top|Left))|t(?:yle(?:Sheets)?|atus(?:Text|bar)?)|ibling(?:Below|Above)|ource|uffixes|e(?:curity(?:Policy)?|l(?:ection|f)))|h(?:istory|ost(?:name)?|as(?:h|Focus))|y|X(?:MLDocument|SLDocument)|n(?:ext|ame(?:space(?:s|URI)|Prop))|M(?:IN_VALUE|AX_VALUE)|c(?:haracterSet|o(?:n(?:structor|trollers)|okieEnabled|lorDepth|mp(?:onents|lete))|urrent|puClass|l(?:i(?:p(?:boardData)?|entInformation)|osed|asses)|alle(?:e|r)|rypto)|t(?:o(?:olbar|p)|ext(?:Transform|Indent|Decoration|Align)|ags)|SQRT(?:1_2|2)|i(?:n(?:ner(?:Height|Width)|put)|ds|gnoreCase)|zIndex|o(?:scpu|n(?:readystatechange|Line)|uter(?:Height|Width)|p(?:sProfile|ener)|ffscreenBuffering)|NEGATIVE_INFINITY|d(?:i(?:splay|alog(?:Height|Top|Width|Left|Arguments)|rectories)|e(?:scription|fault(?:Status|Ch(?:ecked|arset)|View)))|u(?:ser(?:Profile|Language|Agent)|n(?:iqueID|defined)|pdateInterval)|_content|p(?:ixelDepth|ort|ersonalbar|kcs11|l(?:ugins|atform)|a(?:thname|dding(?:Right|Bottom|Top|Left)|rent(?:Window|Layer)?|ge(?:X(?:Offset)?|Y(?:Offset)?))|r(?:o(?:to(?:col|type)|duct(?:Sub)?|mpter)|e(?:vious|fix)))|e(?:n(?:coding|abledPlugin)|x(?:ternal|pando)|mbeds)|v(?:isibility|endor(?:Sub)?|Linkcolor)|URLUnencoded|P(?:I|OSITIVE_INFINITY)|f(?:ilename|o(?:nt(?:Size|Family|Weight)|rmName)|rame(?:s|Element)|gColor)|E|whiteSpace|l(?:i(?:stStyleType|n(?:eHeight|kColor))|o(?:ca(?:tion(?:bar)?|lName)|wsrc)|e(?:ngth|ft(?:Context)?)|a(?:st(?:M(?:odified|atch)|Index|Paren)|yer(?:s|X)|nguage))|a(?:pp(?:MinorVersion|Name|Co(?:deName|re)|Version)|vail(?:Height|Top|Width|Left)|ll|r(?:ity|guments)|Linkcolor|bove)|r(?:ight(?:Context)?|e(?:sponse(?:XML|Text)|adyState))|global|x|m(?:imeTypes|ultiline|enubar|argin(?:Right|Bottom|Top|Left))|L(?:N(?:10|2)|OG(?:10E|2E))|b(?:o(?:ttom|rder(?:Width|RightWidth|BottomWidth|Style|Color|TopWidth|LeftWidth))|ufferDepth|elow|ackground(?:Color|Image)))\b/
                }, {
                    token : "identifier",
                    regex : identifierRe
                }, {
                    regex: "",
                    token: "empty",
                    next: "no_regex"
                }
            ],
            "start": [
                DocCommentHighlightRules.getStartRule("doc-start"),
                comments("start"),
                {
                    token: "string.regexp",
                    regex: "\\/",
                    next: "regex"
                }, {
                    token : "text",
                    regex : "\\s+|^$",
                    next : "start"
                }, {
                    token: "empty",
                    regex: "",
                    next: "no_regex"
                }
            ],
            "regex": [
                {
                    token: "regexp.keyword.operator",
                    regex: "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"
                }, {
                    token: "string.regexp",
                    regex: "/[sxngimy]*",
                    next: "no_regex"
                }, {
                    token : "invalid",
                    regex: /\{\d+\b,?\d*\}[+*]|[+*$^?][+*]|[$^][?]|\?{3,}/
                }, {
                    token : "constant.language.escape",
                    regex: /\(\?[:=!]|\)|\{\d+\b,?\d*\}|[+*]\?|[()$^+*?.]/
                }, {
                    token : "constant.language.delimiter",
                    regex: /\|/
                }, {
                    token: "constant.language.escape",
                    regex: /\[\^?/,
                    next: "regex_character_class"
                }, {
                    token: "empty",
                    regex: "$",
                    next: "no_regex"
                }, {
                    defaultToken: "string.regexp"
                }
            ],
            "regex_character_class": [
                {
                    token: "regexp.charclass.keyword.operator",
                    regex: "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"
                }, {
                    token: "constant.language.escape",
                    regex: "]",
                    next: "regex"
                }, {
                    token: "constant.language.escape",
                    regex: "-"
                }, {
                    token: "empty",
                    regex: "$",
                    next: "no_regex"
                }, {
                    defaultToken: "string.regexp.charachterclass"
                }
            ],
            "function_arguments": [
                {
                    token: "variable.parameter",
                    regex: identifierRe
                }, {
                    token: "punctuation.operator",
                    regex: "[, ]+"
                }, {
                    token: "punctuation.operator",
                    regex: "$"
                }, {
                    token: "empty",
                    regex: "",
                    next: "no_regex"
                }
            ],
            "qqstring" : [
                {
                    token : "constant.language.escape",
                    regex : escapedRe
                }, {
                    token : "string",
                    regex : "\\\\$",
                    next  : "qqstring"
                }, {
                    token : "string",
                    regex : '"|$',
                    next  : "no_regex"
                }, {
                    defaultToken: "string"
                }
            ],
            "qstring" : [
                {
                    token : "constant.language.escape",
                    regex : escapedRe
                }, {
                    token : "string",
                    regex : "\\\\$",
                    next  : "qstring"
                }, {
                    token : "string",
                    regex : "'|$",
                    next  : "no_regex"
                }, {
                    defaultToken: "string"
                }
            ]
        };
        
        this.embedRules(DocCommentHighlightRules, "doc-",
            [ DocCommentHighlightRules.getEndRule("no_regex") ]);
    
        this.normalizeRules();
    };
    
    oop.inherits(DSLHighlightRules, TextHighlightRules);
    
    function comments(next) {
        return [
            {
                token : "comment", // multi line comment
                regex : /\/\*/,
                next: [
                    DocCommentHighlightRules.getTagRule(),
                    {token : "comment", regex : "\\*\\/", next : next || "pop"},
                    {defaultToken : "comment", caseInsensitive: true}
                ]
            }, {
                token : "comment",
                regex : "\\/\\/",
                next: [
                    DocCommentHighlightRules.getTagRule(),
                    {token : "comment", regex : "$|^", next : next || "pop"},
                    {defaultToken : "comment", caseInsensitive: true}
                ]
            }
        ];
    }
    
    exports.DSLHighlightRules = DSLHighlightRules;
});


ace.define("ace/mode/dsl", ["require", "exports", "ace/lib/oop", "ace/mode/text", "ace/mode/dsl_highlight_rules"], function(require, exports, module) {
    "user strict";
    var oop = require("../lib/oop");
    var TextMode = require("./text").Mode;
    var DSLHighlightRules = require("./dsl_highlight_rules").DSLHighlightRules;
    
    var Mode = function() {
        this.HighlightRules = DSLHighlightRules;
    };
    
    oop.inherits(Mode, TextMode);
    
    (function() {
        
        this.lineCommentStart = "//";
        this.blockComment = {start: "/*", end: "*/"};
        
        this.$id = "ace/mode/dsl";
    }).call(Mode.prototype);
    
    exports.Mode = Mode;
});