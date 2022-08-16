var a11y_meta = {
	"properties": [
		{
			"id": "accessibilityFeature",
			"type": "checkbox",
			"required": true,
			"name": {
					"en": "Accessibility Features"
			},
			"values": [
				{
					"id": "alternativeText",
					"label": {
						"en": "alternative text"
					}
				},
				{
					"id": "annotations",
					"label": {
						"en": "annotations"
					}
				},
				{
					"id": "audioDescription",
					"label": {
						"en": "audio descriptions"
					}
				},
				{
					"id": "bookmarks",
					"label": {
						"en": "bookmarks"
					}
				},
				{
					"id": "braille",
					"label": {
						"en": "braille"
					}
				},
				{
					"id": "captions",
					"label": {
						"en": "captions"
					}
				},
				{
					"id": "ChemML",
					"label": {
						"en": "ChemML"
					}
				},
				{
					"id": "describedMath",
					"label": {
						"en": "described math"
					}
				},
				{
					"id": "displayTransformability",
					"label": {
						"en": "display transformability"
					}
				},
				{
					"id": "highContrastAudio",
					"label": {
						"en": "high contrast audio"
					}
				},
				{
					"id": "highContrastDisplay",
					"label": {
						"en": "high contrast display"
					}
				},
				{
					"id": "index",
					"label": {
						"en": "index"
					}
				},
				{
					"id": "largePrint",
					"label": {
						"en": "large print"
					}
				},
				{
					"id": "latex",
					"label": {
						"en": "latex"
					}
				},
				{
					"id": "longDescription",
					"label": {
						"en": "long descriptions"
					}
				},
				{
					"id": "MathML",
					"label": {
						"en": "MathML"
					}
				},
				{
					"id": "none",
					"label": {
						"en": "none"
					}
				},
				{
					"id": "printPageNumbers",
					"label": {
						"en": "print page numbers"
					}
				},
				{
					"id": "readingOrder",
					"label": {
						"en": "reading order"
					}
				},
				{
					"id": "rubyAnnotations",
					"label": {
						"en": "ruby annotations"
					}
				},
				{
					"id": "signLanguage",
					"label": {
						"en": "sign language"
					}
				},
				{
					"id": "structuralNavigation",
					"label": {
						"en": "structural navigation"
					}
				},
				{
					"id": "synchronizedAudioText",
					"label": {
						"en": "synchronized audio text"
					}
				},
				{
					"id": "tableOfContents",
					"label": {
						"en": "table of contents"
					}
				},
				{
					"id": "tactileGraphic",
					"label": {
						"en": "tactile graphic"
					}
				},
				{
					"id": "tactileObject",
					"label": {
						"en": "tactile object"
					}
				},
				{
					"id": "timingControl",
					"label": {
						"en": "timing control"
					}
				},
				{
					"id": "transcript",
					"label": {
						"en": "transcript"
					}
				},
				{
					"id": "ttsMarkup",
					"label": {
						"en": "tts markup"
					}
				}
			],
			"addMoreValues": {
    			"id": "add-a11y-feature",
    			"label": {
    				"en": "Add custom field"
    			}
			},
			"documentation": {
				"en": "https://www.w3.org/TR/epub-a11y-tech-11/#meta-003"
			}
		},
		{
			"id": "accessibilityHazard",
			"type": "checkbox",
			"required": true,
			"name": {
				"en": "Accessibility Hazards"
			},
			"values": [
				{
					"id": "flashing",
					"label": {
						"en": "flashing"
					}
				},
				{
					"id": "motionSimulation",
					"label": {
						"en": "motion simulation"
					}
				},
				{
					"id": "sound",
					"label": {
						"en": "sound"
					}
				},
				{
					"id": "none",
					"label": {
						"en": "none"
					}
				},
				{
					"id": "unknown",
					"label": {
						"en": "unknown"
					}
				}
			],
			"documentation": {
				"en": "https://www.w3.org/TR/epub-a11y-tech-11/#meta-004"
			}
		},
		{
			"id": "accessMode",
			"type": "checkbox",
			"required": true,
			"name": {
				"en": "Access Modes"
			},
			"values": [
				{
					"id": "auditory",
					"label": {
						"en": "auditory"
					}
				},
				{
					"id": "auditory",
					"label": {
						"en": "tactile"
					}
				},
				{
					"id": "textual",
					"label": {
						"en": "textual"
					}
				},
				{
					"id": "visual",
					"label": {
						"en": "visual"
					}
				}
			],
			"documentation": {
				"en": "https://www.w3.org/TR/epub-a11y-tech-11/#meta-001"
			}
		},
		{
			"id": "accessModeSufficient",
			"type": "fieldset",
			"required": false,
			"name": {
				"en": "Sufficient Access Modes"
			},
			"addMoreValues": {
    			"id": "add-sufficient",
    			"label": {
    				"en": "Add another set"
    			}
			},
			"documentation": {
				"en": "https://www.w3.org/TR/epub-a11y-tech-11/#meta-002"
			}
		},
		{
			"id": "accessibilitySummary",
			"type": "textarea",
			"required": false,
			"name": {
				"en": "Accessibility Summary"
			},
			"autoPopulate": {
				"id": "add-summary",
				"label": {
					"en": "Suggest a summary"
				}
			},
			"documentation": {
				"en": "https://www.w3.org/TR/epub-a11y-tech-11/#meta-005"
			}
		}
	]
}
