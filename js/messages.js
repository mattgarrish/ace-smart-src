
var smart_messages = new Object();
	smart_messages.en = new Object();
	smart_messages.en.unknown = 'An unknown error occurred. Please report this problem if it persists.';

var smart_errors = new Object();
	smart_errors.en = new Object();
	smart_errors.en.nojson = 'Uploaded file did not contain JSON data or the data could not be read. Please try again.';
	smart_errors.en.unknownload = 'Uploaded file does not appear to be an Ace report. Please try again.';
	smart_errors.en.unknownreload = 'Uploaded file does not appear to be a previously saved report. Please try again.';
	smart_errors.en.uidselect = 'An error occurred retrieving the unique identifier. Please try again.';
	smart_errors.en.uidbind = 'An error occurred checking the unique identifier. Please try again.';
	smart_errors.en.uidexec = 'An error occurred verifying the unique identifier. Please try again.';
	smart_errors.en.notunique = 'An evaluation has already been started with the same identifier. Each publication must have a unique identifier in its dc:identifier element. Please resume the existing report or correct the identifier and try again.';
	smart_errors.en.evalins = 'Failed to add evaluation. Please try again.';
	smart_errors.en.evalbind = 'Invalid data adding evaluation. Please try again.';
	smart_errors.en.evalexec = 'Failed to register evaluation. Please try again.';
	smart_errors.en.reportins = 'Failed to store temporary data. Please try again.';
	smart_errors.en.reportbind = 'Failed while storing temporary data. Please try again.';
	smart_errors.en.reportexec = 'Failed inserting temporary data. Please try again.';
	smart_errors.en.resselect = 'An error occurred accessing the saved evaluation data. Please try again.';
	smart_errors.en.resbind = 'An error occurred preparing the saved evaluation data. Please try again.';
	smart_errors.en.resexec = 'An error occurred retrieving the saved evaluation data. Please try again.';
	smart_errors.en.noaction = 'The SMART interface cannot be loaded without an Ace report or saved evaluation. Please try again.';
	smart_errors.en.noeval = 'No data is available for the specified evaluation. Please try again.';
	smart_errors.en.delfail = 'Failed to delete evaluation. Please try again.';
	smart_errors.en.recfail = 'Failed to delete evaluation. Please return to the previous page and try again.';
	smart_errors.en.noconfirm = 'Failed to confirm report. Please try again.';
	smart_errors.en.confconn = 'Database is currently unavailable. Please try again.';
	smart_errors.en.confprep = 'An error occurred confirming the evaluation. Please try again.';
	smart_errors.en.confbind = 'An error occurred while preparing to confirm the evaluation. Please try again.';
	smart_errors.en.confexec = 'An error occurred retrieving confirmation information. Please try again.';
	
