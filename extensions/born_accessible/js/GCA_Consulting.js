var gca = {
    "version": "1.13",
    "dct:title": "GCA Consulting",
    "dct:description": "Tab in SMART tool for GCA Members to use for EPUB Accessibility Certification",
    "dct:date": "01/13/2020, 10:15:00 AM",
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
                            "1": "A cover image is present with alt text but it is not described completely, missing key information",
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
                            "3": "The alt text is correctly empty but no role=\"presentation\"",
                            "4": "All Decorative images were correctly identified and marked up correctly with alt=\"\" and role=\"presentation\""
                        }
                    },
                    {
                        "$itemId": "images-content-break",
                        "itemName" : "Content Break Image Indicator",
                        "itemScores": {
                            "N/A": "There were no Content Break images found.",
                            "0": "Content Break images was missing <hr> semantic markup",
                            "4": "All Content Break images were marked up using <hr> and CSS with .hr{background-image:url (link to image); background-repeate: no-repeat; ...}"
                        }
                    },
                    {
                        "$itemId": "images-alt-text",
                        "itemName" : "Includes Alt Text",
                        "itemScores": {
                            "N/A": "There were no Images, or the surrounding text adequately described the images.  Note: If there is an extended description, 99% of the time there can be a very short summary in the alt text, unless it is what is in the Fig Caption.",
                            "0": "There is no alt text present for any image, or has meaningless text such as \"image\"",
                            "1": "Alt text included for a small percentage of images",
                            "2": "Alt text present in the majority of images",
                            "3": "Alt text is present in all cases but is problematic; too long,  repeats the caption, incorrect/incomplete, etc.",
                            "4": "All images found were described appropriately with alt text"
                        }
                    },
                    {
                        "$itemId": "images-extended-descriptions",
                        "itemName" : "Includes Extended Descriptions",
                        "itemScores": {
                            "N/A": "There were no Images, or the surrounding text adequately described the images.",
                            "0": "Many complex images that would benefit from longer descriptions but there are none",
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
                        "1": "Small issues with reading order (ie. asides not defined correctly and read as part of the main)",
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
                            "3": "The hierarchy flows inconsistently, jumping header levels",
                            "4": "Structural Hierarchy present and meaningful"
                        }
                    },
                    {
                        "$itemId": "general-book-metadata",
                        "itemName" : "Basic Book Metadata",
                        "itemScores": {
                            "0": "missing metadata (ie. Title, subtitle, author, date, ISBN etc)",
                            "2": "partial metadata",
                            "4": "all Metadata required present and correct"
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
                        "itemName" : "Landmarks",
                        "itemScores": {
                            "0": "No epub:type semantics used at all",
                            "1": "Landmarks are marked up incorrectly or landmarks missing unique aria labels or titles",
                            "2": "Only a basic set of epub:type semantics are used",
                            "3": "Full set of epub:type landmarks in markup but meagre landmarks listing in the navigation. Content would benefit from further, separate lists (figure, tables, maps) Or – The start of content (epub:type=”bodymatter”) should be marked in the nav",
                            "4": "Full set of landmarks, robust use of landmarks in the navigation"
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
                            "4": "Emphasis & Bolding done correctly (ie. <b> and <i> for visual styling, where <strong> and <em> are used to semantically stress the tagged content)"
                        }
                    },
                    {
                        "$itemId": "general-title-element",
                        "itemName" : "HTML Title Element",
                        "itemScores": {
                            "0": "Used incorrectly; i.e. book name used in every HTML file's title instead of the name of that chapter or section",
                            "4": "title of each html file named correctly"
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
                        "$itemId": "general-visual-layout",
                        "itemName" : "Visual Layout",
                        "itemScores": {
                            "N/A": "No superscript or subscript present",
                            "0": "all line heights were not marked correctly in CSS",
                            "1": "line heights were not marked correctly for sub/super scripts in CSS",
                            "4": "all line heights were marked in CSS correctly including sub/super scripts"
                        }
                    },
                    {
                        "$itemId": "general-attributes",
                        "itemName" : "Attributes Placement",
                        "itemScores": {
                            "0": "attributes are captured in <body> element",
                            "4": "No attributes are captured in <body> element"
                        }
                    }    
                ]
            },
            {
                "$sectionId": "section-language",
                "sectionName": "Language",
                "sectionItems": [
                    {
                        "$itemId": "language-decoloration",
                        "itemName" : "Declared in OPF and in HTML",
                        "itemScores": {
                            "0": "No languages are declared in the EPUB",
                            "1": "Language declared in either the OPF/HTML file but not both",
                            "4": "Language declared correctly in OPF and in HTML files"
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
                            "1": "TOC is missing semantic markup epub:type=\"toc\"",
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
                        "$itemId": "navigation-dc-source",
                        "itemName" : "dc:Source (page metadata)",
                        "itemScores": {
                            "N/A": "No page numbers / no print equivalent",
                            "1": "Not present in OPF file (no print equivalent should cite itself when providing page numbers)",
                            "2": "Present in OPF file but does not contain the actual source of the pagination present",
                            "4": "present in OPF file - correctly identifies the source of the pagination (print equivalent / self reference)"
                        }
                    },
                    {
                        "$itemId": "navigation-pagebreaks",
                        "itemName" : "Page Breaks",
                        "itemScores": {
                            "N/A": "No pages / no print equivalent",
                            "0": "No accessible pagebreaks",
                            "1": "Page breaks present but missing aria-label",
                            "2": "Page breaks present but missing doc-pagebreak semantics",
                            "3": "Page breaks present but contained title attribute which is not recommended",
                            "4": "Page breaks contains epub:type=pagebreak, role=doc-pagebreak and labelled correctly"
                       }
                    },
                    {
                        "$itemId": "navigation-pagelist",
                        "itemName" : "Page List",
                        "itemScores": {
                            "N/A": "No pages",
                            "0": "Missing page list in nav doc",
                            "2": "Page list present but incomplete or incorrectly marked up",
                             "4": "All Pages referenced correctly with epub:type=page-list in Nav document"
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
                            "4": "All URLs and internal references worked"
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
                            "4": "Links were visually distinct and in a color that caused no contrast issues and are underlined."
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
                        "$itemId": "tables-headings",
                        "itemName" : "Table Headings",
                        "itemScores": {
                            "N/A": "No tables present",
                            "0": "None of the complex tables had table headings (i.e.: missing scope=\"col/row\")",
                            "1": "Some of the complex tables had correct table headings",
                            "3": "Most tables had table headers",
                            "4": "Table headings were present where appropriate"
                        }
                    },
                    {
                        "$itemId": "tables-summary",
                        "itemName" : "Table Summary (for complex tables)",
                        "itemScores": {
                            "N/A": "No complex tables present",
                            "0": "None of the complex tables had table summaries",
                            "1": "Some of the complex tables had table summaries",
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
                            "0": "Notes are marked up with generic HTML, no epub:type semantics",
                            "2": "Notes and noterefs are marked up with epub:type semantics but aren’t marked as an aside",
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
                        "itemName" : "Is Math included as MathML",
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
                            "4": "SVG with appropriate Alt-Text"
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
                            "N/A": "Pending Accreditation (metadata not present)",
                            "0": "Non-Accredited Publisher: metadata present",
                            "1": "Accredited Publisher: metadata missing or incorrect",
                            "4": "Accredited Publisher: metadata correctly matches WCAG compliance"
                        }
                    },
                    {
                        "$itemId": "required-accessibility-metadata-certifiedby",
                        "itemName" : "certifiedBy",
                        "itemScores": {
                            "N/A": "Pending Accreditation (metadata not present)",
                            "0": "Non-Accredited Publisher: metadata present",
                            "1": "Accredited Publisher: metadata missing where conformsTo is present",
                            "2": "Accredited Publisher: metadata incorrect GCA Partner name present",
                            "4": "Accredited Publisher: metadata correctly reports GCA certifying agency name"
                        }
                    },
                    {
                        "$itemId": "required-accessibility-metadata-certifiercredential",
                        "itemName" : "certifierCredential",
                        "itemScores": {
                            "N/A": "Pending Accreditation (metadata not present)",
                            "0": "Non-Accredited Publisher: metadata present",
                            "1": "Accredited Publisher: metadata missing where certifiedBy is present",
                            "2": "Accredited Publisher: metadata incorrect (not GCA URL)",
                            "4": "Accredited Publisher: metadata correctly reports GCA URL"
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
                            "1": "metadata incomplete",
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
                        "$itemId": "optional-accessibility-metadata-api",
                        "itemName" : "accessibilityAPI",
                        "itemScores": {
                            "N/A": "Nothing requiring any special accessibility APIs (eg. JavaScript overriding a custom control.)  NOTE: Just having ARIA DPUB roles present does not constitute an accessibilityAPI of ARIA.",
                            "0": "metadata does not correctly identify the accessibility APIs present",
                            "4": "Correctly identifies all accessibility APIs"
                        }
                    },
                    {
                        "$itemId": "optional-accessibility-metadata-control",
                        "itemName" : "accessibilityControl",
                        "itemScores": {
                            "N/A": "Nothing requiring any special accessibility controls (eg. JavaScript overriding a custom control)",
                            "0": "metadata does not correctly identify the accessibility Controls present",
                            "4": "Correctly identifies all accessibility controls which were added"
                        }
                    },
                    {
                        "$itemId": "required-accessibility-metadata-certifierreport",
                        "itemName" : "certifierReport",
                        "itemScores": {
                            "N/A": "Metadata not present",
                            "0": "Invalid link to an accessibility report",
                            "4": "Accredited Publisher: metadata URL links to an Accessibility Report"
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
                            "1": "DPUB semantic markup present but not entirely accurate or incomplete",
                            "4": "DPUB ARIA semantic markup present and used correctly"
                        }
                    }
                ]
            }
        ]
    }
}
