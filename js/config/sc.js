
var sc_config = {
	"sc": [
		{
			"id": "sc-1.1.1",
			"level": "a",
	        "name":  {
				"en": "Non-text Content"
			},
			"guidance": {
				"en": "<p>Verify the following:</p>\
<ul>\
	<li data-scope=\"img\">\
		<p>For each image:</p>\
		<ul>\
			<li id=\"img-non-empty\">\
				<p>If the image is decorative, ensure it has an empty <code>alt</code> attribute (<code>alt=\"\"</code>). A decorative image is one that does not contain information the user needs to be aware of; it only exists to make the publication more visually appealing. Common examples include: ornamental graphics around chapter numbers and headings, and stock imagery found at the beginning of chapters or used to illustrate points being made in the text.</p>\
			</li>\
			<li id=\"img-empty\">\
				<p>If the image is not decorative and has an empty <code>alt</code> attribute, one of the following must true:</p>\
				<ul>\
					<li>the image is described in the <code>figcaption</code> element or the surrounding text;</li>\
					<li>the image is part of a group of images in which only one carries the alternative text.</li>\
				</ul>\
			</li>\
			<li>\
				<p>Otherwise, ensure that the <code>alt</code> text meaningfully describes the image.</p>\
				<p>Refer to the Ace report for the list of images and their alt text values.</p>\
			</li>\
		</ul>\
	</li>\
	<li>Ensure there is no non-text content embedded via an <code>object</code> or <code>embed</code> tag without a text alternative.</li>\
</ul>"
			},
			"kb": {
				"en": {
					"Images": "http://kb.daisy.org/publishing/docs/html/images.html",
					"Audio": "http://kb.daisy.org/publishing/docs/html/audio.html",
					"Video": "http://kb.daisy.org/publishing/docs/html/video.html"
				}
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 1.1.1": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/text-equiv-all.html",
					"How to meet Success Criterion 1.1.1": "https://www.w3.org/WAI/WCAG20/quickref/#qr-text-equiv-all"
				}
			}
		},
	
		{
			"id": "sc-1.2.1",
			"level": "a",
	        "name":  {
				"en": "Audio-only and Video-only (Prerecorded)"
			},
			"guidance": {
				"en": "<div data-scope=\"audio\">\
	<p>For all audio clips, verify the following:</p>\
	<ul>\
		<li>There is a transcript.</li>\
		<li>The <code>audio</code> element has a label (<code>aria-label</code> attribute) that references where to find the transcript.</li>\
		<li>The transcript accurately reflects the information contained in the audio clip.</li>\
</div>\
\
<div data-scope=\"video\">\
	<p>For all video-only clips, verify the following:</p>\
	<ul>\
		<li>There is a transcript or the video includes audio descriptions (if the video is not fully described in the surrounding text).</li>\
		<li>The <code>video</code> element has a label (<code>aria-label</code> attribute) that references where to find the transcript or indicates that audio descriptions are available.</li>\
		<li>The transcript/audio descriptions accurately reflect the information contained in the video clip.</li>\
	</ul>\
		<p class=\"sc-note\">Note: a video-only clip is one that has no accompanying audio (e.g., a silent movie).</p>\
</div>"
			},
			"kb": {
				"en": {
					"Audio": "http://kb.daisy.org/publishing/docs/html/audio.html",
					"Video": "http://kb.daisy.org/publishing/docs/html/video.html"
				}
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 1.2.1": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/media-equiv-av-only-alt.html",
					"How to meet Success Criterion 1.2.1": "https://www.w3.org/WAI/WCAG20/quickref/#qr-media-equiv-av-only-alt"
				}
			}
		},
		
		{
			"id": "sc-1.2.2",
			"level": "a",
	        "name":  {
				"en": "Captions (Prerecorded)"
			},
			"guidance": {
				"en": "<p>For all video clips with audio, verify the following:</p>\
<ul>\
	<li>Captions are provided via the <code>track</code> element, or open or closed captions are provided as part of the video format.</li>\
	<li>The captions accurately capture the audio content.</li>\
</ul>"
			},
			"kb": {
				"en": {
					"Video": "http://kb.daisy.org/publishing/docs/html/video.html"
				}
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 1.2.2": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/media-equiv-captions.html",
					"How to meet Success Criterion 1.2.2": "https://www.w3.org/WAI/WCAG20/quickref/#qr-media-equiv-captions"
				}
			}
		},
		
		{
			"id": "sc-1.2.3",
			"level": "a",
	        "name":  {
				"en": "Audio Description or Media Alternative (Prerecorded)"
			},
			"guidance": {
				"en": "<p>Check if there are any video clips whose accompanying audio does not fully describe all the visual information (e.g., omits actions being carried out by a presenter).</p>\
\
<p>If yes, verify one of the following is true for each:</p>\
\
<ul>\
	<li>An audio description is included via the <code>track</code> element (<code>kind=\"descriptions\"</code>), or descriptions are included in the default audio.</li>\
	<li>A transcript that includes the descriptions is provided.</li>\
</ul>\
\
<p class=\"sc-note\">Note: This success criterion does not apply to video without audio. See <a href=\"#sc-1.2.1\">1.2.1</a> for such cases.</p>"
			},
			"kb": {
				"en": {
					"Video": "http://kb.daisy.org/publishing/docs/html/video.html"
				}
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 1.2.3": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/media-equiv-audio-desc.html",
					"How to meet Success Criterion 1.2.3": "https://www.w3.org/WAI/WCAG20/quickref/#qr-media-equiv-audio-desc"
				}
			}
		},
		
		{
			"id": "sc-1.2.4",
			"level": "aa",
	        "name":  {
				"en": "Captions (Live)"
			},
			"guidance": {
				"en": "<p>Check if there are any real-time audio/video broadcasts that can be accessed from the publication (i.e., that are only available on a specific date and time).</p>\
\
<p>If so, the broadcasts must be live captioned to pass.</p>\
\
<p class=\"sc-note\">Note: Remotely-hosted audio and video files are not live broadcasts, as they can be accessed at any time and at any point in their timeline.</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 1.2.4": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/media-equiv-real-time-captions.html",
					"How to meet Success Criterion 1.2.4": "https://www.w3.org/WAI/WCAG20/quickref/#qr-media-equiv-real-time-captions"
				}
			}
		},
		
		{
			"id": "sc-1.2.5",
			"level": "aa",
	        "name":  {
				"en": "Audio Description (Prerecorded)"
			},
			"guidance": {
				"en": "<p>Check if there are any video clips whose accompanying audio does not fully describe all the visual information (e.g., actions being carried out).</p>\
\
<p>If yes, verify that audio descriptions are provided for each.</p>"
			},
			"kb": {
				"en": {
					"Video": "http://kb.daisy.org/publishing/docs/html/video.html"
				}
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 1.2.5": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/media-equiv-audio-desc-only.html",
					"How to meet Success Criterion 1.2.5": "https://www.w3.org/WAI/WCAG20/quickref/#qr-media-equiv-audio-desc-only"
				}
			}
		},
		
		{
			"id": "sc-1.2.6",
			"level": "aaa",
	        "name":  {
				"en": "Sign Language (Prerecorded)"
			},
			"guidance": {
				"en": "<p>Verify that sign language interpretation is provided for all audio that accompanies video content.</p>\
\
<p class=\"sc-note\">Note: Sign language interpretation does not have to be provided for standalone audio content to meet this success criterion.</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 1.2.6": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/media-equiv-sign.html",
					"How to meet Success Criterion 1.2.6": "https://www.w3.org/WAI/WCAG20/quickref/#qr-media-equiv-sign"
				}
			}
		},
		
		{
			"id": "sc-1.2.7",
			"level": "aaa",
	        "name":  {
				"en": "Extended Audio Description (Prerecorded)"
			},
			"guidance": {
				"en": "<p>Verify that audio descriptions do not overlap the foreground audio (i.e., that the description does not interfere with the ability to listen to dialogue or important sounds).</p>\
\
<p>If overlaps are found, extended descriptions must be provided whereby the video and audio are paused until the description completes.</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 1.2.7": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/media-equiv-extended-ad.html",
					"How to meet Success Criterion 1.2.7": "https://www.w3.org/WAI/WCAG20/quickref/#qr-media-equiv-extended-ad"
				}
			}
		},
		
		{
			"id": "sc-1.2.8",
			"level": "aaa",
	        "name":  {
				"en": "Media Alternative (Prerecorded)"
			},
			"guidance": {
				"en": "<p>Verify that a transcript is provided for all video content, whether the video has audio or not. The transcript must accurately describe all auditory and visual information.</p>\
\
<p class=\"sc-note\">Note: Transcripts that only capture dialogue are not sufficient to meet this success criterion.</p>"
			},
			"kb": {
				"en": {
					"Video": "http://kb.daisy.org/publishing/docs/html/video.html"
				}
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 1.2.8": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/media-equiv-text-doc.html",
					"How to meet Success Criterion 1.2.8": "https://www.w3.org/WAI/WCAG20/quickref/#qr-media-equiv-text-doc"
				}
			}
		},
		
		{
			"id": "sc-1.2.9",
			"level": "aaa",
	        "name":  {
				"en": "Audio-only (Live)"
			},
			"guidance": {
				"en": "<p>Verify that a text alternative is provided for all live audio (e.g., through live captioning).</p>\
\
<p class=\"sc-note\">Note: As support for live streaming protocols is not a part of EPUB, this success criterion is typically not applicable.</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 1.2.9": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/media-equiv-live-audio-only.html",
					"How to meet Success Criterion 1.2.9": "https://www.w3.org/WAI/WCAG20/quickref/#qr-media-equiv-live-audio-only"
				}
			}
		},
	
		{
			"id": "sc-1.3.1",
			"level": "a",
	        "name":  {
				"en": "Info and Relationships"
			},
			"guidance": {
				"en": "<p>Verify that all essential information and relationships are reflected in the markup.</p>\
\
<p>The markup of each content document has to be inspected to verify this success criterion, as its purpose \
	is to ensures that the markup matches the visual presentation of the content.</p>\
\
<p>Some common problems areas to check include:</p>\
\
<ul>\
	<li><a href=\"http://kb.daisy.org/publishing/docs/html/headings.html\" target=\"_blank\">Headings</a>\
		<ul>\
			<li>all section headings are properly identified with HTML heading tags;</li>\
			<li>subtitles are not marked up using <code>h1</code>-<code>h6</code> elements;</li>\
			<li>section heading depth is correctly reflected in the choice of heading tag;</li>\
			<li>headings are not used to format non-heading text;</li>\
		</ul>\
	</li>\
	\
	<li><a href=\"http://kb.daisy.org/publishing/docs/html/tables.html\" target=\"_blank\">Tables</a>\
		<ul>\
			<li>table headers are logically associated with cells using the <code>scope</code> or <code>headers</code> attribute;</li>\
			<li>complex tables include a description of their structure;</li>\
		</ul>\
	</li>\
	\
	<li><a href=\"http://kb.daisy.org/publishing/docs/html/lists.html\" target=\"_blank\">Lists</a>\
		<ul>\
			<li>the correct type of list is used (ordered or unordered);</li>\
			<li>lists of items are marked up using list tags (i.e., not as styled paragraphs);</li>\
		</ul>\
	</li>\
	\
	<li><a href=\"http://kb.daisy.org/publishing/docs/css/color.html\" target=\"_blank\">Color</a>\
		<ul>\
			<li>content offset from the main narrative by shading or colored borders also uses semantic markup (e.g., <code>aside</code>);</li>\
		</ul>\
	</li>\
	\
	<li><a href=\"http://kb.daisy.org/publishing/docs/html/notes.html\" target=\"_blank\">Footnotes</a>\
		<ul>\
			<li>footnotes within the text are wrapped in <code>aside</code> elements;</li>\
			<li>footnotes and their references are identifiable by their <code>role</code> attribute value;</li>\
		</ul>\
	</li>\
</ul>\
\
<p>For more markup best practices, refer to the <a href=\"http://kb.daisy.org/publishing/\">DAISY Accessible Publishing Knowledge Base</a>.</p>"
			},
			"kb": {
				"en": {
					"SEM-001: Include ARIA and EPUB semantics": "http://www.idpf.org/epub/a11y/techniques/#sem-001",
					"TITLES-002: Ensure numbered headings reflect publication hierarchy": "http://www.idpf.org/epub/a11y/techniques/#titles-002"
				}
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 1.3.1": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/content-structure-separation-programmatic.html",
					"How to meet Success Criterion 1.3.1": "https://www.w3.org/WAI/WCAG20/quickref/#qr-content-structure-separation-programmatic"
				}
			}
		},
		
		{
			"id": "sc-1.3.2",
			"level": "a",
	        "name":  {
				"en": "Meaningful Sequence"
			},
			"guidance": {
				"en": "<p>Review the spine and verify the following:</p>\
<ul>\
	<li>All content documents are listed in the correct reading order.</li>\
	<li>All content documents are correctly marked as linear or non-linear.</li>\
</ul>\
\
<p>Review each content document in the spine and verify the following:</p>\
<ul>\
	<li>Content is arranged logically within each document.</li>\
	<li>Sidebars and other secondary material are identified using correct tags (e.g., <code>aside</code>).</li>\
	<li>Secondary material is optimally placed to minimize interruptions (e.g., at the end of sections or where logical pauses in the narrative occur).</li>\
</ul>"
			},
			"kb": {
				"en": {
					"Logical Reading Order": "http://kb.daisy.org/publishing/docs/html/order.html",
					"Sections": "http://kb.daisy.org/publishing/docs/html/sections.html",
					"ACCESS-001: Ensure Linear Reading Order": "http://www.idpf.org/epub/a11y/techniques/#access-001"
				}
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 1.3.2": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/content-structure-separation-sequence.html",
					"How to meet Success Criterion 1.3.2": "https://www.w3.org/WAI/WCAG20/quickref/#qr-content-structure-separation-sequence"
				}
			}
		},
		
		{
			"id": "sc-1.3.3",
			"level": "a",
	        "name":  {
				"en": "Sensory Characteristics"
			},
			"guidance": {
				"en": "<p>If the publication includes instructions for understanding or operating the content, verify the instructions do not depend solely on sensory perception (e.g., selecting an object by its colour, shape, size, position, etc.).</p>\
\
<p class=\"sc-note\">Note: Content does not fail this success criterion simply because it employs colours, shapes, sizes, etc. A sidebar identifiable by background shading is not a failure unless there are instructions to review only certain coloured sidebars, for example. Requirements for semantic tagging are covered by <a href=\"#sc-1.3.1\">1.3.1</a>.</p>"
			},
			"kb": {
				"en": {
					"Separation of Style": "http://kb.daisy.org/publishing/docs/html/separation.html"
				}
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 1.3.3": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/content-structure-separation-understanding.html",
					"How to meet Success Criterion 1.3.3": "https://www.w3.org/WAI/WCAG20/quickref/#qr-content-structure-separation-understanding"
				}
			}
		},
	
		{
			"id": "sc-1.4.1",
			"level": "a",
	        "name":  {
				"en": "Use of Color"
			},
			"guidance": {
				"en": "<p>Verify that there are no dependencies on the perception of colour (e.g., in order to understand the different pieces of a chart or to determine what controls to use in a scripted interface).</p>"
			},
			"kb": {
				"en": {
					"Separation of Style": "http://kb.daisy.org/publishing/docs/html/separation.html"
				}
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 1.4.1": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-without-color.html",
					"How to meet Success Criterion 1.4.1": "https://www.w3.org/WAI/WCAG20/quickref/#qr-visual-audio-contrast-without-color"
				}
			}
		},
		
		{
			"id": "sc-1.4.2",
			"level": "a",
	        "name":  {
				"en": "Audio Control"
			},
			"guidance": {
				"en": "<p>If there are any audio clips that start playing automatically and run for more than three seconds, verify that one of the following is true:</p>\
<ul>\
	<li>There is a mechanism to pause/stop playback.</li>\
	<li>The volume of the audio clip can be controlled separately from the volume of the reading system.</li>\
</ul>"
			},
			"kb": {
				"en": {
					"Audio": "http://kb.daisy.org/publishing/docs/html/audio.html"
				}
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 1.4.2": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-dis-audio.html",
					"How to meet Success Criterion 1.4.2": "https://www.w3.org/WAI/WCAG20/quickref/#qr-visual-audio-contrast-dis-audio"
				}
			}
		},
		
		{
			"id": "sc-1.4.3",
			"level": "aa",
	        "name":  {
				"en": "Contrast (Minimum)"
			},
			"guidance": {
				"en": "<p>Verify the following are true:</p>\
\
<ul>\
	<li>If the publications contains SVG images, check that any text in them meets the 4.5:1 contrast requirement.</li>\
	<li>If the publication contains images of text, check that the text meet the 4.5:1 contrast requirement.</li>\
</ul>\
\
<p>If the Ace tool has not been run on the publication, the contrast of all text content also needs to be checked.</p>\
\
<p class=\"sc-note\">Note: Contrast is the difference in luminance between the colors of the text and background.</p>\
\
<p class=\"sc-note\">Note: An image of text is exempt from this requirement if it is part of an inactive interface, is purely decorational, is not visible, or is part of a brand or logo. If the text in the image is incidental information, it is also exempt (e.g., road or store signs in a landscape picture).</p>"
			},
			"kb": {
				"en": {
					"Color": "http://kb.daisy.org/publishing/docs/css/color.html"
				}
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 1.4.3": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html",
					"How to meet Success Criterion 1.4.3": "https://www.w3.org/WAI/WCAG20/quickref/#qr-visual-audio-contrast-contrast"
				}
			}
		},
		
		{
			"id": "sc-1.4.4",
			"level": "aa",
	        "name":  {
				"en": "Resize text"
			},
			"guidance": {
				"en": "<p>Verify that font declarations use relative sizes (e.g., <code>%</code>, <code>em</code>, <code>rem</code>) and/or that text container elements resize/reflow with the text.</p>\
\
<p>Zoom the text to 200% and ensure that the publication remains readable/functional (e.g., no text is cut off).</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 1.4.4": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-scale.html",
					"How to meet Success Criterion 1.4.4": "https://www.w3.org/WAI/WCAG20/quickref/#qr-visual-audio-contrast-scale"
				}
			}
		},
		
		{
			"id": "sc-1.4.5",
			"level": "aa",
	        "name": {
				"en": "Images of Text"
			},
			"guidance": {
				"en": "<p>If any images contain text, check if the presentation can be achieved without an image (e.g., through CSS or table markup).</p>\
\
<p>If the presentation cannot be achieved without an image, this success criterion passes.</p>\
\
<p class=\"sc-note\">Note: This success criterion does not apply to images where the presentation is essential (e.g., logos) or where the text can be controlled separately from the image (e.g., SVG). It also does not apply to graphs and diagrams where more than just the text is essential information.</p>"
			},
			"kb": {
				"en": {
					"TEXT-001 - Use Unicode for text content": "http://www.idpf.org/epub/a11y/techniques/#text-001"
				}
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 1.4.5": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-text-presentation.html",
					"How to meet Success Criterion 1.4.5": "https://www.w3.org/WAI/WCAG20/quickref/#qr-visual-audio-contrast-text-presentation"
				}
			}
		},
		
		{
			"id": "sc-1.4.6",
			"level": "aaa",
	        "name":  {
				"en": "Contrast (Enhanced)"
			},
			"guidance": {
				"en": "<p>Ensure that there is a minimum 7:1 contrast ratio for all text in the publication and images of text.</p>\
\
<p class=\"sc-note\">Note: Contrast is the difference in luminance between the colors of the text and background. It is recommended to use an automated tool to check this success criterion. Ace only checks contrasts up to 4.5:1, and does not verify images of text, so a passing report does not indicate conformance to this success criterion.</p>\
\
<p class=\"sc-note\">Note: An image of text is exempt from this requirement if it is part of an inactive interface, is purely decorational, is not visible, or is part of a brand or logo. If the text in the image is incidental information, it is also exempt (e.g., road or store signs in a landscape picture).</p>"
			},
			"kb": {
				"en": {
					"Color": "http://kb.daisy.org/publishing/docs/css/color.html"
				}
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 1.4.6": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast7.html",
					"How to meet Success Criterion 1.4.6": "https://www.w3.org/WAI/WCAG20/quickref/#qr-visual-audio-contrast7"
				}
			}
		},
		
		{
			"id": "sc-1.4.7",
			"level": "aaa",
	        "name":  {
				"en": "Low or No Background Audio"
			},
			"guidance": {
				"en": "<p>Verify at least one of the following is true for all prerecorded audio-only content:</p>\
\
<ul>\
	<li>The audio does not contain background sounds.</li>\
	<li>The background sounds can be turned off.</li>\
	<li>The background sounds are at least 20 decibels lower than the foreground speech content, with the exception of occasional sounds that last for only one or two seconds.</li>\
</ul>\
\
<p class=\"sc-note\">Note: This success criterion only applies to audio content that contains primarily speech in the foreground, is not an audio CAPTCHA or audio logo, and is not vocalization intended to be primarily musical expression (e.g., singing or rapping).</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 1.4.7": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-noaudio.html",
					"How to meet Success Criterion 1.4.7": "https://www.w3.org/WAI/WCAG20/quickref/#qr-visual-audio-contrast-noaudio"
				}
			}
		},
		
		{
			"id": "sc-1.4.8",
			"level": "aaa",
	        "name":  {
				"en": "Visual Presentation"
			},
			"guidance": {
				"en": "<p>Verify the following are true, or a mechanism is available to achieve them, for the visual presentation of blocks of text:</p>\
\
<ul>\
	<li>The use can change the selection of foreground and background colors.</li>\
	<li>Line length is no more than 80 characters or glyphs (40 if CJK).</li>\
	<li>Text is not justified.</li>\
	<li>Line spacing (leading) is at least space-and-a-half within paragraphs, and paragraph spacing at least 1.5 times larger than the line spacing.</li>\
	<li>Text resizes without assistive technology up to 200 percent in a way that does not require the user to scroll horizontally to read a line of text on a full-screen window.</li>\
</ul>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 1.4.8": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-visual-presentation.html",
					"How to meet Success Criterion 1.4.8": "https://www.w3.org/WAI/WCAG20/quickref/#qr-visual-audio-contrast-visual-presentation"
				}
			}
		},
		
		{
			"id": "sc-1.4.9",
			"level": "aaa",
	        "name":  {
				"en": "Images of Text (No Exception)"
			},
			"guidance": {
				"en": "<p>Verify that any images of text are decorative or the presentation is essential (e.g., logos and brand names).</p>\
\
<p class=\"sc-note\">Note: images of text does not include graphs and diagrams where more than just the text is essential information.</p>"
			},
			"kb": {
				"en": {
					"TEXT-001 - Use Unicode for text content": "http://www.idpf.org/epub/a11y/techniques/#text-001"
				}
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 1.4.9": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-text-images.html",
					"How to meet Success Criterion 1.4.9": "https://www.w3.org/WAI/WCAG20/quickref/#qr-visual-audio-contrast-text-images"
				}
			}
		},
	
		{
			"id": "sc-2.1.1",
			"level": "a",
	        "name":  {
				"en": "Keyboard"
			},
			"guidance": {
				"en": "<p>Verify that all interactive content (scripted components, forms, audio, video, links, etc.) can be controlled by keyboard.</p>\
\
<p>An exception is made for interactive content where the full path of movement (from start of movement to end) is essential\
	to its operation.</p>\
\
<p class=\"sc-note\">Note: An example of an application that requires the full path of movement is a drawing program.\
	Drag and drop applications are not exempt, on the other hand, as the path taken to the endpoint is not essential.</p>\
\
<p>In addition, verify that operation is not dependent on specific timings of keystrokes (e.g., that keys must be pressed a certain number of times in an interval, or held down for a set period of time).</p>"
			},
			"kb": {
				"en": {
					"ARIA": "http://kb.daisy.org/publishing/docs/script/aria.html"
				}
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 2.1.1": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/keyboard-operation-keyboard-operable.html",
					"How to meet Success Criterion 2.1.1": "https://www.w3.org/WAI/WCAG20/quickref/#qr-keyboard-operation-keyboard-operable"
				}
			}
		},
		
		{
			"id": "sc-2.1.2",
			"level": "a",
	        "name":  {
				"en": "No Keyboard Trap"
			},
			"guidance": {
				"en": "<p>Verify that any interactive content (scripted components, forms, audio, video etc.) does not present a keyboard trap.</p>\
\
<p>A keyboard trap results when an application can be entered using the keyboard but then cannot be escaped using the same method (e.g., can be tabbed into but then the tab key has a different function within the application).</p>\
\
<p>If any content cannot be escaped from once entered using the typical escape key, there must be instructions on how to escape.</p>\
\
<p class=\"sc-note\">Note: Audio and video content that uses native HTML controls (i.e., has the <code>controls</code> attribute set by default) can be assumed to be accessible. If the author has scripted their own controls, the interface needs testing.</p>\
\
<p class=\"sc-note\">Note: Plugins are a common cause of keyboard traps. Although formats that require a plugin are not typically found in EPUB 3, some EPUB 2 reading systems supported Flash video.</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 2.1.2": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/keyboard-operation-trapping.html",
					"How to meet Success Criterion 2.1.2": "https://www.w3.org/WAI/WCAG20/quickref/#qr-keyboard-operation-trapping"
				}
			}
		},
		
		{
			"id": "sc-2.1.3",
			"level": "aaa",
	        "name":  {
				"en": "Keyboard (No Exception)"
			},
			"guidance": {
				"en": "<p>Verify that all interactive content (scripted components, forms, audio, video, links, etc.) is operable from the keyboard.</p>\
\
<p class=\"sc-note\">Note: The difference between this success criterion and <a href=\"#sc-2.1.1\">2.1.1</a> is that this success criterion does not allow an exception for interfaces that require information about the full path of movement.</p>"
			},
			"kb": {
				"en": {
					"ARIA": "http://kb.daisy.org/publishing/docs/script/aria.html"
				}
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 2.1.3": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/keyboard-operation-all-funcs.html",
					"How to meet Success Criterion 2.1.3": "https://www.w3.org/WAI/WCAG20/quickref/#qr-keyboard-operation-all-funcs"
				}
			}
		},
	
		{
			"id": "sc-2.2.1",
			"level": "a",
	        "name":  {
				"en": "Timing Adjustable"
			},
			"guidance": {
				"en": "<p>If a time limit is set by any of the content (e.g., in dynamic quizzes or games), verify that at least one of the following is true:</p>\
\
<ul>\
	<li>The user is allowed to turn off the time limit before encountering it.</li>\
	<li>The user is allowed to adjust the time limit, before encountering it, over a range that is at least ten times the length of the default.</li>\
	<li>The user is warned before time expires and given at least 20 seconds to extend the time limit with a simple action (for example, \"press the space bar\"), and the user is allowed to extend the time limit at least ten times.</li>\
	<li>The time limit is a required part of a real-time event (for example, an auction), and no alternative to the time limit is possible.</li>\
	<li>The time limit is essential and extending it would invalidate the activity.</li>\
	<li>The time limit is longer than 20 hours.</li>\
</ul>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 2.2.1": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/time-limits-required-behaviors.html",
					"How to meet Success Criterion 2.2.1": "https://www.w3.org/WAI/WCAG20/quickref/#qr-time-limits-required-behaviors"
				}
			}
		},
		
		{
			"id": "sc-2.2.2",
			"level": "a",
	        "name":  {
				"en": "Pause, Stop, Hide"
			},
			"guidance": {
				"en": "<p>Verify both of the following are true:</p>\
\
<ul>\
	<li>For any moving, blinking or scrolling information that (1) starts automatically, (2) lasts more than five seconds, and (3) is presented in parallel with other content, there is a mechanism for the user to pause, stop, or hide it unless the movement, blinking, or scrolling is part of an activity where it is essential.</li>\
	<li>For any auto-updating information that (1) starts automatically and (2) is presented in parallel with other content, there is a mechanism for the user to pause, stop, or hide it or to control the frequency of the update unless the auto-updating is part of an activity where it is essential.</li>\
</ul>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 2.2.2": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/time-limits-pause.html",
					"How to meet Success Criterion 2.2.2": "https://www.w3.org/WAI/WCAG20/quickref/#qr-time-limits-pause"
				}
			}
		},
		
		{
			"id": "sc-2.2.3",
			"level": "aaa",
	        "name":  {
				"en": "No Timing"
			},
			"guidance": {
				"en": "<p>Verify that timing is not essential to the functioning of the content (e.g., it can be disabled if part of dynamic content, or an alternative untimed version is offered).</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 2.2.3": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/time-limits-no-exceptions.html",
					"How to meet Success Criterion 2.2.3": "https://www.w3.org/WAI/WCAG20/quickref/#qr-time-limits-no-exceptions"
				}
			}
		},
		
		{
			"id": "sc-2.2.4",
			"level": "aaa",
	        "name":  {
				"en": "Interruptions"
			},
			"guidance": {
				"en": "<p>Verify there are no interruptions from a remote server (e.g., messages pushed to the content), or any interruptions can be turned off or suppressed by the user except in the case of emergencies.</p>\
\
<p class=\"sc-note\">Note: Emergency messages may include alerts about loss of connectivity, if that is important for the user to know.</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 2.2.4": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/time-limits-postponed.html",
					"How to meet Success Criterion 2.2.4": "https://www.w3.org/WAI/WCAG20/quickref/#qr-time-limits-postponed"
				}
			}
		},
		
		{
			"id": "sc-2.2.5",
			"level": "aaa",
	        "name":  {
				"en": "Re-authenticating"
			},
			"guidance": {
				"en": "<p>Verify that the user is able to re-authenticate and continue a transaction or activity (such as a quiz), without loss of any data that has already been entered, if there are circumstances that cause the user to be logged out (e.g., inactivity, security).</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 2.2.5": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/time-limits-server-timeout.html",
					"How to meet Success Criterion 2.2.5": "https://www.w3.org/WAI/WCAG20/quickref/#qr-time-limits-server-timeout"
				}
			}
		},
	
		{
			"id": "sc-2.3.1",
			"level": "a",
	        "name":  {
				"en": "Three Flashes or Below Threshold"
			},
			"guidance": {
				"en": "<p>Verify that there is no content that flashes more than three times per second (e.g., using <a href=\"http://trace.umd.edu/peat\" target=\"_blank\">PEAT</a>), or that the flashing is below the <a href=\"https://www.w3.org/TR/WCAG20/#general-thresholddef\" target=\"_blank\">general flash and red flash thresholds</a>.</p>\
\
<p class=\"sc-note\">Note: Content that does not occupy more than 25% of 10 degrees of the visual field is exempt. See <a href=\"https://www.w3.org/TR/WCAG20-TECHS/G176.html\" target=\"_blank\">Technique G176</a> for how to calculate.</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 2.3.1": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/seizure-does-not-violate.html",
					"How to meet Success Criterion 2.3.1": "https://www.w3.org/WAI/WCAG20/quickref/#qr-seizure-does-not-violate"
				}
			}
		},
		
		{
			"id": "sc-2.3.2",
			"level": "aaa",
	        "name":  {
				"en": "Three Flashes"
			},
			"guidance": {
				"en": "<p>Verify that there is no content that flashes more than three times per second.</p>\
\
<p class=\"sc-note\">Note: This success criterion differs from <a href=\"#sc-2.3.1\">2.3.1</a> in that it makes no exceptions for flashing that is below the general and red flash thresholds.</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 2.3.2": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/seizure-three-times.html",
					"How to meet Success Criterion 2.3.2": "https://www.w3.org/WAI/WCAG20/quickref/#qr-seizure-three-times"
				}
			}
		},
	
		{
			"id": "sc-2.4.1",
			"level": "a",
	        "name":  {
				"en": "Bypass Blocks"
			},
			"guidance": {
				"en": "<p>If identical content is repeated at the beginning of every content document, there must be a way to bypass the duplicate information.</p>\
\
<p>Although this problem is typically rare in EPUB publication, one place it may be encountered is with running headers and footers in fixed-layout publications. In these cases, the HTML <code>header</code> and <code>footer</code> elements can be used to encapsulate the running header/footer and the <code>main</code> element can be used to encapsulate the body.</p>\
\
<p class=\"sc-note\">Note: This success criterion typically is aimed at web site navigation, to allow users to bypass repeated site headers, navigation bars, etc.</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 2.4.1": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-skip.html",
					"How to meet Success Criterion 2.4.1": "https://www.w3.org/WAI/WCAG20/quickref/#qr-navigation-mechanisms-skip"
				}
			}
		},
		
		{
			"id": "sc-2.4.2",
			"level": "a",
	        "name":  {
				"en": "Page Titled"
			},
			"guidance": {
				"en": "<p>Verify that the publication has a meaningful title in the EPUB package document.</p>\
\
<p>Verify that the title of each content document meaningfully describes its content.</p>"
			},
			"kb": {
				"en": {
					"Page Title": "http://kb.daisy.org/publishing/docs/html/title.html",
					"TITLES-001: Include publication and document titles": "http://www.idpf.org/epub/a11y/techniques/#titles-001"
				}
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 2.4.2": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-title.html",
					"How to meet Success Criterion 2.4.2": "https://www.w3.org/WAI/WCAG20/quickref/#qr-navigation-mechanisms-title"
				}
			}
		},
		
		{
			"id": "sc-2.4.3",
			"level": "a",
	        "name":  {
				"en": "Focus Order"
			},
			"guidance": {
				"en": "<p>Verify that there is an intelligible ordering / relationship when tabbing through interactive and form elements.</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 2.4.3": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-focus-order.html",
					"How to meet Success Criterion 2.4.3": "https://www.w3.org/WAI/WCAG20/quickref/#qr-navigation-mechanisms-focus-order"
				}
			}
		},
		
		{
			"id": "sc-2.4.4",
			"level": "a",
	        "name":  {
				"en": "Link Purpose (In Context)"
			},
			"guidance": {
				"en": "<p>Verify that links have meaningful text, or can be understood from the surrounding text (preferably from the text that precedes the link).</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 2.4.4": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-refs.html",
					"How to meet Success Criterion 2.4.4": "https://www.w3.org/WAI/WCAG20/quickref/#qr-navigation-mechanisms-refs"
				}
			}
		},
		
		{
			"id": "sc-2.4.5",
			"level": "aa",
	        "name":  {
				"en": "Multiple Ways"
			},
			"guidance": {
				"en": "<p>There must be at least two ways that allow a user can navigate through the content. EPUB publications minimally meets this requirement if all content documents are listed in the spine and there is a navigation document with links to the major sections.</p>\
\
<p>The addition of a page list or index can also be counted in meeting this criterion.</p>\
\
<p class=\"sc-note\">Note: The inclusion of landmarks should not be considered when evaluating this criterion, although they are important to include. Users only have access to these landmarks through the functionality provided by a given reading system; there isn't broad support for users to access the links directly.</p>"
			},
			"kb": {
				"en": {
					"Table of Contents": "http://kb.daisy.org/publishing/docs/navigation/toc.html",
					"Page Navigation": "http://kb.daisy.org/publishing/docs/navigation/pagelist.html",
					"Landmarks": "http://kb.daisy.org/publishing/docs/navigation/landmarks.html",
					"ACCESS-002: Provide multiple ways to access the content": "http://www.idpf.org/epub/a11y/techniques/#access-002",
					"SEM-003: Include EPUB landmarks": "http://www.idpf.org/epub/a11y/techniques/#sem-003",
					"PAGE-003: Provide a page list": "http://www.idpf.org/epub/a11y/techniques/#page-003"
				}
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 2.4.5": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-mult-loc.html",
					"How to meet Success Criterion 2.4.5": "https://www.w3.org/WAI/WCAG20/quickref/#qr-navigation-mechanisms-mult-loc"
				}
			}
		},
		
		{
			"id": "sc-2.4.6",
			"level": "aa",
	        "name":  {
				"en": "Headings and Labels"
			},
			"guidance": {
				"en": "<p>Verify that headings and labels describe the purpose or topic of the content they are associated with.</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 2.4.6": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-descriptive.html",
					"How to meet Success Criterion 2.4.6": "https://www.w3.org/WAI/WCAG20/quickref/#qr-navigation-mechanisms-descriptive"
				}
			}
		},
		
		{
			"id": "sc-2.4.7",
			"level": "aa",
	        "name":  {
				"en": "Focus Visible"
			},
			"guidance": {
				"en": "<p>If there are any keyboard-operable user interfaces, ensure each control shows focus when active.</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 2.4.7": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-focus-visible.html",
					"How to meet Success Criterion 2.4.7": "https://www.w3.org/WAI/WCAG20/quickref/#qr-navigation-mechanisms-focus-visible"
				}
			}
		},
		
		{
			"id": "sc-2.4.8",
			"level": "aaa",
	        "name":  {
				"en": "Location"
			},
			"guidance": {
				"en": "<p>This success criterion is not applicable to EPUB publications.</p>\
\
<p>To improve the ability of users to find their location, however, the inclusion of static page markers and use of running headers and footers, when possible, are recommended.</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 2.4.8": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-location.html",
					"How to meet Success Criterion 2.4.8": "https://www.w3.org/WAI/WCAG20/quickref/#qr-navigation-mechanisms-location"
				}
			}
		},
		
		{
			"id": "sc-2.4.9",
			"level": "aaa",
	        "name":  {
				"en": "Link Purpose (Link Only)"
			},
			"guidance": {
				"en": "<p>Verify that purpose of each link can be understood from their text alone.</p>\
\
<p class=\"sc-note\">Note: This success criterion differs from <a href=\"#sc-2.4.4\">2.4.4</a> in that all necessary context must be part of the link text. The reader must not have to read the surrounding text to understand the purpose of the link.</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 2.4.9": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-link.html",
					"How to meet Success Criterion 2.4.9": "https://www.w3.org/WAI/WCAG20/quickref/#qr-navigation-mechanisms-link"
				}
			}
		},
		
		{
			"id": "sc-2.4.10",
			"level": "aaa",
	        "name":  {
				"en": "Section Headings"
			},
			"guidance": {
				"en": "<p>Verify that each section of the publication is identified with a heading, and the heading numbers currectly identify the position of the heading in the document outline.</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 2.4.10": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-headings.html",
					"How to meet Success Criterion 2.4.10": "https://www.w3.org/WAI/WCAG20/quickref/#qr-navigation-mechanisms-headings"
				}
			}
		},
	
		{
			"id": "sc-3.1.1",
			"level": "a",
	        "name":  {
				"en": "Language of Page"
			},
			"guidance": {
				"en": "<p>Verify the following:</p>\
\
<ul>\
	<li>In the package document, the correct language codes are specified on the <code>package</code> element (<code>xml:lang</code> attribute) and in the <code>dc:language</code> elements.</li>\
	<li>In each content document, the correct language code is specified on the root <code>html</code> element (<code>xml:lang</code> and <code>lang</code> attributes).</li>\
</ul>"
			},
			"kb": {
				"en": {
					"Language": "http://kb.daisy.org/publishing/docs/html/lang.html"
				}
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 3.1.1": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/meaning-doc-lang-id.html",
					"How to meet Success Criterion 3.1.1": "https://www.w3.org/WAI/WCAG20/quickref/#qr-meaning-doc-lang-id"
				}
			}
		},
		
		{
			"id": "sc-3.1.2",
			"level": "aa",
	        "name":  {
				"en": "Language of Parts"
			},
			"kb": {
				"en": {
					"Language": "http://kb.daisy.org/publishing/docs/html/lang.html"
				}
			},
			"guidance": {
				"en": "<p>Verify that all foreign language words and phrases have been identified and that the correct language code has been used in each case.</p>\
\
<p class=\"sc-note\">Note: This success criterion does not apply to foreign words or phrases that have become part of the native language (e.g., \"vis-a-vis\" or \"faux pas\").</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 3.1.2": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/meaning-other-lang-id.html",
					"How to meet Success Criterion 3.1.2": "https://www.w3.org/WAI/WCAG20/quickref/#qr-meaning-other-lang-id"
				}
			}
		},
		
		{
			"id": "sc-3.1.3",
			"level": "aaa",
	        "name":  {
				"en": "Unusual Words"
			},
			"guidance": {
				"en": "<p>Verify the following:</p>\
\
<ul>\
	<li>If the publication contains unique or unusual words, ensure it includes definitions (e.g., in a glossary or definition lists).</li>\
	<li>If the same word has two different meanings in the same publication, ensure that an inline definition, or link to the applicable definition, is provided.</li>\
</ul>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 3.1.3": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/meaning-idioms.html",
					"How to meet Success Criterion 3.1.3": "https://www.w3.org/WAI/WCAG20/quickref/#qr-meaning-idioms"
				}
			}
		},
		
		{
			"id": "sc-3.1.4",
			"level": "aaa",
	        "name":  {
				"en": "Abbreviations"
			},
			"guidance": {
				"en": "<p>Verify that a mechanism for identifying the expanded form or meaning of all acronyms is provided (e.g., including the expansion with the first use of the acronym or linking to a definition).</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 3.1.4": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/meaning-located.html",
					"How to meet Success Criterion 3.1.4": "https://www.w3.org/WAI/WCAG20/quickref/#qr-meaning-located"
				}
			}
		},
		
		{
			"id": "sc-3.1.5",
			"level": "aaa",
	        "name":  {
				"en": "Reading Level"
			},
			"guidance": {
				"en": "<p>Verify that the publication can be read and understood by someone with a lower secondary level reading ability (7-9 years of education), or that supplemental content is provided that allows the content to be understood by such a reader.</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 3.1.5": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/meaning-supplements.html",
					"How to meet Success Criterion 3.1.5": "https://www.w3.org/WAI/WCAG20/quickref/#qr-meaning-supplements"
				}
			}
		},
		
		{
			"id": "sc-3.1.6",
			"level": "aaa",
	        "name":  {
				"en": "Pronunciation"
			},
			"guidance": {
				"en": "<p>Verify that the proper pronunciation is provided for words whose meaning cannot be identified from their surrounding context.</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 3.1.6": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/meaning-pronunciation.html",
					"How to meet Success Criterion 3.1.6": "https://www.w3.org/WAI/WCAG20/quickref/#qr-meaning-pronunciation"
				}
			}
		},
		
		{
			"id": "sc-3.2.1",
			"level": "a",
	        "name":  {
				"en": "On Focus"
			},
			"guidance": {
				"en": "<p>Verify that focus changes do not cause a change in context to occur (e.g., a form to submit, a window to open, a change of focused element).</p>\
\
<p class=\"sc-note\">Note: Changes in content are not forbidden so long as a context change doesn't also occur.</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 3.2.1": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/consistent-behavior-receive-focus.html",
					"How to meet Success Criterion 3.2.1": "https://www.w3.org/WAI/WCAG20/quickref/#qr-consistent-behavior-receive-focus"
				}
			}
		},
		
		{
			"id": "sc-3.2.2",
			"level": "a",
	        "name":  {
				"en": "On Input"
			},
			"guidance": {
				"en": "<p>Verify that activating or changing a form input does not automatically cause a change of context unless the user is notified what context change(s) will occur before activating.</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 3.2.2": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/consistent-behavior-unpredictable-change.html",
					"How to meet Success Criterion 3.2.2": "https://www.w3.org/WAI/WCAG20/quickref/#qr-consistent-behavior-unpredictable-change"
				}
			}
		},
		
		{
			"id": "sc-3.2.3",
			"level": "aa",
	        "name":  {
				"en": "Consistent Navigation"
			},
			"guidance": {
				"en": "<p>Verify that any repeated navigational aids appear in the same relative location within each content document (e.g., lists of objectives or outcomes).</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 3.2.3": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/consistent-behavior-consistent-locations.html",
					"How to meet Success Criterion 3.2.3": "https://www.w3.org/WAI/WCAG20/quickref/#qr-consistent-behavior-consistent-locations"
				}
			}
		},
		
		{
			"id": "sc-3.2.4",
			"level": "aa",
	        "name":  {
				"en": "Consistent Identification"
			},
			"guidance": {
				"en": "<p>Verify that any components/features repeated across documents are consistently identified (e.g., exercises, objectives, etc.).</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 3.2.4": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/consistent-behavior-consistent-functionality.html",
					"How to meet Success Criterion 3.2.4": "https://www.w3.org/WAI/WCAG20/quickref/#qr-consistent-behavior-consistent-functionality"
				}
			}
		},
		
		{
			"id": "sc-3.2.5",
			"level": "aaa",
	        "name":  {
				"en": "Change on Request"
			},
			"guidance": {
				"en": "<p>Verify that the user can control all changes in context.</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 3.2.5": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/consistent-behavior-no-extreme-changes-context.html",
					"How to meet Success Criterion 3.2.5": "https://www.w3.org/WAI/WCAG20/quickref/#qr-consistent-behavior-no-extreme-changes-context"
				}
			}
		},
		
		{
			"id": "sc-3.3.1",
			"level": "a",
	        "name":  {
				"en": "Error Identification"
			},
			"guidance": {
				"en": "<p>Verify that form input errors are identified and described.</p>"
			},
			"kb": {
				"en": {
					"Forms": "http://kb.daisy.org/publishing/docs/html/forms.html"
				}
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 3.3.1": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/minimize-error-identified.html",
					"How to meet Success Criterion 3.3.1": "https://www.w3.org/WAI/WCAG20/quickref/#qr-minimize-error-identified"
				}
			}
		},
		
		{
			"id": "sc-3.3.2",
			"level": "a",
	        "name":  {
				"en": "Labels or Instructions"
			},
			"guidance": {
				"en": "<p>Verify that form inputs are clearly labelled and all required fields are identifiable.</p>"
			},
			"kb": {
				"en": {
					"Forms": "http://kb.daisy.org/publishing/docs/html/forms.html"
				}
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 3.3.2": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/minimize-error-cues.html",
					"How to meet Success Criterion 3.3.2": "https://www.w3.org/WAI/WCAG20/quickref/#qr-minimize-error-cues"
				}
			}
		},
		
		{
			"id": "sc-3.3.3",
			"level": "aa",
	        "name":  {
				"en": "Error Suggestion"
			},
			"guidance": {
				"en": "<p>Verify that any input error messages identify how to fix the problem, unless a message about how to fix would compromise security or defeat the purpose (e.g., undermine quizzes and tests).</p>"
			},
			"kb": {
				"en": {
					"Forms": "http://kb.daisy.org/publishing/docs/html/forms.html"
				}
			},
				
			"documentation": {
				"en": {
					"Understanding Success Criterion 3.3.3": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/minimize-error-suggestions.html",
					"How to meet Success Criterion 3.3.3": "https://www.w3.org/WAI/WCAG20/quickref/#qr-minimize-error-suggestions"
				}
			}
		},
		
		{
			"id": "sc-3.3.4",
			"level": "aa",
	        "name":  {
				"en": "Error Prevention (Legal, Financial, Data)"
			},
			"guidance": {
				"en": "<p>If any form causes legal commitments or financial transactions, modifies or deletes user-controllable data in data storage systems, or submits user test responses, at least one of the following must be true:</p>\
\
<ul>\
	<li>The submission is reversible.</li>\
	<li>Data entered by the user is checked for errors and the user has to opportunity to correct them.</li>\
	<li>A mechanism is available for reviewing, confirming, and correcting information before finalizing the submission.</li>\
</ul>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 3.3.4": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/minimize-error-reversible.html",
					"How to meet Success Criterion 3.3.4": "https://www.w3.org/WAI/WCAG20/quickref/#qr-minimize-error-reversible"
				}
			}
		},
		
		{
			"id": "sc-3.3.5",
			"level": "aaa",
	        "name":  {
				"en": "Help"
			},
			"guidance": {
				"en": "<p>Verify that context-sensitive help is available.</p>\
\
<p class=\"sc-note\">Note: This success criterion only applies to forms and interactive content where the correct input or action cannot be determined from the label or context. Content documents are not required to provide help links.</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 3.3.5": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/minimize-error-context-help.html",
					"How to meet Success Criterion 3.3.5": "https://www.w3.org/WAI/WCAG20/quickref/#qr-minimize-error-context-help"
				}
			}
		},
		
		{
			"id": "sc-3.3.6",
			"level": "aaa",
	        "name":  {
				"en": "Error Prevention (All)"
			},
			"guidance": {
				"en": "<p>If the user is required to submit information, verify at least one of the following is true:</p>\
\
<ul>\
	<li>The submission is reversible.</li>\
	<li>Data entered by the user is checked for input errors and the user is provided an opportunity to correct them.</li>\
	<li>A mechanism is available for reviewing, confirming, and correcting information before finalizing the submission.</li>\
</ul>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 3.3.6": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/minimize-error-reversible-all.html",
					"How to meet Success Criterion 3.3.6": "https://www.w3.org/WAI/WCAG20/quickref/#qr-minimize-error-reversible-all"
				}
			}
		},
	
		{
			"id": "sc-4.1.1",
			"level": "a",
	        "name":  {
				"en": "Parsing"
			},
			"guidance": {
				"en": "<p>Verify the publication passes EPUBCheck (or a similar EPUB validator) without any of the following errors:</p>\
<ul>\
	<li>Well-formedness errors &#8212; All required start and end tags are present.</li>\
	<li>Nesting errors &#8212; Elements must only be used where they are valid (e.g., list items inside of lists).</li>\
	<li>Duplicate attributes &#8212; Elements are only allowed one instance of any attribute.</li>\
	<li>Duplicate IDs &#8212; Each ID in a document must be unique.</li>\
</ul>\
<p>It is recommended to fix all errors reported by EPUBCheck to ensure maximum usability of the publication but it is not a requirement for accessibility.</p>"
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 4.1.1": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/ensure-compat-parses.html",
					"How to meet Success Criterion 4.1.1": "https://www.w3.org/WAI/WCAG20/quickref/#qr-ensure-compat-parses"
				}
			}
		},
		
		{
			"id": "sc-4.1.2",
			"level": "a",
	        "name":  {
				"en": "Name, Role, Value"
			},
			"guidance": {
				"en": "<p>Check that all controls have a name and role, and all states and properties necessary to for user interaction are set and function properly.</p>"
			},
			"kb": {
				"en": {
					"ARIA": "http://kb.daisy.org/publishing/docs/script/aria.html"
				}
			},
			"documentation": {
				"en": {
					"Understanding Success Criterion 4.1.2": "https://www.w3.org/TR/UNDERSTANDING-WCAG20/ensure-compat-rsv.html",
					"How to meet Success Criterion 4.1.2": "https://www.w3.org/WAI/WCAG20/quickref/#qr-ensure-compat-rsv"
				}
			}
		},
	
		{
			"id": "eg-1",
			"level": "epub",
			"name": {
				"en": "Page Numbers"
			},
			"guidance": {
				"en": "<p>If the publication includes pagination, ensure the following are true:</p>\
\
<ul>\
	<li>a means of accessing all the page break locations is included.</li>\
	<li>if page breaks are included in the text, they are identifiable by the <code>role</code> attribute value <code>doc-pagebreak</code>.</li>\
	<li>the source is identified in the package document.</li>\
</ul>"
			},
			"kb": {
				"en": {
					"Page Navigation": "http://kb.daisy.org/publishing/docs/navigation/pagelist.html"
				}
			}
		},
		
		{
			"id": "eg-2",
			"level": "epub",
			"name": {
				"en": "Media Overlays"
			},
			"guidance": {
				"en": "<p class=\"note\">Media Overlay practices are currently only informative. Failure to meet the requirements of the specification does not fail publications. This exemption may change in a future version.</p>\
\
<p>If the publication includes media overlays, ensure the following are all true:</p>\
\
<ul>\
	<li>All skippable structures are identified.</li>\
	<li>All escapable structures are identified.</li>\
	<li>A Media Overlay Document is included for the EPUB Navigation Document.</li>\
</ul>"
			}
		}
	]
};
