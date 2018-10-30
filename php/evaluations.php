
<?php require_once 'db.php' ?>

<?php
	
	class SMART_EVALUATION {
	
		private $username = '';
		private $company = '';
		private $shared = false;
		private $license = '';
		private $action = '';
		private $title = '';
		private $eval_id = 0;
		private $eval_max = 0;
		private $eval_remaining = 0;
		private $db = '';
		private $to_save = false;
		
		function __construct($arg) {
			
			$this->username = $arg['username'];
			$this->company = isset($arg['company']) ? $arg['company'] : '';
			$this->shared = isset($arg['shared']) && $arg['shared'] == 1 ? true : false;
			$this->license = isset($arg['license']) ? $arg['license'] : '';
			
			$this->action = isset($arg['action']) ? $arg['action'] : '';
			$this->title = isset($arg['title']) ? $arg['title'] : '';
			$this->eval_id = isset($arg['id']) ? $arg['id'] : 0;
			
			$this->db = new SMART_DB();
			$this->db->connect();
		}
		
		public function check_license() {
		
			if (!$this->license) {
				die();
			}
			
			$is_licensed = false;
			
			if ($this->license == 'unlimited') {
				$is_licensed = true;
			}
			
			else {
		    	$this->eval_max = str_replace('max','',$this->license);
				
				if (is_numeric($this->eval_max) && $this->eval_max > 0) {
					$is_licensed = true;
				}
			}
			
			if (!$is_licensed) {
				die();
			}
		}
		
		private function check_remaining_evaluations() {
		
			$this_month = gmdate('Y-m-01') . ' 00:00:00';
			
			$sql = 'SELECT COUNT(title) AS eval_count FROM evaluations ';
			
			$arg = '';
			
			if ($this->company) {
				$arg = $this->company;
				$sql .= 'WHERE company = ?';
			}
			
			else {
				$arg = $this->username;
				$sql .= 'WHERE username = ? AND company = ""';
			}
			
			$sql .= ' AND created >= ?';
			
			if ($this->db->prepare($sql)) {
				
				$this->db->bind_param('ss', array($arg, $this_month));
			    
			    $this->db->execute();
				
				$result = $this->db->get_result();
				
			    $this->eval_remaining = $this->eval_max - $result['eval_count'];
			    
			    $this->db->close();
			}
		}
	
		
		public function add_evaluation_form() {
		
			if ($this->license != 'unlimited') {
				$this->check_remaining_evaluations();
			}
			
			if ($this->license != 'unlimited' && $this->eval_remaining == 0) {
				echo '<p class="overlimit">You have reached your evaluation limit for this month.</p>';
			}
			
			else {
			
				if ($this->license != 'unlimited') {
					echo '<p class="license">Note: Your license allows ' . $this->eval_remaining . ' more evaluation(s) this month.</p>';
				}
				
				echo <<<HTML
					<div class="container js">
					<form method="post" action="smart.php" enctype="multipart/form-data" novalidate="novalidate" class="box" id="nextStep">
						<div class="box__input">
							<input type="file" name="ace-report" id="file" class="box__file"/>
							<label class="dnd" for="file">
								<strong>Select an Ace report</strong>
								<span class="box__dragndrop"> or drag one here</span>.<br/>
							</label>
							<button type="submit" class="box__button">Load</button>
						</div>
						
						<div class="box__uploading">Uploading&#8230;</div>
						<div class="box__success">Done! <a href="" class="box__restart" role="button">Load a different report?</a></div>
						<div class="box__error">Error! <span></span>. <a href="" class="box__restart" role="button">Try again!</a></div>
						<input type="hidden" name="id" id="id" value=""/>
						<input type="hidden" name="action" id="action" value="load"/>
						<input type="hidden" name="title" id="title" value=""/>
					</form>
					<p class="new-eval">Or <a id="new_eval" href="#new_eval">start a blank evaluation</a></p>
				</div>
HTML;
			}
		}
		
		
		public function list_evaluations() {
		
			if ($this->shared) {
				echo <<<HTML
	<tr>
		<td>Reload a previous report</td>
		<td>-</td>
		<td>-</td>
		<td>-</td>
		<td><input type="image" src="images/resume.svg" height="40" id="reload_0" alt="Resume" title="Resume"/>
	</tr>
HTML;
				return;
			}
			
			if ($this->db->prepare("SELECT id, title, created, modified, status FROM evaluations WHERE username = ? AND company = ? ORDER BY created DESC")) {
			
				if ($this->db->bind_param("ss", array($this->username, $this->company))) {
				
			    	if ($this->db->execute()) {
			    	
						$result = $this->db->get_results();
						
						foreach ($result as $row) {
							echo '<tr>';
							echo '<td>' . $row['title'] . '</td>';
							echo '<td>' . $row['created'] . '</td>';
							echo '<td>' .  $row['modified'] . '</td>';
							
							echo '<td>';
							
							switch ($row['status']) { 
								case 'remote':
									echo 'Saved';
									break;
								case 'local':
									echo 'Saved locally';
									break;
								case 'deleted':
									echo 'Deleted';
									break;
								case 'unsaved':
									echo 'Not saved';
									break;
							}
							
							echo '</td><td class="option">';
							
							switch ($row['status']) {
								case 'local':
								case 'deleted':
									echo '<input type="image" src="images/resume.svg" height="40" id="reload_' . $row['id'] . '" alt="Resume" title="Resume"/>';
									break;
								
								case 'unsaved':
									break;
								
								default:
									echo '<input type="image" src="images/resume.svg" height="40" id="resume_' . $row['id'] . '" alt="Resume" title="Resume"/>';
									echo '<input type="image" src="images/delete.svg" height="40" id="delete_' . $row['id'] . '" alt="Delete" title="Delete"/>';
							
							}
							
							echo '</td>';
							echo '</tr>';
						}
						
					    $this->db->close();
			    	}
				}
			}
		}
		
		public function load_evaluation() {
				
			$evaluation = '';
			
			$now = gmdate("Y-m-d H:i:s");
			$modified = '0000-00-00 00:00:00';
			$status = 'unsaved';
			
			if ($this->action == 'new') {
			
				if (!$this->title) {
					$this->abort('notitle');
				}
				
				$this->id = $this->generate_uuid();
				
				$evaluation = '{ "category": "newEvaluation", "title": ' . json_encode($this->title) . ' }';
				
				$this->to_save = true;
				
				if (!$this->db->prepare("INSERT INTO evaluations (username, company, uid, title, created, modified, status, evaluation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")) {
					$this->abort('newins');
				}
				
				if (!$this->db->bind_param("ssssssss", array($this->username, $this->company, $this->id, $this->title, $now, $modified, $status, $evaluation))) {
					$this->abort('newbind');
				}
				
				if (!$this->db->execute()) {
					$this->abort('newexec');
				}
				
				$this->eval_id = $this->db->insert_id();
			}
			
			else if ( 
					  ($this->action == 'load')
					  || ($this->action == 'reload' && $this->eval_id)
					  || ($this->action == 'reload' && $this->shared)
					 ) {
				
				if ($_FILES['ace-report']['error'] == UPLOAD_ERR_OK && is_uploaded_file($_FILES['ace-report']['tmp_name'])) {
					$evaluation = file_get_contents($_FILES['ace-report']['tmp_name']); 
				}
				
				$json = json_decode($evaluation);
				
				if (!$json) {
					$this->abort('nojson');
				}
				
				if ($this->action == 'load' && (!$json->{'earl:assertedBy'}->{'doap:name'} || $json->{'earl:assertedBy'}->{'doap:name'} != 'DAISY Ace')) {
					$this->abort('unknownload');
				}
				
				if ($this->action == 'reload' && (!$json->{'category'} || $json->{'category'} != 'savedEvaluation')) {
					$this->abort('unknownreload');
				}
				
				if ($this->action == 'load') {
				
					$this->to_save = true;
					
					if (!$this->db->prepare("SELECT uid FROM evaluations WHERE username = ? AND uid = ?")) {
						$this->abort('uidselect');
					}
					
					$this->id = is_array($json->{'earl:testSubject'}->{'metadata'}->{'dc:identifier'}) ? $json->{'earl:testSubject'}->{'metadata'}->{'dc:identifier'}[0] : $json->{'earl:testSubject'}->{'metadata'}->{'dc:identifier'};
					
					if (!$this->db->bind_param("ss", array($this->username, $this->id))) {
						$this->abort('uidbind');
					}
					
					if (!$this->db->execute()) {
						$this->abort('uidexec');
					}
					
					$result = $this->db->get_result();
					
					$this->db->close();
					
					if (!$this->db->prepare("INSERT INTO evaluations (username, company, uid, title, created, modified, status) VALUES (?, ?, ?, ?, ?, ?, ?)")) {
						$this->abort('evalins');
					}
					
					$title = is_array($json->{'earl:testSubject'}->{'metadata'}->{'dc:title'}) ? $json->{'earl:testSubject'}->{'metadata'}->{'dc:title'}[0] : $json->{'earl:testSubject'}->{'metadata'}->{'dc:title'};
					
					if (!$this->db->bind_param("sssssss", array($this->username, $this->company, $this->id, $title, $now, $modified, $status))) {
						$this->abort('evalbind');
					}
					
					if (!$this->db->execute()) {
						$this->abort('evalexec');
					}
					
					$this->eval_id = $this->db->insert_id();
					
					if ($result['uid']) {
					
						if (!$this->db->prepare("UPDATE evaluations SET evaluation = ? WHERE username = ? AND id = ?")) {
							$this->abort('reportins');
						}
						
						if (!$this->db->bind_param("ssi", array($evaluation, $this->username, $this->eval_id))) {
							$this->abort('reportbind');
						}
						
						if (!$this->db->execute()) {
							$this->abort('reportexec');
						}
						
						header("Location: confirm.php?id=" . $this->eval_id . "&uid=" . $this->id);
						die();
					}
				}
			}
			
			else if (($this->action == 'resume' && $this->eval_id) || $this->action == 'okload') {
				
				if (!$this->db->prepare("SELECT evaluation FROM evaluations WHERE username = ? AND id = ?")) {
					$this->abort('resselect');
				}
				
				if (!$this->db->bind_param("si", array($this->username, $this->eval_id))) {
					$this->abort('resbind');
				}
				
				if (!$this->db->execute()) {
					$this->abort('resexec');
				}
				
				$result = $this->db->get_result();
				
				$evaluation = $result['evaluation'];
				
				$this->db->close();
				
				if ($this->action == 'okload') {
					$this->to_save = true;
				}
			
			}
			
			else {
				$this->abort('noaction');
			}
			
			if ($evaluation == '') {
				$this->abort('noeval');
			}
			
			echo $evaluation;
		}
		
		
		public function need_to_save() {
			return $this->to_save ? 'true' : 'false'; 
		}
		
		
		public function get_eval_id() {
			return $this->eval_id;
		}
		
		private function abort($code) {
			header("Location: index.php?err=" . $code);
			die();
		}
		
		public function delete_evaluation() {
			
			$del_date = '0000-00-00 00:00:00';
			$del_data = '';
			$del_status = 'deleted';
			
			if (!$this->db->prepare("UPDATE evaluations SET status = ?, evaluation = ?, modified = ? WHERE username = ? AND id = ?")) {
				return false;
			}
			
			if (!$this->db->bind_param("ssssi", array($del_status, $del_data, $del_date, $this->username, $this->eval_id))) {
				return false;
			}
			
			if (!$this->db->execute()) {
				return false;
			}
			
			$this->db->close();
			
			return true;
		}
		
		public function delete_record() {
			
			if (!$this->db->prepare("DELETE FROM evaluations WHERE username = ? AND id = ? LIMIT 1")) {
				return false;
			}
			
			if (!$this->db->bind_param("si", array($this->username, $this->eval_id))) {
				return false;
			}
			
			if (!$this->db->execute()) {
				return false;
			}
			
			$this->db->close();
			
			return true;
		}
		
		private function generate_uuid() {
			return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
				// 32 bits for "time_low"
				mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),
				
				// 16 bits for "time_mid"
				mt_rand( 0, 0xffff ),
				
				// 16 bits for "time_hi_and_version",
				// four most significant bits holds version number 4
				mt_rand( 0, 0x0fff ) | 0x4000,
				
				// 16 bits, 8 bits for "clk_seq_hi_res",
				// 8 bits for "clk_seq_low",
				// two most significant bits holds zero and one for variant DCE1.1
				mt_rand( 0, 0x3fff ) | 0x8000,
				
				// 48 bits for "node"
				mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
			);
		}
	}
?>
