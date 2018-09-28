
var smart_messages = new Object();
	smart_messages.en = new Object();
	smart_messages.en.unknown = 'An unknown error occurred. Please report this problem if it persists.';

var smart_errors = new Object();
	smart_errors.en = new Object();
	smart_errors.en.nojson = 'Uploaded file did not contain JSON data or the data could not be read. Please try again.';
	smart_errors.en.unknownload = 'Uploaded file does not appear to be an Ace report. Please try again.';
	smart_errors.en.unknownreload = 'Uploaded file does not appear to be a previously saved report. Please try again.';
	smart_errors.en.resbind = 'An error occurred preparing the saved evaluation data. Please try again.';
	smart_errors.en.resexec = 'An error occurred retrieving the saved evaluation data. Please try again.';
	smart_errors.en.noaction = 'The SMART interface cannot be loaded without an Ace report or saved evaluation. Please try again.';
	smart_errors.en.noeval = 'No data is available for the specified evaluation. Please try again.';