
var sc_config = {
	"sc": [
		{
			"id": "sc-1.1.1",
			"ref": "non-text-content",
			"version": "2.0",
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
					<li>its <code>figcaption</code> element or the surrounding text must describe the image;</li>\
					<li>the image must be part of a group of images in which only one carries the alternative text.</li>\
				</ul>\
			</li>\
			<li>\
				<p>Otherwise, ensure that the <code>alt</code> text meaningfully describes the image.</p>\
				<p>Refer to the Ace report for the list of images and their alt text values.</p>\
			</li>\
		</ul>\
	</li>\
	<li data-scope=\"audio\">Ensure each <code>audio</code> element has a label (<code>aria-label</code> attribute).</li>\
	<li data-scope=\"video\">Ensure each <code>video</code> element has a label (<code>aria-label</code> attribute) that references where to find the transcript or indicates that audio descriptions are available.</li>\
	<li>Ensure any <code>object</code> and <code>embed</code> tags do not embed non-text content without a text alternative \
		(i.e., their fallback content must not also be inaccessible).</li>\
</ul>"
			}
		},
	
		{
			"id": "sc-1.2.1",
			"ref": "audio-only-and-video-only-prerecorded",
			"version": "2.0",
			"level": "a",
	        "name":  {
				"en": "Audio-only and Video-only (Prerecorded)"
			},
			"guidance": {
				"en": "<div data-scope=\"audio\">\
	<p>For all audio clips, verify the following:</p>\
	<ul>\
		<li>There is a transcript.</li>\
		<li>The transcript accurately reflects the information contained in the audio clip.</li>\
</div>\
\
<div data-scope=\"video\">\
	<p>For all video-only clips, verify the following:</p>\
	<ul>\
		<li>There is a transcript or the video includes audio descriptions (if the video is not fully described in the surrounding text).</li>\
		<li>The transcript/audio descriptions accurately reflect the information contained in the video clip.</li>\
	</ul>\
		<p class=\"sc-note\">Note: a video-only clip is one that has no accompanying audio (e.g., a silent movie).</p>\
</div>"
			}
		},
		
		{
			"id": "sc-1.2.2",
			"ref": "captions-prerecorded",
			"version": "2.0",
			"level": "a",
	        "name":  {
				"en": "Captions (Prerecorded)"
			},
			"guidance": {
				"en": "<p>For all video clips with audio, verify the following:</p>\
<ul>\
	<li>A <code>track</code> element provides captions, or the video includes open or closed captions natively.</li>\
	<li>The captions accurately capture the audio content.</li>\
</ul>"
			}
		},
		
		{
			"id": "sc-1.2.3",
			"ref": "audio-description-or-media-alternative-prerecorded",
			"version": "2.0",
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
	<li>A <code>track</code> element includes an audio description (<code>kind=\"descriptions\"</code>), or the audio includes descriptions by default.</li>\
	<li>The author has provided a transcript with the descriptions.</li>\
</ul>\
\
<p class=\"sc-note\">Note: This success criterion does not apply to video without audio. See <a href=\"#sc-1.2.1\">1.2.1</a> for such cases.</p>"
			}
		},
		
		{
			"id": "sc-1.2.4",
			"ref": "captions-live",
			"version": "2.0",
			"level": "aa",
	        "name":  {
				"en": "Captions (Live)"
			},
			"guidance": {
				"en": "<p>Check if the publication provides access to any real-time audio/video broadcasts (i.e., that are only available on a specific date and time).</p>\
\
<p>If so, the broadcasts must be live captioned to pass.</p>\
\
<p class=\"sc-note\">Note: Remotely-hosted audio and video files are not live broadcasts, as users can access them at any time and at any point in their timeline.</p>"
			}
		},
		
		{
			"id": "sc-1.2.5",
			"ref": "audio-description-prerecorded",
			"version": "2.0",
			"level": "aa",
	        "name":  {
				"en": "Audio Description (Prerecorded)"
			},
			"guidance": {
				"en": "<p>Check if there is any video whose accompanying audio does not fully describe all the visual information (e.g., actions being carried out).</p>\
\
<p>If yes, verify that the author has provided audio descriptions for each.</p>"
			}
		},
		
		{
			"id": "sc-1.2.6",
			"ref": "sign-language-prerecorded",
			"version": "2.0",
			"level": "aaa",
	        "name":  {
				"en": "Sign Language (Prerecorded)"
			},
			"guidance": {
				"en": "<p>Check if there is any video content with audio.</p> \
\
<p>If yes, verify that the author has provided sign language interpretation the audio.</p>\
\
<p class=\"sc-note\">Note: The author does not have to provide sign language interpretation for purely audio content (i.e., without video) to meet this success criterion.</p>"
			}
		},
		
		{
			"id": "sc-1.2.7",
			"ref": "extended-audio-description-prerecorded",
			"version": "2.0",
			"level": "aaa",
	        "name":  {
				"en": "Extended Audio Description (Prerecorded)"
			},
			"guidance": {
				"en": "<p>Verify that audio descriptions do not overlap the foreground audio (i.e., that the description does not interfere with the ability to listen to dialogue or important sounds).</p>\
\
<p>If overlaps are found, the author must provide extended descriptions whereby the video and audio playback pause until the description completes.</p>"
			}
		},
		
		{
			"id": "sc-1.2.8",
			"ref": "media-alternative-prerecorded",
			"version": "2.0",
			"level": "aaa",
	        "name":  {
				"en": "Media Alternative (Prerecorded)"
			},
			"guidance": {
				"en": "<p>If the publication has video, verify the author has provided a transcript for each instance, whether the video has audio or not. The transcript must accurately describe all auditory and visual information.</p>\
\
<p class=\"sc-note\">Note: Transcripts that only capture dialogue are not sufficient to meet this success criterion.</p>"
			}
		},
		
		{
			"id": "sc-1.2.9",
			"ref": "audio-only-live",
			"version": "2.0",
			"level": "aaa",
	        "name":  {
				"en": "Audio-only (Live)"
			},
			"guidance": {
				"en": "<p>If the publication provides access to a live audio stream (i.e., not pre-recorded), verify that a text alternative is made available (e.g., through live captioning).</p>\
\
<p class=\"sc-note\">Note: As support for live streaming protocols is not a part of EPUB, this success criterion is typically not applicable.</p>"
			}
		},
	
		{
			"id": "sc-1.3.1",
			"ref": "info-and-relationships",
			"version": "2.0",
			"level": "a",
	        "name":  {
				"en": "Info and Relationships"
			},
			"guidance": {
				"en": "<p>Verify that the author has encoded all essential information and relationships in the markup.</p>\
\
<p class=\"sc-note\">Note: You must inspect the markup of each content document to verify this success criterion, as it ensures that the markup matches the visual presentation of the content.</p>\
\
<p>Some common problems areas to check include:</p>\
\
<ul>\
	<li><a href=\"http://kb.daisy.org/publishing/docs/html/headings.html\" target=\"_blank\">Headings</a>\
		<ul>\
			<li>The author used HTML heading tags identify all section headings.</li>\
			<li>The author has not used <code>h1</code>-<code>h6</code> elements to tag subtitles.</li>\
			<li>The choice of heading tag correctly reflects the section heading depth (e.g., an <code>h2</code> heading is used for the immediate subsections of an <code>h1</code> heading).</li>\
			<li>The author has not used headings for purely formatting purposes (e.g., to make non-heading text appear bigger).</li>\
		</ul>\
	</li>\
	\
	<li><a href=\"http://kb.daisy.org/publishing/docs/html/tables.html\" target=\"_blank\">Tables</a>\
		<ul>\
			<li>The author has correctly associated table headers with cells using the <code>scope</code> or <code>headers</code> attribute.</li>\
			<li>Complex tables include a description of their structure.</li>\
		</ul>\
	</li>\
	\
	<li><a href=\"http://kb.daisy.org/publishing/docs/html/lists.html\" target=\"_blank\">Lists</a>\
		<ul>\
			<li>The author has used the correct type of list to convey the ordering (ordered or unordered).</li>\
			<li>The author has used list tagging for lists (i.e., they are not styled paragraphs).</li>\
		</ul>\
	</li>\
	\
	<li><a href=\"http://kb.daisy.org/publishing/docs/css/color.html\" target=\"_blank\">Color</a>\
		<ul>\
			<li>Content offset from the main narrative by shading or colored borders also includes semantic markup (e.g., the <code>aside</code> tag with an appropriate role);</li>\
		</ul>\
	</li>\
	\
	<li><a href=\"http://kb.daisy.org/publishing/docs/html/notes.html\" target=\"_blank\">Footnotes</a>\
		<ul>\
			<li>Footnotes in the body text include the role <code>doc-footnote</code>.</li>\
			<li>Footnotes references include the role <code>doc-noteref</code>.</li>\
			<li>Groups of notes at the end of a section or the publication include the role <code>doc-endnotes</code> on their <code>section</code> tag.</li>\
		</ul>\
	</li>\
</ul>\
\
<p>For more markup best practices, refer to the <a href=\"http://kb.daisy.org/publishing/\">DAISY Accessible Publishing Knowledge Base</a>.</p>"
			}
		},
		
		{
			"id": "sc-1.3.2",
			"ref": "meaningful-sequence",
			"version": "2.0",
			"level": "a",
	        "name":  {
				"en": "Meaningful Sequence"
			},
			"guidance": {
				"en": "<p>Review each content document and verify that comprehension of the content is not dependent on the visual rendering (both within the page and across page boundaries).</p>"
			}
		},
		
		{
			"id": "sc-1.3.3",
			"ref": "sensory-characteristics",
			"version": "2.0",
			"level": "a",
	        "name":  {
				"en": "Sensory Characteristics"
			},
			"guidance": {
				"en": "<p>If the publication includes instructions for understanding or operating the content, verify the instructions do not depend solely on sensory perception (e.g., selecting an object by its colour, shape, size, position, etc.).</p>\
\
<p class=\"sc-note\">Note: Content does not fail this success criterion simply because it employs colours, shapes, sizes, etc. A sidebar identifiable by background shading is not a failure unless there are instructions to review only certain coloured sidebars, for example. Requirements for semantic tagging are covered by <a href=\"#sc-1.3.1\">1.3.1</a>.</p>"
			}
		},
		
		{
			"id": "sc-1.3.4",
			"ref": "orientation",
			"version": "2.1",
			"level": "aa",
	        "name":  {
				"en": "Orientation"
			},
			"guidance": {
				"en": "<p>Check that the publication is not locked to reading in only one device orientation.</p>\
<p>In addition, ensure that changing the orientation does not cause issues with resizing the text (see <a href=\"#sc-1.4.4\">success criteria 1.4.4</a>).</p>\
<p>This success criterion is most often an issue with fixed layout publication. Reflowable EPUBs should adapt to changes in orientation.</p>"
			}
		},
		
		{
			"id": "sc-1.3.5",
			"ref": "identify-input-purpose",
			"version": "2.1",
			"level": "aa",
	        "name":  {
				"en": "Identify Input Purpose"
			},
			"guidance": {
				"en": "<p>If the publication has any forms that collect information about a user (e.g., their address, \
telephone numer, etc.), check that each input a reading system can autocomplete from saved information \
includes an <code>autocomplete</code> attribute with a <a href=\"https://www.w3.org/TR/WCAG21/#input-purposes\">value \
from the WCAG input purpose list</a> (these are a subset of the list HTML allows).</p> \
<p class=\"sc-note\">Note: Not every input requires an autocomplete value, only those collecting information for which \
there is a matching value.</p>"
			}
		},
		
		{
			"id": "sc-1.3.6",
			"ref": "identify-purpose",
			"version": "2.1",
			"level": "aaa",
	        "name":  {
				"en": "Identify Purpose"
			},
			"guidance": {
				"en": "<p>Ensure that DPUB-ARIA roles used to identify all applicable sections and regions of each content document.</p>"
			}
		},
	
		{
			"id": "sc-1.4.1",
			"ref": "use-of-color",
			"version": "2.0",
			"level": "a",
	        "name":  {
				"en": "Use of Color"
			},
			"guidance": {
				"en": "<p>Verify that there are alternatives to color where the content makes use of the perception of colour to convey meaning or purpose (e.g., in order to understand the different pieces of a chart, to determine what controls to use in a scripted interface, or to identify hyperlinks from regular text).</p> \
<p class=\"sc-note\">Note: This success criterion only covers the needs of sighted users who are color blind or have difficult perceiving color (i.e., the alternatives for color-dependent content must be visible, such as the addition of underline or bolding for hyperlinks).</p>"
			}
		},
		
		{
			"id": "sc-1.4.2",
			"ref": "audio-control",
			"version": "2.0",
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
			}
		},
		
		{
			"id": "sc-1.4.3",
			"ref": "contrast-minimum",
			"version": "2.0",
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
			}
		},
		
		{
			"id": "sc-1.4.4",
			"ref": "resize-text",
			"version": "2.0",
			"level": "aa",
	        "name":  {
				"en": "Resize text"
			},
			"guidance": {
				"en": "<p>Verify that font declarations use relative sizes (e.g., <code>%</code>, <code>em</code>, <code>rem</code>) and/or that text container elements resize/reflow with the text.</p>\
\
<p>Zoom the text to 200% and ensure that the publication remains readable/functional (e.g., no text is cut off).</p>"
			}
		},
		
		{
			"id": "sc-1.4.5",
			"ref": "images-of-text",
			"version": "2.0",
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
			}
		},
		
		{
			"id": "sc-1.4.6",
			"ref": "contrast-enhanced",
			"version": "2.0",
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
			}
		},
		
		{
			"id": "sc-1.4.7",
			"ref": "low-or-no-background-audio",
			"version": "2.0",
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
			}
		},
		
		{
			"id": "sc-1.4.8",
			"ref": "visual-presentation",
			"version": "2.0",
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
			}
		},
		
		{
			"id": "sc-1.4.9",
			"ref": "images-of-text-no-exception",
			"version": "2.0",
			"level": "aaa",
	        "name":  {
				"en": "Images of Text (No Exception)"
			},
			"guidance": {
				"en": "<p>Verify that any images of text are decorative or the presentation is essential (e.g., logos and brand names).</p>\
\
<p class=\"sc-note\">Note: images of text does not include graphs and diagrams where more than just the text is essential information.</p>"
			}
		},
	
		{
			"id": "sc-1.4.10",
			"ref": "reflow",
			"version": "2.1",
			"level": "aa",
	        "name":  {
				"en": "Reflow"
			},
			"guidance": {
				"en": "<p>Zoom the content so that it is no more than 320 pixels wide and 256 pixels high (this is equal \
to 400% zoom on a device screen that is 1280 pixels wide by 1024 high).</p> \
<p>Check that horizontal and vertical scrolling is not required to read the text.</p> \
<p class=\"sc-note\">Note: This requirement does not apply to visual media that requires two-dimensional layout, such as \
video, diagrams, maps, etc. It is also only recommended (but not required) that the content within table cells not require \
scrolling when zoomed, not that the entire table be viewable without scrolling.</p> \
<p>For fixed layouts, while background images may be exempt, the text content of the page must reflow when zoomed.</p>"
			}
		},

		{
			"id": "sc-1.4.11",
			"ref": "non-text-contrast",
			"version": "2.1",
			"level": "aa",
	        "name":  {
				"en": "Non-text Contrast"
			},
			"guidance": {
				"en": "<p>Check if the publication uses any icons to convey information. Common examples in \
books include icons that identify sidebars, such as an exclamation point for warning and cautions, a pencil for \
learning objectives, etc.</p> \
<p>If any such icons are found, ensure that there is at least 3:1 contrast between the symbol and the colour adjacent \
to it.</p> \
<p>The same check also needs to be performed for any diagrams, charts, infographics, and other visual content that \
conveys information. If any of these images use graphical components as the sole means of conveying the information \
(e.g., a pie chart that shows slices but does not explicitly indicate the size of each), each component must have a 3:1 \
contrast with the adjacent coloring.</p> \
<p>In addition, verify that any form fields also meet this requirement. For example, that there is sufficient contrast \
between the borders of text input fields and the adjacaent color, around buttons, and for radio buttons and checkboxes.</p>"
			}
		},

		{
			"id": "sc-1.4.12",
			"ref": "text-spacing",
			"version": "2.1",
			"level": "aa",
	        "name":  {
				"en": "Text Spacing"
			},
			"guidance": {
				"en": "<p>Change the text display of the content as follows:<p> \
<ul> \
<li>Set the line height to 1.5 times the font height.</li> \
<li>Set the spacing after paragraphs to 2 times the font height.</li> \
<li>Set the letter spacing to 0.12 times the font height.</li> \
<li>Set word spacing to 0.16 times the font height.</li> \
</ul> \
<p>Now check that the text is not cut off (e.g., when in an aside or other box) or overlapping.</p> \
<p>If any of these properties are not applicable to a specific language (e.g., word spacing to Japanese, Korean and Chinese), \
they do not have to be tested.</p> \
<p class=\"sc-note\">Note: This success criterion will likely require testing in a browser as reading systems provide limited \
control over these properties.</p>"
			}
		},

		{
			"id": "sc-1.4.13",
			"ref": "content-on-hover-or-focus",
			"version": "2.1",
			"level": "aa",
	        "name":  {
				"en": "Content on Hover or Focus"
			},
			"guidance": {
				"en": "<p>If the publication has any content that only appears for a mouse hover or keyboard focus event \
(e.g., tooltips using the <code>title</code> attribute or dropdown menus), ensure the following are all true:</p> \
<ul> \
<li>You can dismiss the content without having to change the mouse position or change the keyboard focus (e.g., using \
the escape key).</li> \
<li>If a hover event triggers the content, you can move the mouse over the hovered content without it disappearing.</li> \
<li>The content remains visible until you dismiss it, move the mouse away, tab to another element, or it is no longer \
relevant (e.g., in the case of temporary messages).</li> \
</ul> \
<p class=\"sc-note\">Note: This success criterion is not often applicable to EPUB publications as they are generally \
designed to be read in devices without pointer inputs and keyboards.</p>"
			}
		},
		
		{
			"id": "sc-2.1.1",
			"ref": "keyboard",
			"version": "2.0",
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
			}
		},
		
		{
			"id": "sc-2.1.2",
			"ref": "no-keyboard-trap",
			"version": "2.0",
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
			}
		},
		
		{
			"id": "sc-2.1.3",
			"ref": "keyboard-no-exception",
			"version": "2.0",
			"level": "aaa",
	        "name":  {
				"en": "Keyboard (No Exception)"
			},
			"guidance": {
				"en": "<p>Verify that all interactive content (scripted components, forms, audio, video, links, etc.) is operable from the keyboard.</p>\
\
<p class=\"sc-note\">Note: The difference between this success criterion and <a href=\"#sc-2.1.1\">2.1.1</a> is that this success criterion does not allow an exception for interfaces that require information about the full path of movement.</p>"
			}
		},
	
		{
			"id": "sc-2.1.4",
			"ref": "character-key-shortcuts",
			"version": "2.1",
			"level": "a",
	        "name":  {
				"en": "Character Key Shortcuts"
			},
			"guidance": {
				"en": "<p>Check if the publication makes use of any shortcut keys.</p> \
<p>If yes, and the shortcut is a single printable keyboard character (letters, numbers, punctuation or symbols), then \
at least one of the following must be true:</p> \
<ul>\
<li>There is a way to turn off the shortcut key.</li> \
<li>There is a way to remap the shortcut to include a non-printing key (e.g., Ctrl or Alt)</li> \
<li>The shortcut key is only active when the component it controls has focus.</li> \
</ul>"
			}
		},
		
		{
			"id": "sc-2.2.1",
			"ref": "timing-adjustable",
			"version": "2.0",
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
			}
		},
		
		{
			"id": "sc-2.2.2",
			"ref": "pause-stop-hide",
			"version": "2.0",
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
			}
		},
		
		{
			"id": "sc-2.2.3",
			"ref": "no-timing",
			"version": "2.0",
			"level": "aaa",
	        "name":  {
				"en": "No Timing"
			},
			"guidance": {
				"en": "<p>Verify that timing is not essential to the functioning of the content (e.g., it can be disabled if part of dynamic content, or an alternative untimed version is offered).</p>"
			}
		},
		
		{
			"id": "sc-2.2.4",
			"ref": "interruptions",
			"version": "2.0",
			"level": "aaa",
	        "name":  {
				"en": "Interruptions"
			},
			"guidance": {
				"en": "<p>Verify there are no interruptions from a remote server (e.g., messages pushed to the content), or any interruptions can be turned off or suppressed by the user except in the case of emergencies.</p>\
\
<p class=\"sc-note\">Note: Emergency messages may include alerts about loss of connectivity, if that is important for the user to know.</p>"
			}
		},
		
		{
			"id": "sc-2.2.5",
			"ref": "re-authenticating",
			"version": "2.0",
			"level": "aaa",
	        "name":  {
				"en": "Re-authenticating"
			},
			"guidance": {
				"en": "<p>Verify that the user is able to re-authenticate and continue a transaction or activity (such as a quiz), without loss of any data that has already been entered, if there are circumstances that cause the user to be logged out (e.g., inactivity, security).</p>"
			}
		},
	
		{
			"id": "sc-2.2.6",
			"ref": "timeouts",
			"version": "2.1",
			"level": "aaa",
	        "name":  {
				"en": "Timeouts"
			},
			"guidance": {
				"en": "<p>Ensure that users are warned if a lack of activity will result in data loss (e.g., test \
progress being lost).</p> \
<p>If the data is retained for at least 20 hours of inactivity, this requirement to alert the user does not apply.</p>"
			}
		},
		
		{
			"id": "sc-2.3.1",
			"ref": "three-flashes-or-below-threshold",
			"version": "2.0",
			"level": "a",
	        "name":  {
				"en": "Three Flashes or Below Threshold"
			},
			"guidance": {
				"en": "<p>Verify that there is no content that flashes more than three times per second (e.g., using <a href=\"http://trace.umd.edu/peat\" target=\"_blank\">PEAT</a>), or that the flashing is below the <a href=\"https://www.w3.org/TR/WCAG20/#general-thresholddef\" target=\"_blank\">general flash and red flash thresholds</a>.</p>\
\
<p class=\"sc-note\">Note: Content that does not occupy more than 25% of 10 degrees of the visual field is exempt. See <a href=\"https://www.w3.org/TR/WCAG20-TECHS/G176.html\" target=\"_blank\">Technique G176</a> for how to calculate.</p>"
			}
		},
		
		{
			"id": "sc-2.3.2",
			"ref": "three-flashes",
			"version": "2.0",
			"level": "aaa",
	        "name":  {
				"en": "Three Flashes"
			},
			"guidance": {
				"en": "<p>Verify that there is no content that flashes more than three times per second.</p>\
\
<p class=\"sc-note\">Note: This success criterion differs from <a href=\"#sc-2.3.1\">2.3.1</a> in that it makes no exceptions for flashing that is below the general and red flash thresholds.</p>"
			}
		},
	
		{
			"id": "sc-2.3.3",
			"ref": "animation-from-interactions",
			"version": "2.1",
			"level": "aaa",
	        "name":  {
				"en": "Animation from Interactions"
			},
			"guidance": {
				"en": "<p>Ensure that any animations caused by user interaction can be disabled (e.g., elements appearing \
and disappearing as the content is scrolled).</p> \
<p>Transition effects created by the reading system (e.g., page turns or animated cover page transitions) are not in \
scope of this success criterion.</p>"
			}
		},
		
		{
			"id": "sc-2.4.1",
			"ref": "bypass-blocks",
			"version": "2.0",
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
			}
		},
		
		{
			"id": "sc-2.4.2",
			"ref": "page-titled",
			"version": "2.0",
			"level": "a",
	        "name":  {
				"en": "Page Titled"
			},
			"guidance": {
				"en": "<p>Verify that the publication has a meaningful title in the EPUB package document.</p>\
\
<p>Verify that the title of each content document meaningfully describes its content.</p>"
			}
		},
		
		{
			"id": "sc-2.4.3",
			"ref": "focus-order",
			"version": "2.0",
			"level": "a",
	        "name":  {
				"en": "Focus Order"
			},
			"guidance": {
				"en": "<p>Verify that there is an intelligible ordering / relationship when tabbing through interactive and form elements.</p>"
			}
		},
		
		{
			"id": "sc-2.4.4",
			"ref": "link-purpose-in-context",
			"version": "2.0",
			"level": "a",
	        "name":  {
				"en": "Link Purpose (In Context)"
			},
			"guidance": {
				"en": "<p>Verify that links have meaningful text, or can be understood from the surrounding text (preferably from the text that precedes the link).</p>"
			}
		},
		
		{
			"id": "sc-2.4.5",
			"ref": "multiple-ways",
			"version": "2.0",
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
			}
		},
		
		{
			"id": "sc-2.4.6",
			"ref": "headings-and-labels",
			"version": "2.0",
			"level": "aa",
	        "name":  {
				"en": "Headings and Labels"
			},
			"guidance": {
				"en": "<p>Verify that headings and labels describe the purpose or topic of the content they are associated with.</p>"
			}
		},
		
		{
			"id": "sc-2.4.7",
			"ref": "focus-visible",
			"version": "2.0",
			"level": "aa",
	        "name":  {
				"en": "Focus Visible"
			},
			"guidance": {
				"en": "<p>If there are any keyboard-operable user interfaces, ensure each control shows focus when active.</p>"
			}
		},
		
		{
			"id": "sc-2.4.8",
			"ref": "location",
			"version": "2.0",
			"level": "aaa",
	        "name":  {
				"en": "Location"
			},
			"guidance": {
				"en": "<p>This success criterion is not applicable to EPUB publications.</p>\
\
<p>To improve the ability of users to find their location, however, the inclusion of static page markers and use of running headers and footers, when possible, are recommended.</p>"
			}
		},
		
		{
			"id": "sc-2.4.9",
			"ref": "link-purpose-link-only",
			"version": "2.0",
			"level": "aaa",
	        "name":  {
				"en": "Link Purpose (Link Only)"
			},
			"guidance": {
				"en": "<p>Verify that purpose of each link can be understood from their text alone.</p>\
\
<p class=\"sc-note\">Note: This success criterion differs from <a href=\"#sc-2.4.4\">2.4.4</a> in that all necessary context must be part of the link text. The reader must not have to read the surrounding text to understand the purpose of the link.</p>"
			}
		},
		
		{
			"id": "sc-2.4.10",
			"ref": "section-headings",
			"version": "2.0",
			"level": "aaa",
	        "name":  {
				"en": "Section Headings"
			},
			"guidance": {
				"en": "<p>Verify that each section of the publication is identified with a heading, and the heading numbers currectly identify the position of the heading in the document outline.</p>"
			}
		},
		
		{
			"id": "sc-2.4.11",
			"ref": "focus-appearance-minimum",
			"version": "2.2",
			"level": "aa",
	        "name":  {
				"en": "Focus Appearance (Minimum)"
			},
			"guidance": {
				"en": ""
			}
		},
		
		{
			"id": "sc-2.4.12",
			"ref": "focus-appearance-enhanced",
			"version": "2.2",
			"level": "aaa",
	        "name":  {
				"en": "Focus Appearance (Enhanced)"
			},
			"guidance": {
				"en": ""
			}
		},
		
		{
			"id": "sc-2.4.13",
			"ref": "page-break-navigation",
			"version": "2.2",
			"level": "aa",
	        "name":  {
				"en": "Page Break Navigation"
			},
			"guidance": {
				"en": ""
			}
		},
		
		{
			"id": "sc-2.5.1",
			"ref": "pointer-gestures",
			"version": "2.1",
			"level": "a",
	        "name":  {
				"en": "Pointer Gestures"
			},
			"guidance": {
				"en": "<p>Check if the publication contains any functionality that depends on multipoint gestures (i.e., \
where the different points along the gesture change the effect, meaning, or value). Some examples include: swiping and \
picking from a carousel of images, pinching to zoom an interactive map, or dragging a slider right or left.</p> \
<p>If yes, each control must include an simple point and click alternative. For example, a slider might have plus \
and minus buttons to control its value, or am interactive map might have a manual zoom control.</p> \
<p>This success criterion does not apply to path-based gestures that control the reading system interface (e.g., pinching to zoom \
the publication or swiping to turn pages). Native HTML controls are also exempt (e.g., audio and video playback and volume \
controls).</p>"
			}
		},
		
		{
			"id": "sc-2.5.2",
			"ref": "pointer-cancellation",
			"version": "2.1",
			"level": "a",
	        "name":  {
				"en": "Pointer Cancellation"
			},
			"guidance": {
				"en": "<p>Check if the publication contains any controls that only require a single tap or click \
event to operate.</p> \
<p>If yes, for each such control at least one of the following must be true:</p> \
<ul>\
<li>No action occurs solely from the down event (i.e., immediately when the control is pressed or clicked down without \
releasing), only on the up event.</li> \
<li>It is possible to cancel the event by moving your finger or mouse away from the item being clicked, or there is a \
way to undo the action after the event is triggered.</li> \
<li>The up event cancels the down event (i.e., the action only occurs so long as a finger is pressing on the screen or a \
mouse button is being held down, then it automatically ends).</li> \
<li>The action is essential on the tap or mouse down event (e.g., application where the user will expect an action as \
soon as the event is initiated, such as expecting a sound from a simulated instrument or seeing a letter appear when \
a key on a simulated keyboard is pressed).</li> \
</ul> \
<p>This success criterion does not apply to click and tap actions that control the reading system interface.</p>"
			}
		},
		
		{
			"id": "sc-2.5.3",
			"ref": "label-in-name",
			"version": "2.1",
			"level": "a",
	        "name":  {
				"en": "Label in Name"
			},
			"guidance": {
				"en": "<p>If the publication has inputs or controls with visible labels (i.e., that sighted users \
can see), the name of the control must be the same as the visible text. (The name of an input or control is defined in \
the <code>label</code> element for it, or, if not specified, in an <code>aria-label</code>, <code>title</code>, or \
<code>aria-labelledby</code> attribute on the element).</p> \
<p class=\"sc-note\">Note: This success criterion does not apply input and controls without visible labels \
(i.e., where the name can only be computed from non-visible text).</p>"
			}
		},
		
		{
			"id": "sc-2.5.4",
			"ref": "motion-actuation",
			"version": "2.1",
			"level": "a",
	        "name":  {
				"en": "Motion Actuation"
			},
			"guidance": {
				"en": "<p>Check if the publication contains any interactive content that is controlled by \
the motion of the device.</p> \
<p>If yes, the user interface must provide another means of controlling the content. It also must be possible \
to disable the motion control.</p>"
			}
		},
		
		{
			"id": "sc-2.5.5",
			"ref": "target-size",
			"version": "2.1",
			"level": "aaa",
	        "name":  {
				"en": "Target Size"
			},
			"guidance": {
				"en": "<p>Clickable objects in the publication must be at least 44 pixels wide by 44 pixels high.</p> \
<p class=\"sc-note\">Note: This requirement does not apply to links in the text, only to objects like buttons, game \
controls, etc.</p>"
			}
		},
		
		{
			"id": "sc-2.5.6",
			"ref": "concurrent-input-mechanisms",
			"version": "2.1",
			"level": "aaa",
	        "name":  {
				"en": "Concurrent Input Mechanisms"
			},
			"guidance": {
				"en": "<p>Ensure that any interactive content is not restricted to a single input mode.</p> \
<p>For example, a button must not only be operable by clicking on it &#8212; keyboard activation should work, too.</p>"
			}
		},
		
		{
			"id": "sc-2.5.7",
			"ref": "dragging-movements",
			"version": "2.2",
			"level": "aa",
	        "name":  {
				"en": "Dragging Movements"
			},
			"guidance": {
				"en": ""
			}
		},
		
		{
			"id": "sc-2.5.8",
			"ref": "target-size-minimum",
			"version": "2.2",
			"level": "aa",
	        "name":  {
				"en": "Target Size (Minimum)"
			},
			"guidance": {
				"en": ""
			}
		},
		
		{
			"id": "sc-3.1.1",
			"ref": "language-of-page",
			"version": "2.0",
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
			}
		},
		
		{
			"id": "sc-3.1.2",
			"ref": "language-of-parts",
			"version": "2.0",
			"level": "aa",
	        "name":  {
				"en": "Language of Parts"
			},
			"guidance": {
				"en": "<p>Verify that all foreign language words and phrases have been identified and that the correct language code has been used in each case.</p>\
\
<p class=\"sc-note\">Note: This success criterion does not apply to foreign words or phrases that have become part of the native language (e.g., \"vis-a-vis\" or \"faux pas\").</p>"
			}
		},
		
		{
			"id": "sc-3.1.3",
			"ref": "unusual-words",
			"version": "2.0",
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
			}
		},
		
		{
			"id": "sc-3.1.4",
			"ref": "abbreviations",
			"version": "2.0",
			"level": "aaa",
	        "name":  {
				"en": "Abbreviations"
			},
			"guidance": {
				"en": "<p>Verify that a mechanism for identifying the expanded form or meaning of all acronyms is provided (e.g., including the expansion with the first use of the acronym or linking to a definition).</p>"
			}
		},
		
		{
			"id": "sc-3.1.5",
			"ref": "reading-level",
			"version": "2.0",
			"level": "aaa",
	        "name":  {
				"en": "Reading Level"
			},
			"guidance": {
				"en": "<p>Verify that the publication can be read and understood by someone with a lower secondary level reading ability (7-9 years of education), or that supplemental content is provided that allows the content to be understood by such a reader.</p>"
			}
		},
		
		{
			"id": "sc-3.1.6",
			"ref": "pronunciation",
			"version": "2.0",
			"level": "aaa",
	        "name":  {
				"en": "Pronunciation"
			},
			"guidance": {
				"en": "<p>Verify that the proper pronunciation is provided for words whose meaning cannot be identified from their surrounding context.</p>"
			}
		},
		
		{
			"id": "sc-3.2.1",
			"ref": "on-focus",
			"version": "2.0",
			"level": "a",
	        "name":  {
				"en": "On Focus"
			},
			"guidance": {
				"en": "<p>Verify that focus changes do not cause a change in context to occur (e.g., a form to submit, a window to open, a change of focused element).</p>\
\
<p class=\"sc-note\">Note: Changes in content are not forbidden so long as a context change doesn't also occur.</p>"
			}
		},
		
		{
			"id": "sc-3.2.2",
			"ref": "on-input",
			"version": "2.0",
			"level": "a",
	        "name":  {
				"en": "On Input"
			},
			"guidance": {
				"en": "<p>Verify that activating or changing a form input does not automatically cause a change of context unless the user is notified what context change(s) will occur before activating.</p>"
			}
		},
		
		{
			"id": "sc-3.2.3",
			"ref": "consistent-navigation",
			"version": "2.0",
			"level": "aa",
	        "name":  {
				"en": "Consistent Navigation"
			},
			"guidance": {
				"en": "<p>Verify that any repeated navigational aids appear in the same relative location within each content document (e.g., lists of objectives or outcomes).</p>"
			}
		},
		
		{
			"id": "sc-3.2.4",
			"ref": "consistent-identification",
			"version": "2.0",
			"level": "aa",
	        "name":  {
				"en": "Consistent Identification"
			},
			"guidance": {
				"en": "<p>Verify that any components/features repeated across documents are consistently identified (e.g., exercises, objectives, etc.).</p>"
			}
		},
		
		{
			"id": "sc-3.2.5",
			"ref": "change-on-request",
			"version": "2.0",
			"level": "aaa",
	        "name":  {
				"en": "Change on Request"
			},
			"guidance": {
				"en": "<p>Verify that the user can control all changes in context.</p>"
			}
		},
		
		{
			"id": "sc-3.2.6",
			"ref": "consistent-help",
			"version": "2.2",
			"level": "a",
	        "name":  {
				"en": "Consistent Help"
			},
			"guidance": {
				"en": ""
			}
		},
		
		{
			"id": "sc-3.2.7",
			"ref": "visible-controls",
			"version": "2.2",
			"level": "aa",
	        "name":  {
				"en": "Visible Controls"
			},
			"guidance": {
				"en": ""
			}
		},
		
		{
			"id": "sc-3.3.1",
			"ref": "error-identification",
			"version": "2.0",
			"level": "a",
	        "name":  {
				"en": "Error Identification"
			},
			"guidance": {
				"en": "<p>Verify that form input errors are identified and described.</p>"
			}
		},
		
		{
			"id": "sc-3.3.2",
			"ref": "labels-or-instructions",
			"version": "2.0",
			"level": "a",
	        "name":  {
				"en": "Labels or Instructions"
			},
			"guidance": {
				"en": "<p>Verify that form inputs are clearly labelled and all required fields are identifiable.</p>"
			}
		},
		
		{
			"id": "sc-3.3.3",
			"ref": "error-suggestion",
			"version": "2.0",
			"level": "aa",
	        "name":  {
				"en": "Error Suggestion"
			},
			"guidance": {
				"en": "<p>Verify that any input error messages identify how to fix the problem, unless a message about how to fix would compromise security or defeat the purpose (e.g., undermine quizzes and tests).</p>"
			}
		},
		
		{
			"id": "sc-3.3.4",
			"ref": "error-prevention-legal-financial-data",
			"version": "2.0",
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
			}
		},
		
		{
			"id": "sc-3.3.5",
			"ref": "help",
			"version": "2.0",
			"level": "aaa",
	        "name":  {
				"en": "Help"
			},
			"guidance": {
				"en": "<p>Verify that context-sensitive help is available.</p>\
\
<p class=\"sc-note\">Note: This success criterion only applies to forms and interactive content where the correct input or action cannot be determined from the label or context. Content documents are not required to provide help links.</p>"
			}
		},
		
		{
			"id": "sc-3.3.6",
			"ref": "error-prevention-all",
			"version": "2.0",
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
			}
		},
		
		{
			"id": "sc-3.3.7",
			"ref": "accessible-authentication",
			"version": "2.2",
			"level": "a",
	        "name":  {
				"en": "Accessible Authentication"
			},
			"guidance": {
				"en": ""
			}
		},
		
		{
			"id": "sc-3.3.8",
			"ref": "redundant-entry",
			"version": "2.2",
			"level": "a",
	        "name":  {
				"en": "Redundant Entry"
			},
			"guidance": {
				"en": ""
			}
		},
	
		{
			"id": "sc-4.1.1",
			"ref": "parsing",
			"version": "2.0",
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
			}
		},
		
		{
			"id": "sc-4.1.2",
			"ref": "name-role-value",
			"version": "2.0",
			"level": "a",
	        "name":  {
				"en": "Name, Role, Value"
			},
			"guidance": {
				"en": "<p>Check that all controls have a name and role, and all states and properties necessary to for user interaction are set and function properly.</p>"
			}
		},
	
		{
			"id": "sc-4.1.3",
			"ref": "status-messages",
			"version": "2.1",
			"level": "aa",
	        "name":  {
				"en": "Status Messages"
			},
			"guidance": {
				"en": "<p>Check if any interactive content emits status messages. For example, invalid input in a form \
might cause a warning message to appear beside the input.</p> \
<p>Any such status messages must be identified using ARIA roles and/or properties so that assistive technologies can \
announce them. Typically this is done by pairing a <a href=\"https://w3c.github.io/aria/#live_region_roles\">live \
region role</a> together with the <code>aria-live</code> attribute to control when the message is read.</p> \
<p class=\"sc-note\">Note: This success criterion does not apply to dialogs and similar alerts that receive \
automatic focus.</p>"
			}
		},
		
		{
			"id": "epub-pagesrc",
			"level": "normative",
			"name": {
				"en": "Page Source"
			},
			"guidance": {
				"en": "<p>If the publication includes pagination, the source is identified in the package document.</p>"
			}
		},
		
		{
			"id": "epub-pagelist",
			"level": "normative",
			"name": {
				"en": "Page List"
			},
			"guidance": {
				"en": "<p>If the publication includes pagination, a means of accessing all the page break locations is included.</p>"
			}
		},
		
		{
			"id": "epub-pagebreaks",
			"level": "normative",
			"name": {
				"en": "Page Breaks"
			},
			"guidance": {
				"en": "<p>If page breaks are included in the text, they are identifiable by the <code>role</code> attribute value <code>doc-pagebreak</code>.</p>"
			}
		},
		
		{
			"id": "epub-mo-readorder",
			"level": "informative",
			"name": {
				"en": "Reading Order"
			},
			"guidance": {
				"en": "<p class=\"note\">Media Overlay practices are currently only informative. Failure to meet the requirements of the specification does not fail publications. This exemption may change in a future version.</p>\
<p>If the publication includes media overlays, playback follows a logical reading sequence through the text.</p>"
			}
		},
		
		{
			"id": "epub-mo-skip",
			"level": "informative",
			"name": {
				"en": "Skippability"
			},
			"guidance": {
				"en": "<p class=\"note\">Media Overlay practices are currently only informative. Failure to meet the requirements of the specification does not fail publications. This exemption may change in a future version.</p>\
<p>If the publication includes media overlays, all skippable structures are identified.</p>"
			}
		},
		
		{
			"id": "epub-mo-esc",
			"level": "informative",
			"name": {
				"en": "Escapability"
			},
			"guidance": {
				"en": "<p class=\"note\">Media Overlay practices are currently only informative. Failure to meet the requirements of the specification does not fail publications. This exemption may change in a future version.</p>\
<p>If the publication includes media overlays, all escapable structures are identified.</p>"
			}
		},
		
		{
			"id": "epub-mo-nav",
			"level": "informative",
			"name": {
				"en": "Navigation Document"
			},
			"guidance": {
				"en": "<p class=\"note\">Media Overlay practices are currently only informative. Failure to meet the requirements of the specification does not fail publications. This exemption may change in a future version.</p>\
<p>If the publication includes media overlays, a Media Overlay Document is included for the EPUB Navigation Document.</p>"
			}
		}
	]
};
