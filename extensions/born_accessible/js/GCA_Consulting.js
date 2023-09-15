var gca = {
    "version": "1.26",
    "dct:title": "GCA Consulting",
    "dct:description": "Tab in SMART tool for GCA Members to use for EPUB Accessibility Certification",
    "dct:date": "07/01/2023, 09:00:00 AM",
    "dct:publisher": "Benetech",
    "epubComplexity" : {
        "$complexityId": "complexity-levels-section",
        "complexityName": "EPUB Complexity",
        "complexityLevels": [
            {
                "$levelId": "complexity-level-simple",
                "levelName": "Simple",
                "levelDescription": "Straight forward text without any design elements such as figures, tables, list items, links, audio, video, MathML, etc. Typically Trade books fall into this category. Very few if any images, potentially a cover and title page images."
            },
           {
                "$levelId": "complexity-level-moderate",
                "levelName": "Moderate",
                "levelDescription": "EPUBs with up to 0.3 design elements per page such as images, figures, tables, list items, links, MathML, audio, video, etc. Simple JavaScript."
            },
            {
                "$levelId": "complexity-level-complex",
                "levelName": "Complex",
                "levelDescription": "EPUBs with more than 0.3 design elements per page such as images, figures, charts and graphs, tables, list items, links, audio, video, MathML, etc.  Complex JavaScript. Typically STEM Textbooks fall into this category."
            }
       ]
    },
    "bornAccessibleScoring": {
        "$bornAccessibleScoringId": "born-accessible-scoring-section",
        "bornAccessibleScoringName": "Accessibility Scoring",
        "sections": [
            {
                "$sectionId": "section-images",
                "sectionName": "Images",
                "sectionItems": [
                    {
                        "$itemId": "images-cover",
                        "itemName" : "Cover Art",
                        "itemScores": {
                            "N/A": "There was no Cover image",
                            "0": "A cover image is present but there is no descriptive text",
                            "1": "A cover image is present with alt text but is missing some textual information present only on the image, or is too verbose",
                            "2": "A cover image is present with alt text but is missing some information present only in text, or is too verbose",       
                            "3": "A cover image is present and has an acceptable description, however it does not follow the GCA approved template on the structure for a cover image description",       
                            "4": "The cover image was correctly described using alt text"
                        }
                    },
                    {
                        "$itemId": "images-title",
                        "itemName" : "Title Page",
                        "itemScores": {
                            "N/A": "There was no image for the Title Page",
                            "0": "A title image is present but there is no descriptive text",
                            "1": "A title image is present with alt text but it is not described completely, missing key information",
                            "4": "The title image was correctly described using alt text"
                        }
                    },
                    {
                        "$itemId": "images-decorative",
                        "itemName" : "Decorative Image Indicator",
                        "itemScores": {
                            "N/A": "There were no Decorative images found.",
                            "0": "Decorative elements are described or has incorrect aria-role",
                            "1": "role=\"presentation\" correct but missing alt=\"\"",
                            "3": "The alt text is correctly empty but no role=\"presentation\"",
                            "4": "All Decorative images were correctly identified and marked up correctly with alt=\"\" and role=\"presentation\""
                        }
                    },
                    {
                        "$itemId": "images-content-break",
                        "itemName" : "Context Break Image Indicator",
                        "itemScores": {
                            "N/A": "There were no Context Break images found.",
                            "0": "Context Break images was missing <hr> semantic markup",
                            "3": "using <hr> alongside <img role=\"presentation\" ...>",
                            "4": "All Context Break images were marked up using <hr> and CSS with .hr{background-image:url (link to image); background-repeat: no-repeat; ...}, or had alt=&quot;context change&quot;"
                        }
                    },
                    {
                        "$itemId": "images-alt-text",
                        "itemName" : "Includes Alt Text",
                        "itemScores": {
                            "N/A": "There were no images, or the surrounding text adequately described the images.  Note: If there is an extended description, 99% of the time there can be a very short summary in the alt text, unless it is what is in the Fig Caption.",
                            "0": "There is no alt text present for any image, or has meaningless text such as \"image\"",
                            "1": "Alt text included for a small percentage of images",
                            "2": "Alt text present in the majority of images",
                            "3": "Alt text is present in all cases but is problematic; repeats the caption, incorrect/incomplete, etc.",
                            "4": "All images found were described appropriately with alt text"
                        }
                    },
                    {
                        "$itemId": "images-extended-descriptions",
                        "itemName" : "Includes Extended Descriptions",
                        "itemScores": {
                            "N/A": "There were no images, or the surrounding text adequately described the images.",
                            "0": "Complex images would benefit from longer descriptions but there are none",
                            "1": "Long description included for a few select images, despite presence of many complex images",
                            "2": "Long description for the majority of images",
                            "3": "Longer description present in every case but has problematic code.",
                            "4": "Those images which required a longer description were correctly described using appropriate HTML extended description conventions."
                        }
                    },
                    {
                        "$itemId": "images-svg",
                        "itemName" : "SVGs",
                        "itemScores": {
                            "N/A": "There were no SVGs.",
                            "0": "SVG’s did not contain any accessibility markup",
                            "4": "SVG’s had appropriate embedded alt-text, AIRA, and tab indexing within the SVG markup."
                        }
                    },
                    {
                        "$itemId": "images-cover-metadata",
                        "itemName" : "Cover Image (OPF metadata)",
                        "itemScores": {
                            "N/A": "No Cover Image provided",
                            "0": "A cover image is present but not declared in the manifest",
                            "4": "The cover image was correctly identified using the “cover-image” property in the manifest (with supporting <meta name=\"cover\" content=\"cover-image\"/> in the metadata for reading systems not fully upgraded to EPUB 3)"
                        }
                    },
                    {
                        "$itemId": "images-text",
                        "itemName" : "Images containing Text",
                        "itemScores": {
                            "N/A": "No images found containing text",
                            "0": "Text within an Image not fully described with alt text or extended description",
                            "1": "Unnecessary use of images for binary, hexadecimal, morse code, etc.",
                            "3": "Unnecessary use of images containing text, could be done without an image using text characters and CSS styling",
                            "4": "All images containing text are appropriate and fully described"
                        }
                    },
                    {
                        "$itemId": "images-text-image-colorcontrast",
                        "itemName" : "Color Contrast for Images with Text",
                        "itemScores": {
                            "N/A": "No images found containing text",
                            "0": "Image containing text does not meet color contrast requirements",
                            "4": "All Images with text passes color contrast requirements"
                        }
                    },
                    {
                        "$itemId": "images-poetry",
                        "itemName" : "Poetry (Required Visual Styling)",
                        "itemScores": {
                            "N/A": "No images of poems",
                            "0": "Visually styled poem image not described correctly: alt text should describe the visual significance with an extended description of the raw text of the poem. (E.g.: Poem of a tree where the words of the poem are laid out in the shape of a tree)",
                            "1": "Visually styled poem image described correctly, however image was not an SVG to allow for unpixellated enlargement",
                            "2": "Both stylistic and literal description was all included in the alt text, stylistic description should be in the alt text as a short overview where the extended description would have the raw literal text of the poem",
                            "3": "Most poetry images were correctly described both stylistically and literally",
                            "4": "All visually styled images of poems describe the visual significance of the poem, and an extended description containing the actual poem itself"
                        }
                    },
                    {
                        "$itemId": "images-alt-text-length",
                        "itemName" : "Image Alt Text Length",
                        "itemScores": {
                            "N/A": "There were no images, or the surrounding text adequately described the images.",
                            "0": "Most of the image alt text descriptions were too long. Ideally alt text image descriptions are under 200 characters in length.",
                            "2": "Some of the image alt text descriptions were too long. Ideally alt text image descriptions are under 200 characters in length.",
                            "4": "All Image alt text descriptions were of adequate length, i.e., short meaningful descriptions that does not repeat the surrounding text."
                        }
                    }
                ] 
            },
            {
                "$sectionId": "section-audio",
                "sectionName": "Audio",
                "sectionItems": [
                    {
                        "$itemId": "audio-metadata",
                        "itemName" : "Metadata",
                        "itemScores": {
                            "N/A": "There was no embedded audio.",
                            "0": "No metadata describing the embedded audio",
                            "2": "Metadata present but incomplete",
                            "4": "Audio tracks had the required metadata present."
                        }
                    },
                    {
                        "$itemId": "audio-controls",
                        "itemName" : "Controls Present",
                        "itemScores": {
                            "N/A": "There was no embedded audio.",
                            "0": "No controls attached to the audio",
                            "2": "Controls were present but had a scripted trigger",
                            "4": "Audio tracks had the required controls present."
                        }
                    },
                    {
                        "$itemId": "audio-transcripts",
                        "itemName" : "Transcripts available or Sign-language interpretation provided via an associated video element",
                        "itemScores": {
                            "N/A": "There was no embedded audio.",
                            "0": "There are no transcripts or sign-language interpretation for audio.",
                            "1": "Transcripts or sign-language interpretation provided for some of the audio.",
                            "2": "Transcript or sign-language interpretation is partial or incomplete.",
                            "3": "Transcript or sign-language interpretation present but via auto-generated subtitles, say, in a YouTube link.",
                            "4": "Transcript of Audio tracks was present, or Sign-language interpretation provided via an associated video element."
                        }
                    },
                    {
                        "$itemId": "audio-background-noise",
                        "itemName" : "Background Noise",
                        "itemScores": {
                            "N/A": "There was no embedded audio",
                            "0": "There was background audio greater than 20db which could not be adjusted",
                            "4": "There was no background audio or you could remove the background audio."
                        }
                    }
                ] 
            },
            {
                "$sectionId": "section-video",
                "sectionName": "Video",
                "sectionItems": [
                    {
                        "$itemId": "video-metadata",
                        "itemName" : "Metadata",
                        "itemScores": {
                            "N/A": "There was no embedded video.",
                            "0": "No metadata describing the embedded video",
                            "2": "Metadata present but incomplete",
                            "4": "Video had the required metadata present."
                        }
                    },
                    {
                        "$itemId": "video-controls",
                        "itemName" : "Controls Present",
                        "itemScores": {
                            "N/A": "There was no embedded video.",
                            "0": "No controls attached to the video",
                            "2": "Controls were present but had a scripted trigger",
                            "4": "Video had the required controls present."
                        }
                    },
                    {
                        "$itemId": "video-captions",
                        "itemName" : "Captions",
                        "itemScores": {
                            "N/A": "There was no embedded video.",
                            "0": "There are no captions for the video",
                            "1": "Transcripts or sign-language interpretation provided for some of the video clips.",
                            "2": "Transcript or sign-language interpretation is partial or incomplete.",
                            "3": "Transcript or sign-language interpretation present but via auto-generated subtitles, say, in a YouTube link.",
                            "4": "Captioning/Transcripts of the Video was present."
                        },
                        "wcagScoreFrom": ["sc-1.2.2"]
                    },
                    {
                        "$itemId": "video-descriptions",
                        "itemName" : "Audio Descriptions",
                        "itemScores": {
                            "N/A": "There was no embedded video or no synchronized media required.",
                            "0": "There are no audio descriptions for the time-based/synchronized media",
                            "2": "Audio descriptions is partial or incomplete for the time-based/synchronized media.",
                            "4": "Audio Descriptions of the media was present and correct."
                        },
                        "wcagScoreFrom": ["sc-1.2.3"]
                    },
                    {
                        "$itemId": "video-background-noise",
                        "itemName" : "Background Noise",
                        "itemScores": {
                            "N/A": "There was no embedded audio",
                            "0": "There was background audio greater than 20db which could not be adjusted",
                            "4": "There was no background audio or you could remove the background audio."
                        }
                    }
                ] 
            },
            {
                "$sectionId": "section-general",
                "sectionName": "General Accessibility",
                "sectionItems": [
                    {
                    "$itemId": "general-reading-order",
                    "itemName" : "Correct Reading Order",
                    "itemScores": {
                        "0": "The reading order does not follow the structure of the book",
                        "1": "Small issues with reading order (i.e. asides not defined correctly and read as part of the main)",
                        "4": "All content read in the correct order."
                    },
                    "wcagScoreFrom": ["sc-1.3.2","sc-2.4.3"]
                },
                    {
                        "$itemId": "general-structural-hiearchy",
                        "itemName" : "Structural Hierarchy",
                        "itemScores": {
                            "0": "No header tags used anywhere",
                            "1": "Some headers marked with <p> tags, and visual style from CSS",
                            "2": "Troublesome hierarchy with no top-level tags in individual HTML files",
                            "3": "The hierarchy flows inconsistently, jumping header levels, or does not match the TOC",
                            "4": "Structural Hierarchy present and meaningful"
                        }
                    },
                    {
                        "$itemId": "general-usability",
                        "itemName" : "Usability",
                        "itemScores": {
                            "0": "Usability is seriously hampered by file size, number of images, overlong HTML files. Since there is no WCAG specific guideline then we must add in the accessibility summary that this is unusable due to xyz issues.",
                            "1": "The CSS will interfere with legibility; i.e. font color set to black",
                            "2": "Font size is set by default making up/down-sizing difficult in some RSs",
                            "3": "Confusing reader experience for some reason (navigation quirks, hyperlinks too small to grab, etc.) Or images could be compressed to save some file size.",
                            "4": "All aspects of this EPUB are usable to everyone"
                        }
                    },
                    {
                        "$itemId": "general-landmarks",
                        "itemName" : "Landmarks - Navigation Document (Nav Doc)",
                        "itemScores": {
                            "0": "No landmarks provided in Nav Doc",
                            "1": "Some landmarks specified, but missing the minimal set and others listing in the Nav Doc. The start of content should be marked in the Nav Doc",
                            "2": "Only the minimal set of landmarks (toc and bodymatter) are provided when more are available",
                            "3": "Content would benefit from additional lists (figure, tables, maps)",
                            "4": "Robust use of landmarks in the Nav Doc"
                        }
                    },
                    {
                        "$itemId": "general-landmarks-content",
                        "itemName" : "Landmarks (Per Page)",
                        "itemScores": {
                            "0": "No landmarks were found in content",
                            "1": "Landmarks are marked up incorrectly or landmarks missing unique aria labels",
                            "2": "Excessive use of landmarks found (>5 landmarks were found per page)",
                            "4": "Full set of landmarks found"
                        }
                    },
                    {
                        "$itemId": "general-color-contrast",
                        "itemName" : "Color Contrast",
                        "itemScores": {
                            "N/A": "No background coloring or images requiring coloring contrast",
                            "0": "Color contrast failed minimum levels required. (AA – Requirement)",
                            "4": "All overlapping colors were correctly contrasted"
                        },
                        "wcagScoreFrom": ["sc-1.4.3"]
                    },
                    {
                        "$itemId": "general-emphasis-bolding",
                        "itemName" : "Emphasis and Bolding",
                        "itemScores": {
                            "N/A": "No emphasis or bolding present",
                            "0": "<strong> and <em> are used incorrectly. Used for styling, not semantic emphasis",
                            "1": "<span class=”strong”> and <span class=”em”> used instead of correct tags",
                            "2": "Inconsistent mixture of use",
                            "4": "Emphasis & Bolding done correctly (i.e. <b> and <i> for visual styling, where <strong> and <em> are used to semantically stress the tagged content)"
                        }
                    },
                    {
                        "$itemId": "general-title-element",
                        "itemName" : "XHTML Title Element",
                        "itemScores": {
                            "0": "Used incorrectly; i.e. book name used in every XHTML file's title instead of the name of that chapter or section",
                            "2": "Some pages did not have an appropriate title",
                            "3": "Minor issues with some titles",
                            "4": "title of each XHTML file named correctly"
                        },
                        "wcagScoreFrom": ["sc-2.4.2"]
                    },
                    {
                        "$itemId": "general-inline-styling",
                        "itemName" : "Inline Styling",
                        "itemScores": {
                            "N/A": "No inline styling found",
                            "0": "Inline styling is used extensively and will interfere with presentation",
                            "1": "Inline styling is used to size images which will interfere with responsiveness",
                            "2": "There are some minor instance of inline style in the HTML files",
                            "3": "Extensive use of non-breaking spaces to manage content layout",
                            "4": "Inline styling is avoided entirely; all styling comes from CSS"
                        }
                    },
                    {
                        "$itemId": "general-annotations",
                        "itemName" : "Annotations",
                        "itemScores": {
                            "N/A": "No annotations found",
                            "0": "Annotations incorrectly marked up",
                            "4": "HTML Annotations correctly used"
                        }
                    },
                    {
                        "$itemId": "general-superscripts-subscripts",
                        "itemName" : "Superscripts and Subscripts",
                        "itemScores": {
                            "N/A": "No superscripts or subscripts present",
                            "0": "superscripts and subscripts were done with CSS only, no semantics provided",
                            "4": "superscript and subscripts were done correctly with <sup> <sub> markup"
                        }
                    },
                    {
                        "$itemId": "general-attributes",
                        "itemName" : "Attributes Placement",
                        "itemScores": {
                            "0": "epub:type are captured in <body> element where there exists an equivalent role such as doc-chapter.",
                            "4": "No attributes are captured in <body> which have an associated role value.  Note: Ok to have <body epub:type=\"bodymatter\">"
                        }
                    },
                    {
                        "$itemId": "general-headings-multiline",
                        "itemName" : "Multi-Line Visual Formatting of Headings",
                        "itemScores": {
                            "N/A": "No Multi-Line headings",
                            "0": "Multi-line Headings used (i.e. <br/> within the heading)",
                            "4": "Multi-line Headings used best practice of spans with CSS display:block"
                        }
                    },
                    {
                        "$itemId": "general-headings-bold-italic",
                        "itemName" : "Italic and Bolding within Headers",
                        "itemScores": {
                            "N/A": "No Bold / Italic present within Headings",
                            "0": "Complete Heading is either Bold or Italic with separate <b>/<i> tags (eg: <h1><b>Heading Topic</b></h1>)",
                            "4": "CSS correctly used to Heading levels adding Bold or Italic making entire Heading bolded or italicized."
                        }
                    },
                    {
                        "$itemId": "general-section-labels",
                        "itemName" : "Sections are Correctly Labelled",
                        "itemScores": {
                            "N/A": "No Sections present",
                            "0": "None of the sections are labelled",
                            "2": "Some of the sections are missing a label",
                            "4": "All Sections are labelled correctly"
                        }
                    },
                    {
                        "$itemId": "general-dropcaps",
                        "itemName" : "Embedded Visual Styling e.g.: Drop Caps, smallCap, etc.",
                        "itemScores": {
                            "N/A": "No embedded visual styling e.g.: Drop Cap, smallcaps, etc.",
                            "0": "Use of <span>, <i>, <b> or other inline HTML elements within individual words causing screen readers to mispronounce the word.  Drop Caps / smallcaps are the usual culprit of this issue. (i.e., use of <spans> instead of CSS selectors)",
                            "2": "Some embedded visual styling within individual words",
                            "4": "Correct use of CSS Selectors to add visual styling to certain characters in a word and do not affect Assistive Technology reading the entire word"
                        }
                    },
                    {
                        "$itemId": "general-allcaps",
                        "itemName" : "All CAPS",
                        "itemScores": {
                            "N/A": "No words found written in all capital letters, or are acronyms which don't apply",
                            "0": "Headings written entirely in capital letters",
                            "1": "Many words or phrases written entirely in capital letters",
                            "3": "Few words written entirely in capital letters",
                            "4": "Correct CSS styling used for all capitalized words"
                            
                        }
                    },
                    {
                        "$itemId": "general-overuse-italics",
                        "itemName" : "Overuse of Italicized Words",
                        "itemScores": {
                            "N/A": "No words found styled with italics",
                            "0": "Many words or phrases styled entirely in italics",
                            "4": "Only a few words styled with italics"
                        }
                    },
                    {
                        "$itemId": "general-body-multiline",
                        "itemName" : "Multi-Line Visual Formatting of Body Text",
                        "itemScores": {
                            "N/A": "No visual formatting found using <br/>'s",
                            "0": "Extensive use of visual formatting using <br/>'s",
                            "3": "Some limited use of visual formatting using <br/>'s",
                            "4": "Correct use of CSS block for visual formatting of text or <br>'s correctly used in visual patterned poetry, where pausing at end of line is appropriate"
                        }
                    },
                    {
                        "$itemId": "general-repeated-characters",
                        "itemName" : "Repeated Characters",
                        "itemScores": {
                            "N/A": "No repeated characters present",
                            "0": "Repeated characters are announced to Assistive Technology (AT)",
                            "3": "Repeated characters are hidden to AT (eg. <span aria-hidden=\"true\">____________</span>)",
                            "4": "Repeated characters are meaningfully spoken by AT (eg. <span role=\"img\" aria-label=\"answer field\">____________</span>)"
                        }
                    },
                    {
                        "$itemId": "general-redacted-text",
                        "itemName" : "Redacted Text",
                        "itemScores": {
                            "N/A": "No redacted text present",
                            "0": "Redacted Text visual only",
                            "3": "Redacted Text is spoken by AT (eg. <span role=\"img\" aria-label=\"redacted text\">███████████</span>). However, no information was provided about the number of words, sentences, paragraphs that were redacted.",
                            "4": "Redacted Text is meaningfully spoken by AT (eg. <span role=\"img\" aria-label=\"redacted 3 words\">███ ██ ██████</span>)"
                        }
                    },
                    {
                        "$itemId": "general-blockquote",
                        "itemName" : "Blockquote",
                        "itemScores": {
                            "N/A": "No blockquotes present",
                            "0": "all blockquotes not correctly identified such as marked using <p> instead of <blockquote>",
                            "4": "All blockquotes correctly identified using <blockquote>"
                        }
                    }
                      
                ]
            },
            {
                "$sectionId": "section-language",
                "sectionName": "Language",
                "sectionItems": [
                    {
                        "$itemId": "language-decoloration-opf",
                        "itemName" : "EPUBs main Language Declared in OPF's Metadata",
                        "itemScores": {
                            "0": "No language is declared in the EPUB, (ie: missing <dc:language> metadata)",
                            "1": "language metadata is inaccurate in OPF file",
                            "4": "EPUB’s main Language declared correctly in the metadata of the OPF file"
                        },
                        "wcagScoreFrom": ["sc-3.1.1"]
                    },
                    {
                        "$itemId": "xmllanguage-decoloration-opf",
                        "itemName" : "XML Language Declared in OPF File",
                        "itemScores": {
                            "0": "xml:lang attribute is missing or is incorrect in <package> element of the OPF file",
                            "4": "xml:lang attribute language declared correctly in the <package> element of the OPF file"
                        },
                        "wcagScoreFrom": ["sc-3.1.1"]
                    },
                    {
                        "$itemId": "language-declaration-xhtml",
                        "itemName" : "Declared in XHTML files",
                        "itemScores": {
                            "0": "Language declaration missing or incomplete in XHTML files (ie: missing xml:lang=\"en\" AND lang=\"en\")",
                            "1": "Language declared within XHTML files placed on <body> instead of in <html> tag",
                            "2": "Language declared within XHTML files does not match language declared in OPF file",
                            "4": "Language declared correctly in all XHTML files"
                        },
                        "wcagScoreFrom": ["sc-3.1.1"]
                    },
                    {
                        "$itemId": "language-shifts",
                        "itemName" : "Declared Language Shifts",
                        "itemScores": {
                            "N/A": "There were no changes in the language",
                            "0": "Changes in language were incorrectly marked up (AA Compliance)",
                            "2": "Some of the language shifts are marked but not all",
                            "4": "All language shifts throughout the publication were marked correctly. (Note: Common foreign words and phrases do not need a language shift)"
                        },
                        "wcagScoreFrom": ["sc-3.1.2"]
                    }                    
                ]
            },
            {
                "$sectionId": "section-navigation",
                "sectionName": "Structured Navigation",
                "sectionItems": [
                    {
                        "$itemId": "navigation-toc",
                        "itemName" : "Table of Contents",
                        "itemScores": {
                            "0": "No TOC was present",
                             "2": "TOC is incomplete",
                            "4": "TOC was correctly defined and complete"
                        }
                    },
                   {
                        "$itemId": "navigation-listed-elements",
                        "itemName" : "Listed Elements (i.e. figures, illustration, maps, tables)",
                        "itemScores": {
                            "N/A": "There were no tables, figures, illustrations or image maps",
                            "0": "None of the images, tables, or figures are listed out in the navigation",
                            "2": "Some of the content elements have navigation lists",
                            "4": "All figures, tables, illustrations, maps etc. were listed in the navigation file"
                        }
                    },
                    {
                        "$itemId": "navigation-hidden-content",
                        "itemName" : "Hidden Content",
                        "itemScores": {
                            "N/A": "No hidden content was found",
                            "0": "The navigation is lacking",
                            "2": "The navigation includes some hidden elements",
                            "4": "Extended contents (h3 and up) are hidden but available for accessibility reasons"
                        }
                    },
                    {
                        "$itemId": "navigation-subtitles",
                        "itemName" : "Subtitles",
                        "itemScores": {
                            "N/A": "No Subtitles present",
                            "0": "Subtitles incorrectly coded using multiple headings",
                            "4": "Subtitles marked using role=\"doc-subtitle\" within a <p> or <div>"
                        }
                    },
                    {
                        "$itemId": "navigation-nonimage-context-breaks",
                        "itemName" : "Non-image Context Breaks",
                        "itemScores": {
                            "N/A": "No context breaks present, or uses images as covered in Section 1.4",
                            "0": "Context breaks visual only (i.e., uses CSS or html elements to insert extra visual space before or after a paragraph)",
                            "1": "Context breaks use consistent character (i.e., * or *** or §)",
                            "4": "Context break uses <hr/> and styled with CSS"
                        }
                    }                      
                ]
            },
            {
                "$sectionId": "section-pages",
                "sectionName": "Page Navigation",
                "sectionItems": [
                    {
                        "$itemId": "navigation-dc-source",
                        "itemName" : "dc:Source (page metadata)",
                        "itemScores": {
                            "N/A": "No page numbers / no print equivalent",
                            "0": "Not present in OPF file (print equivalent is available)",
                            "1": "Not present in OPF file (no print equivalent should cite itself when providing page numbers)",
                            "2": "Present in OPF file but does not contain the actual source of the pagination present",
                            "3": "source-of refinement property is not attached to the source element",
                            "4": "present in OPF file - correctly identifies the source of the pagination (print equivalent / self-reference)"
                        }
                    },
                    {
                        "$itemId": "navigation-pagebreaks",
                        "itemName" : "Page Breaks",
                        "itemScores": {
                            "N/A": "No pages / no print equivalent",
                            "0": "No accessible page breaks",
                            "1": "Page breaks present but missing aria-label",
                            "2": "Page breaks present but missing doc-pagebreak semantics",
                            "3": "Page breaks present but contained title attribute which is not recommended",
                            "4": "Page breaks contains (optional epub:type=pagebreak), role=doc-pagebreak and labelled correctly"
                       }
                    },
                    {
                        "$itemId": "navigation-pagebreak-roman-numeral",
                        "itemName" : "Page Breaks - Roman Numerals",
                        "itemScores": {
                            "N/A": "No pages / no print equivalent / No Roman numerals",
                            "0": "Roman numerals are written out i.e. aria-label=\"page Roman numeral 9\" but displayed as \"page IX\"",
                            "4": "Roman numerals match the display and are left in letter form i.e. aria-label =\" Page IX. \""
                       }
                    },                   
                    {
                        "$itemId": "navigation-pagebreak-labels",
                        "itemName" : "Page Break Labels",
                        "itemScores": {
                            "N/A": "No Page breaks present",
                            "0": "Page breaks incorrectly labelled (i.e.: using title instead of label)",
                            "3": "Page break labelled with just the page number (aria-label=\"123\" missing \"page\" text)",
                            "4": "Page breaks labelled with recommended format (aria-label=\" page 123. \") [i.e., <space> + \"page\" + <space> + # + <period> + <space>] or are visible."
                       }
                    },
                    {
                        "$itemId": "navigation-pagebreak-blank",
                        "itemName" : "Blank Pages",
                        "itemScores": {
                            "N/A": "No blank page's present",
                            "0": "Blank pages removed from EPUB but not disclosed in Accessibility Summary metadata",
                            "4": "Blank pages present, or are removed with a notice of this fact in the Accessibility Summary"
                       }
                    },
                    {
                        "$itemId": "navigation-pagelist",
                        "itemName" : "Page List",
                        "itemScores": {
                            "N/A": "No pages",
                            "0": "Missing page list in nav doc",
                            "2": "Page list present but incomplete or incorrectly marked up",
                             "4": "All Pages referenced correctly (with optional epub:type=page-list) in Nav document"
                       }
                    }                     
                ]
            },
            {
                "$sectionId": "section-links",
                "sectionName": "Links",
                "sectionItems": [
                    {
                        "$itemId": "links-url-references",
                        "itemName" : "URLs and intra-text references are live",
                        "itemScores": {
                            "N/A": "No Links of any kind were found",
                            "0": "Intra-text references are flat, URLs are not hyperlinked",
                            "1": "Live link is not described to assistive technology",
                            "3": "Only some of the intra-text references are live; unlinked flat print index repeated in the EPUB",
                            "4": "All URLs and internal references are live and have meaningful descriptions"
                        },
                        "wcagScoreFrom": ["sc-2.4.4"]
                    },
                    {
                        "$itemId": "links-visual-cues",
                        "itemName" : "Visual Cues",
                        "itemScores": {
                            "N/A": "No Links of any kind were found",
                            "0": "Hyperlinked items are the same as text color, no visual cues at all",
                            "1": "A variety of visual cues are used, creating a confusing reading experience",
                            "2": "Link are visually distinct but in a color with contrast issues, or are not underlined",
                            "4": "Links were visually distinct and in a color that caused no contrast issues or are underlined."
                        }
                    },
                    {
                        "$itemId": "links-overuse",
                        "itemName" : "Overuse",
                        "itemScores": {
                            "N/A": "No Links of any kind were found",
                            "0": "So many hyperlinked items that it interferes with the reading experience",
                            "3": "Chapters linking back to the TOC is overkill since reading systems provide an easy way to get back to TOC (or) Hyperlinks overkill with illustration caption linked back to illustration call outs in text",
                            "4": "The same links were not overly used throughout the publication"
                        }
                    },
                    {
                        "$itemId": "links-multiple-references",
                        "itemName" : "Multiple References",
                        "itemScores": {
                            "N/A": "No Links of any kind were found",
                            "0": "One or more instances where more than one link points to a figure, list, table, chapter, etc. with a return link returning to the first instance only",
                            "1": "Multiple forward referencing links to a (figure, list, table, footnote, etc.) with no return link",
                            "4": "All internal links have a 1:1 link to backlink relationship"
                        }
                    },
                    {
                        "$itemId": "links-fake-urls",
                        "itemName" : "Fake / Example Links",
                        "itemScores": {
                            "N/A": "No fake or example links were found, (e.g., www.examplesite.com)",
                            "0": "Fake links were encoded as active links",
                            "1": "Fake links were styled as links (i.e., underlined and set as blue text)",
                            "4": "All fake / example links were encoded as text only and not styled to look like a real link"
                        }
                    },
                    {
                        "$itemId": "links-dead",
                        "itemName" : "Dead Links",
                        "itemScores": {
                            "N/A": "No dead links were found",
                            "0": "Dead links were found and should be updated or removed"
                           }
                    }
                ]
            },
            {
                "$sectionId": "section-lists",
                "sectionName": "Lists",
                "sectionItems": [
                    {
                        "$itemId": "lists-markup",
                        "itemName" : "Marked as unordered and ordered lists where appropriate",
                        "itemScores": {
                            "N/A": "No lists present",
                            "0": "None of the lists were marked correctly",
                            "1": "Lists were created with styling not marked-up",
                            "2": "Not all lists were marked-up correctly",
                            "4": "All lists were correctly represented"
                        }
                    }
                ]
            },
            {
                "$sectionId": "section-tables",
                "sectionName": "Tables",
                "sectionItems": [
                    {
                        "$itemId": "tables-headings-simple",
                        "itemName" : "Simple Tables - Headings",
                        "itemScores": {
                            "N/A": "No simple tables present",
                            "0": "None of the tables had table headings (i.e.: missing <th>)",
                            "1": "Some of the tables had correct table headings identified (i.e.: <th>)",
                            "3": "Most tables had correct table headers identified (i.e.: <th>)",
                            "4": "All Table headings were correctly encoded (i.e. initial column headers were marked using <th>, and any row headers if necessary were identified as <th>'s)"
                        }
                    },
                   {
                        "$itemId": "tables-headings",
                        "itemName" : "Complex Tables - Headings",
                        "itemScores": {
                            "N/A": "No complex tables present",
                            "0": "None of the complex tables had table headings (i.e.: missing scope=\"col/row/colgroup/rowgroup\" and/or heading id's headers=\"...\")",
                            "1": "Some of the complex tables had correct table headings identified (i.e.: missing scope=\"col/row/colgroup/rowgroup\" and/or heading id's headers=\"...\")",
                            "3": "- Most complex tables had correct table headers (i.e.: missing  scope=\"col/row/colgroup/rowgroup\" and/or heading id's headers=\"...\")",
                            "4": "Complex Table headings present where correctly encoded by either the use of scope=\"col/row/colgroup/rowgroup\" or referring to heading id's i.e. headers=\"...\"."
                        }
                    },
                    {
                        "$itemId": "tables-headings-thead-tbody",
                        "itemName" : "Tables - <thead>/<tbody>",
                        "itemScores": {
                            "N/A": "No tables present",
                            "0": "None of the tables had table heading/body semantics (i.e.: missing <thead>, and <tbody>)",
                            "1": "Some of the tables had correct table heading/body identified (i.e.: <thead>, and <tbody>)",
                            "3": "Most tables had correct table headers identified (i.e.: <thead>, and <tbody>)",
                            "4": "All Table headings were correctly encoded (i.e. initial column headers were inside a <thead> , and any row data cells were identified inside the <tbody> section)"
                        }
                    },
                    {
                        "$itemId": "tables-summary",
                        "itemName" : "Table Summary (for complex tables)",
                        "itemScores": {
                            "N/A": "No complex tables present",
                            "0": "None of the complex tables had table summaries",
                            "1": "Some of the complex tables had table summaries",
                            "3": "Most of the complex tables had table summaries",
                            "4": "All tables had correct table summaries where appropriate"
                        }
                    },
                    {
                        "$itemId": "tables-presentational",
                        "itemName" : "Presentational Content",
                        "itemScores": {
                            "N/A": "No tables present",
                            "0": "One or more tables were used for presentation",
                            "4": "None of the tables were used for presentational purposes"
                        }
                    },
                    {
                        "$itemId": "tables-image",
                        "itemName" : "Image of a Table",
                        "itemScores": {
                            "N/A": "No Images of Tables present",
                            "0": "No enhanced description for complex table, or simple table coded as an image instead of a real HTML table",
                            "2": "Complex table image described in text instead of as an HTML table where the actual data is relevant",
                            "4": "Complex table images have an enhanced description that are real HTML tables"
                        }
                    },
                    {
                        "$itemId": "tables-structure-visual-layout",
                        "itemName" : "Table Structure (in the table tag) must Match the Visual Table Layout",
                        "itemScores": {
                            "N/A": "No tables present",
                            "0": "cell spans more than one column or row are missing",
                            "4": "all cells are spanned correctly"
                        }
                    }
                  ]
            },
            {
                "$sectionId": "section-notes",
                "sectionName": "Notes",
                "sectionItems": [
                    {
                        "$itemId": "notes-note-markup",
                        "itemName" : "Note Markup",
                        "itemScores": {
                            "N/A": "No Notes present",
                            "0": "Notes are marked up with generic HTML, no role=doc-noteref (optionally epub:type semantics)",
                            "2": "Notes and noterefs are marked up with role=doc-noteref (optionally epub:type semantics) but aren’t marked as an aside",
                            "4": "All notes were correctly marked up"
                        }
                    }
                ]
            },
            {
                "$sectionId": "section-javascript",
                "sectionName": "JavaScript",
                "sectionItems": [
                    {
                        "$itemId": "javascript-operability",
                        "itemName" : "JavaScript Operability",
                        "itemScores": {
                            "N/A": "No JavaScript script present",
                            "0": "JavaScript impaired the accessibility of this publication",
                            "4": "JavaScript did not affect the accessibility of this publication"
                        }
                    }
                ]
            },
            {
                "$sectionId": "section-math",
                "sectionName": "Math",
                "sectionItems": [
                    {
                        "$itemId": "math-mathml-included",
                        "itemName" : "Is math included as MathML",
                        "itemScores": {
                            "N/A": "No math included",
                            "0": "Math is represented by an image only and has no or inadequate alt-text",
                            "1": "Math is represented by an image but has appropriate alt-text",
                            "3": "Math is represented by MathML but has some coding issues (e.g. negative or minus sign coded as hyphen [&#8722;])",
                            "4": "Math is correctly with MathML"
                        }
                    },
                    {
                        "$itemId": "math-fallback",
                        "itemName" : "Does MathML have correct fallback of Image and Alt-Text",
                        "itemScores": {
                            "N/A": "No math included",
                            "0": "No fallback MathML only (no altimg and no alttext)",
                            "1": "Only fallback is an alttext (no altimg)",
                            "3": "Fallback of an PNG and alttext (or SVG with inadequate alttext)",
                            "4": "SVG Image with appropriate Alt-Text as a fallback"
                        }
                    },
                    {
                        "$itemId": "math-role",
                        "itemName" : "Does MathML have defined role=\"math\"",
                        "itemScores": {
                            "N/A": "No math included",
                            "0": "role=\"math\" is declared, which can be an issue for assistive technology to access the underlying math.",
                            "4": "mathML used correctly without role=\"math\" defined."
                        }
                    },
                    {
                        "$itemId": "math-namespace",
                        "itemName" : "MathML Namespacing",
                        "itemScores": {
                            "N/A": "No math included",
                            "0": "Defined global xmlns:m=\"http://www.w3.org/1998/Math/MathML\" and used m: for each mathML element (e.g. <m:mi>y</m:mi>)",
                            "4": "Not using Global XML m: namespacing and using preferred  namespacing technique (e.g. <math xmlns=\"http://www.w3.org/1998/Math/MathML\" and individual math elements are coded as <mi>y</mi>)"
                        }
                    }
                ]
            },
            {
                "$sectionId": "section-required-accessibility-metadata",
                "sectionName": "Accessibility Metadata (Required)",
                "sectionItems": [
                    {
                        "$itemId": "required-accessibility-metadata-conformsto",
                        "itemName" : "conformsTo",
                        "itemScores": {
                            "N/A": "Pending Certification (metadata not present)",
                            "0": "Non-Certified Publisher: metadata present",
                            "1": "Certified Publisher: metadata missing or incorrect",
                            "4": "Certified Publisher: metadata correctly matches WCAG compliance"
                        }
                    },
                    {
                        "$itemId": "required-accessibility-metadata-certifiedby",
                        "itemName" : "certifiedBy",
                        "itemScores": {
                            "N/A": "Pending Certification (metadata not present)",
                            "0": "Non-Certified Publisher: metadata present",
                            "1": "Certified Publisher: metadata missing where conformsTo is present",
                            "2": "Certified Publisher: metadata incorrect GCA Partner name present",
                            "4": "Certified Publisher: metadata correctly reports GCA certifying agency name"
                        }
                    },
                    {
                        "$itemId": "required-accessibility-metadata-certifiercredential",
                        "itemName" : "certifierCredential",
                        "itemScores": {
                            "N/A": "Pending Certification (metadata not present)",
                            "0": "Non-Certified Publisher: metadata present",
                            "1": "Certified Publisher: metadata missing where certifiedBy is present",
                            "2": "Certified Publisher: metadata incorrect (not GCA URL)",
                            "4": "Certified Publisher: metadata correctly reports GCA URL"
                        }
                    },
                    {
                        "$itemId": "required-accessibility-metadata-accessmodes",
                        "itemName" : "accessMode",
                        "itemScores": {
                            "0": "metadata missing",
                            "1": "metadata incomplete",
                            "4": "metadata correctly reports all the access modes within the publication"
                        }
                    },
                    {
                        "$itemId": "required-accessibility-metadata-features",
                        "itemName" : "accessibilityFeature",
                        "itemScores": {
                            "0": "metadata missing",
                            "1": "most features missing",
                            "3": "some features missing or incorrect features provided",
                            "4": "metadata correctly reports all the accessibility features of this publication"
                        }
                    },
                    {
                        "$itemId": "required-accessibility-metadata-hazards",
                        "itemName" : "accessibilityHazard",
                        "itemScores": {
                            "0": "metadata missing",
                            "1": "metadata incomplete",
                            "4": "metadata correctly reports all the accessibility hazards of this publication"
                        }
                    },
                    {
                        "$itemId": "required-accessibility-metadata-summary",
                        "itemName" : "accessibilitySummary",
                        "itemScores": {
                            "0": "metadata missing",
                            "1": "metadata lacking, inaccurate, or too detailed",
                            "3": "minor improvements needed",
                            "4": "metadata present and accurately summarizes the accessibility features and issues of this publication"
                        }
                    }
                ]
            },
            {
                "$sectionId": "section-optional-accessibility-metadata",
                "sectionName": "Accessibility Metadata (Optional)",
                "sectionItems": [
                    {
                        "$itemId": "optional-accessibility-metadata-accessmodesufficient",
                        "itemName" : "accessModeSufficient",
                        "itemScores": {
                            "0": "metadata not present",
                            "1": "metadata present but not accurate",
                            "4": "metadata correctly identifies all combinations of access modes required to sufficiently access this publication"
                        }
                    },
                     {
                        "$itemId": "optional-accessibility-metadata-certifierreport",
                        "itemName" : "certifierReport",
                        "itemScores": {
                            "N/A": "Metadata not present",
                            "0": "Invalid link to an accessibility report",
                            "4": "Certified Publisher: metadata URL links to an Accessibility Report"
                        }
                    },
                     {
                        "$itemId": "optional-accessibility-metadata-accessibilityAPI-Controls",
                        "itemName" : "Use of accessibilityAPI or accessibilityControls (soon to be deprecated)",
                        "itemScores": {
                            "N/A": "Metadata not present",
                            "0": "found accessibilityAPI or accessibilityControls in metadata"
                        }
                    } 
                    
                ]
            },
            {
                "$sectionId": "section-publishing-aria-markup",
                "sectionName": "Digital Publishing WAI-ARIA Semantic Markup",
                "sectionItems": [
                    {
                        "$itemId": "publishing-aria-markup-included",
                        "itemName" : "Digital Publishing Specific ARIA Markup",
                        "itemScores": {
                            "0": "DPUB ARIA markup not present.",
                            "1": "Limited DPUB semantic markup present",
                            "3": "Most DPUB semantic markup present but not entirely accurate or incomplete",
                            "4": "DPUB ARIA semantic markup present and used correctly"
                        }
                    }
                ]
            }
        ]
    }
}
