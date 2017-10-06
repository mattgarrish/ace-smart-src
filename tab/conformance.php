<?php $DEFAULT_URL = 'http://a11y.garrish.ca'; ?>

<section id="conformance" class="js-tabcontent">
	<h2>Conformance Metadata</h2>
	
	<p>This section is for reporting conformance and providing more information about the certifier creating this report.</p>
	
	<p>Use the Generate button at the bottom of the page to create a set metadata tags that can be pasted back into the publication.</p>
	
	<fieldset id="conf-result">
		<legend>Conformance Result:</legend>
		<label><input type="radio" name="conf-result" value="a"/> Passed - EPUB + WCAG Level A</label><br/>
		<label><input type="radio" name="conf-result" value="aa" checked="checked"/> Passed - EPUB + WCAG Level AA</label><br/>
		<label><input type="radio" name="conf-result" value="fail"/> Failed</label>
	</fieldset>
	
	<fieldset>
		<legend>Evaluated By:</legend>
		<label class="data"><span>Name:<img src="<?= $DEFAULT_URL ?>/images/asterisk.png" alt="required"/></span> <input type="text" id="certifier" aria-required="true"/></label>
		<label class="data"><span>Link to report:</span> <input type="text" id="reportLink"/></label>
	</fieldset>
	
	<fieldset class="credential" aria-describedby="daisy-cred">
		<legend>Credential:</legend>
		<label class="data"><span>Name:</span> <input type="text" id="credentialName"/></label>
		<label class="data"><span>Link:</span> <input type="text" id="credentialLink"/></label>
		<div id="daisy-cred" class="note">Note: A DAISY credential is automatically included. This field is provided for an additional credential.</div>
	</fieldset>
	
	<!-- <div id="add-cred" class="pad-top"><a href="#add-cred" onclick="conf_meta.addCredential(); return false">Add credential</a></div> -->
	
	<div class="buttons">
		<input type="button" value="Generate" onclick="conf_meta.generateConformanceMeta()"/>
	</div>
	
	<p>After generating, copy and paste the output in the following field to the package document metadata.</p>
	<textarea id="conf-meta" rows="6" aria-label="conformance metadata"></textarea>
	
	<div class="pad-top"><a href="#generate" class="js-link-to-tab">Continue to Generate Report</a></div>
</section>

<script src="<?= $DEFAULT_URL ?>/js/conformance-meta.js"></script>
<script src="<?= $DEFAULT_URL ?>/js/error.js"></script>
<script src="<?= $DEFAULT_URL ?>/js/format.js"></script>
<script src="<?= $DEFAULT_URL ?>/js/conformance-tests.js"></script>
