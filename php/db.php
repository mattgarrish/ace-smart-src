
/*
 * =========   WARNING  ==========
 * 
 * DO NOT MOVE THIS FILE TO PRODUCTION WITHOUT CHANGING THE
 * CONNECTION DATABASE FROM smart_dev_users to smart_users
 *
 */

<?php 

	class SMART_DB {
	
		private $mysqli = NULL;
		private $stmt = NULL;
		
		public function connect() {
			if ($this->mysqli && $this->mysqli->ping()) { return true; }
			return ($this->mysqli = new mysqli("localhost", "smart", "D1@2i3s4y5SMART", "smart_dev_users")) ? true : false;
		}
		
		public function prepare($sql) {
			if (!$this->mysqli || !$this->mysqli->ping()) { return false; }
			if ($this->stmt) { $this->stmt->close(); }
			return ($this->stmt = $this->mysqli->prepare($sql)) ? true : false;
		}
		
		public function bind_param($types, $params) {
			if (!$this->stmt) { return false; }
			array_unshift($params, $types);
			$args = array();
			foreach ($params as $key => $value) $args[$key] = &$params[$key];
			return (call_user_func_array(array($this->stmt, 'bind_param'), $args)) ? true : false;
		}
		
		public function execute() {
			if (!$this->stmt) { return false; }
			return ($this->stmt->execute()) ? true : false;
		}
		
		public function get_result() {
			if (!$this->stmt) { return ''; }
			$result = $this->stmt->get_result();
			return $result->fetch_assoc();
		}
		
		public function get_results() {
			if (!$this->stmt) { return array(); }
			$result = $this->stmt->get_result();
			$rows = array();
			while($row = $result->fetch_assoc()) {
				$rows[] = $row;
			}
			return $rows;
		}
		
		public function close() {
			if (!$this->stmt) { return; }
			$this->stmt->close();
			$this->stmt = NULL;
		}
		
		public function insert_id() {
			if (!$this->mysqli) { return ''; }
			return $this->mysqli->insert_id;
		}
		
		function __destruct() {
			if ($this->mysqli) {
				$this->mysqli->close();
			}
		}
	}

?>