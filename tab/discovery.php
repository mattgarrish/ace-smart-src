<?php $DEFAULT_URL = 'http://a11y.garrish.ca'; ?>

<section id="discovery" class="js-tabcontent">
	<h2>Discovery Metadata</h2>
	
	<p>This section allows you to visualize and correct the discovery metadata in the publication. Click on each
		field's heading for more information about how to apply the metadata.</p>
	
	<p>Use the Generate button at the bottom of the page to create a set of metadata tags that can be pasted back into 
		the publication.</p>
	
	<fieldset id="accessibilityFeature">
		<legend><a href="http://www.idpf.org/epub/a11y/techniques/#meta-003" target="_blank">Accessibility Features</a> <img src="<?= $DEFAULT_URL ?>/images/asterisk.png" alt="required"/></legend>
		<label><input type="checkbox" value="alternativeText"/> alternative text</label>
		<label><input type="checkbox" value="annotations"/> annotations</label>
		<label><input type="checkbox" value="audioDescription"/> audio descriptions</label>
		<label><input type="checkbox" value="bookmarks"/> bookmarks</label>
		<label><input type="checkbox" value="braille"/> braille</label>
		<label><input type="checkbox" value="captions"/> captions</label>
		<label><input type="checkbox" value="ChemML"/> ChemML</label>
		<label><input type="checkbox" value="describedMath"/> described math</label>
		<label><input type="checkbox" value="displayTransformability"/> display transformability</label>
		<label><input type="checkbox" value="highContrastAudio"/> high contrast audio</label>
		<label><input type="checkbox" value="highContrastDisplay"/> high contrast display</label>
		<label><input type="checkbox" value="index"/> index</label>
		<label><input type="checkbox" value="largePrint"/> large print</label>
		<label><input type="checkbox" value="latex"/> latex</label>
		<label><input type="checkbox" value="longDescription"/> long descriptions</label>
		<label><input type="checkbox" value="MathML"/> MathML</label>
		<label><input type="checkbox" value="none"/> none</label>
		<label><input type="checkbox" value="printPageNumbers"/> print page numbers</label>
		<label><input type="checkbox" value="readingOrder"/> reading order</label>
		<label><input type="checkbox" value="rubyAnnotations"/> ruby annotations</label>
		<label><input type="checkbox" value="signLanguage"/> sign language</label>
		<label><input type="checkbox" value="structuralNavigation"/> structural navigation</label>
		<label><input type="checkbox" value="synchronizedAudioText"/> synchronized audio text</label>
		<label><input type="checkbox" value="tableOfContents"/> table of contents</label>
		<label><input type="checkbox" value="tactileGraphic"/> tactile graphic</label>
		<label><input type="checkbox" value="tactileObject"/> tactile object</label>
		<label><input type="checkbox" value="timingControl"/> timing control</label>
		<label><input type="checkbox" value="transcript"/> transcript</label>
		<label><input type="checkbox" value="ttsMarkup"/> tts markup</label>
		<label><input type="checkbox" value="unlocked"/> unlocked</label>
		<div id="add-af" class="pad-top"><a href="#add-af" onclick="disc.addCustomFeature(); return false">Add custom field</a></div>
	</fieldset>
	
	<fieldset id="summary-field">
		<legend><label for="summary"><a href="http://www.idpf.org/epub/a11y/techniques/#meta-005" target="_blank">Accessibility Summary</a> <img src="<?= $DEFAULT_URL ?>/images/asterisk.png" alt="required"/></label></legend>
		<textarea id="accessibilitySummary" rows="5" aria-required="true"></textarea>
	</fieldset>
	
	<fieldset id="accessibilityHazard">
		<legend><a href="http://www.idpf.org/epub/a11y/techniques/#meta-004" target="_blank">Accessibility Hazards</a> <img src="<?= $DEFAULT_URL ?>/images/asterisk.png" alt="required"/></legend>
		<label><input type="checkbox" value="flashing"/> flashing</label>
		<label><input type="checkbox" value="motionSimulation"/> motion simulation</label>
		<label><input type="checkbox" value="sound"/> sound</label>
		<label><input type="checkbox" value="none"/> none</label>
		<label><input type="checkbox" value="unknown"/> unknown</label>
	</fieldset>
	
	<fieldset id="accessMode">
		<legend><a href="http://www.idpf.org/epub/a11y/techniques/#meta-001" target="_blank">Access Modes</a> <img src="<?= $DEFAULT_URL ?>/images/asterisk.png" alt="required"/></legend>
		<label><input type="checkbox" id="auditory" value="auditory"/> auditory</label>
		<label><input type="checkbox" id="tactile" value="tactile"/> tactile</label>
		<label><input type="checkbox" id="textual" value="textual"/> textual</label>
		<label><input type="checkbox" id="visual" value="visual"/> visual</label>
	</fieldset>
	
	<fieldset id="accessModeSufficient">
		<legend><a href="http://www.idpf.org/epub/a11y/techniques/#meta-002" target="_blank">Sufficient Access Modes</a></legend>
		<fieldset id="set1">
			<legend>Set 1</legend>
			<label><input type="checkbox" value="auditory"/> auditory</label>
			<label><input type="checkbox" value="tactile"/> tactile</label>
			<label><input type="checkbox" value="textual"/> textual</label>
			<label><input type="checkbox" value="visual"/> visual</label>
		</fieldset>
		<fieldset id="set2">
			<legend>Set 2</legend>
			<label><input type="checkbox" value="auditory"/> auditory</label>
			<label><input type="checkbox" value="tactile"/> tactile</label>
			<label><input type="checkbox" value="textual"/> textual</label>
			<label><input type="checkbox" value="visual"/> visual</label>
		</fieldset>
		<div id="add-ams" class="pad-top"><a href="#add-ams" onclick="disc.addSufficient(); return false">Add another set</a></div>
	</fieldset>
	
	<fieldset id="accessibilityAPI">
		<legend><a href="http://www.idpf.org/epub/a11y/techniques/#meta-006" target="_blank">Accessibility API</a></legend>
		<label><input type="checkbox" value="ARIA"/> ARIA</label>
	</fieldset>
	
	<fieldset id="accessibilityControl">
		<legend><a href="http://www.idpf.org/epub/a11y/techniques/#meta-007" target="_blank">Accessibility Control</a></legend>
		<label><input type="checkbox" value="fullKeyboardControl"/> keyboard</label>
		<label><input type="checkbox" value="fullMouseControl"/> mouse</label>
		<label><input type="checkbox" value="fullSwitchControl"/> switch</label>
		<label><input type="checkbox" value="fullTouchControl"/> touch</label>
		<label><input type="checkbox" value="fullVideoControl"/> video</label>
		<label><input type="checkbox" value="fullVoiceControl"/> voice</label>
	</fieldset>
	
	<div class="buttons">
		<input id="gen" type="button" value="Generate" onclick="disc.validate(false)"/>
	</div>
	
	<p>After generating, copy and paste the output in the following field to the package document metadata.</p>
	
	<textarea id="metadata" rows="15" aria-label="discovery metadata"></textarea>
	
	<div class="pad-top"><a href="#conformance" class="js-link-to-tab">Continue to Conformance Metadata</a></div>
</section>

<script src="<?= $DEFAULT_URL ?>/js/discovery.js"></script>
<script src="<?= $DEFAULT_URL ?>/js/error.js"></script>
<script src="<?= $DEFAULT_URL ?>/js/format.js"></script>
