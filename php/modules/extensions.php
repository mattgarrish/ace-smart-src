
<?php

	class SMART_EXTENSIONS {
	
		public function print_css($ext_module_access) {
			if ($ext_module_access) {
				foreach ($ext_module_access as $module) {
					if ($extension[$module]) {
						echo '<link rel="stylesheet" type="text/css" href="extensions/' . $module . '/css/smart.css"/>';
					}
				}
			}
		}
		
		public function print_tabs($ext_module_access) {
			$ace_extension_tabs = array();
			
			if ($ext_module_access) {
				foreach ($ext_module_access as $module) {
					if ($extension[$module]['tab']) {
						foreach ($extension[$module]['tab'] as $key => $value) {
							echo '<li class="js-tablist__item"><a href="#' . $key . '" id="label_' . $key . '" class="js-tablist__link">' . $value . '</a></li>';
							$ext_js_object = "{id: '" . $key . "', label: '" . str_replace("'", "\\'", $value) . "'}";
							array_push($ace_extension_tabs, $ext_js_object);
						}
					}
				}
			}
			
			return $ace_extension_tabs;
		}
		
		public function add_tab_includes($ext_module_access) {
			if ($ext_module_access) {
				foreach ($ext_module_access as $module) {
					if ($extension[$module]['tab']) {
						foreach ($extension[$module]['tab'] as $key => $value) {
							include 'extensions/' . $module . '/tab/' . $key . '.html';
						}
					}
				}
			}
		}
		
		public function print_scripts($ace_module_access, $ace_extension_tabs) {
			if ($ext_module_access) {
				foreach ($ext_module_access as $module) {
					if ($extension[$module]) {
						echo '<script src="extensions/' . $module . '/js/smart.js"></script>';
					}
				}
				if ($ace_extension_tabs) {
					echo '<script>';
					foreach ($ace_extension_tabs as $tab) {
						echo 'smartReport.addExtensionTab(' . $tab . ');';
					}
					echo '</script>';
				}
			}
		}
	}

?>