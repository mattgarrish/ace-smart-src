
<?php include 'db.php' ?>

<?php
	
	class SMART_EVALUATION {
	
		private $username = '';
		private $company = '';
		private $license = '';
		private $is_licensed = false;
		private $report_max = 0;
		private $reports_remaining = 0;
		private $db = '';
		
		function __construct($arg) {
			$this->username = $arg['username'];
			$this->company = $arg['company'];
			$this->license = $arg['license'];
			$this->db = new SMART_DB();
			$this->db->connect();
		}
		
		public function check_valid() {
		
		    if ($this->license != 'unlimited') {
		    	$this->report_max = str_replace('max','',$this->license);
		    }
			
			if (!$this->license) {
				// boot the user out
				die();
			}
			
			if ($this->license == 'unlimited') {
				$this->is_licensed = true;
			}
			
			else {
				$this_month = date('Y-m-01') . ' 00:00:00';
				
				$sql = 'SELECT COUNT(title) AS report_count FROM reports ';
				
				$arg = '';
				
				if ($this->company) {
					$arg = $this->company;
					$sql .= 'WHERE company = ?';
				}
				
				else {
					$arg = $this->username;
					$sql .= 'WHERE username = ?';
				}
				
				$sql .= ' AND created >= ?';
				
				if ($this->db->prepare($sql)) {
					
					$this->db->bind_param('ss', array($arg, $this_month));
				    
				    $this->db->execute();
					
					$result = $this->db->get_result();
					
				    $this->reports_remaining = $this->report_max - $result['report_count'];
				    
				    $this->db->close();
				}
				
				if ($this->report_max > 0) {
					$this->is_licensed = true;
				}
			}
		}
	
		
		public function add_evaluation() {
		
			if ($this->is_licensed && ($this->license == 'unlimited' || $this->reports_remaining > 0)) {
			
				if ($this->license != 'unlimited') {
					echo '<p class="license">Note: Your license allows ' . $this->reports_remaining . ' more evaluations this month.</p>';
				}
				
				echo <<<HTML
					<div class="container js">
					<form method="post" action="smart.php" enctype="multipart/form-data" novalidate="novalidate" class="box" id="nextStep">
						<div class="box__input">
							<input type="file" name="ace-report" id="file" class="box__file"/>
							<label class="dnd" for="file"><strong>Select an Ace report</strong><span class="box__dragndrop"> or drag one here</span>.</label>
							<button type="submit" class="box__button">Load</button>
						</div>
						
						<div class="box__uploading">Uploading&#8230;</div>
						<div class="box__success">Done! <a href="" class="box__restart" role="button">Load a different report?</a></div>
						<div class="box__error">Error! <span></span>. <a href="" class="box__restart" role="button">Try again!</a></div>
						<input type="hidden" name="id" id="id" value=""/>
						<input type="hidden" name="action" id="action" value="load"/>
					</form>
				</div>
HTML;
			}
			
			else {
				echo '<p class="overlimit">You have reached your report limit for this month.</p>';
			}
		}
		
		
		public function list_evaluations() {
		
			if ($this->db->prepare("SELECT id, title, created, modified, status FROM reports WHERE username = ? ORDER BY created DESC")) {
			
				if ($this->db->bind_param("s", array($this->username))) {
				
			    	if ($this->db->execute()) {
			    	
						$result = $this->db->get_results();
						
						foreach ($result as $row) {
							echo '<tr>';
							echo '<td>' . $row['title'] . '</td>';
							echo '<td>' . $row['created'] . '</td>';
							
							echo '<td>';
							
							if ($row['modified'] != '0000-00-00 00:00:00') {
								echo $row['modified'];
							}
							else {
								switch ($row['status']) { 
									case 'unsaved':
										echo 'Not saved';
										break;
									case 'local':
										echo 'Saved locally';
										break;
									case 'deleted':
										echo 'Deleted';
										break;
								}
							}
							
							echo '</td><td>';
							
							switch ($row['status']) {
								case 'local':
								case 'deleted':
									echo '<input type="image" src="images/resume.svg" height="40" id="reload_' . $row['id'] . '" alt="Resume" title="Resume"/>';
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
	}
?>
