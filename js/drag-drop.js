
// adapted from https://css-tricks.com/examples/DragAndDropFileUploading/

'use strict';

	;( function ( document, window, index )
	{
		var isAdvancedUpload = function()
			{
				var div = document.createElement( 'div' );
				return ( ( 'draggable' in div ) || ( 'ondragstart' in div && 'ondrop' in div ) ) && 'FormData' in window && 'FileReader' in window;
			}();


		var forms = document.querySelectorAll( '.box' );
		
		Array.prototype.forEach.call( forms, function( form )
		{
			var input		 = form.querySelector( 'input[type="file"]' ),
				label		 = form.querySelector( 'label.dnd' ),
				errorMsg	 = form.querySelector( '.box__error span' ),
				restart		 = form.querySelectorAll( '.box__restart' ),
				droppedFiles = false,
				showFiles	 = function( files )
				{
					label.textContent = files.length > 1 ? ( input.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', files.length ) : files[ 0 ].name;
				},
				triggerFormSubmit = function()
				{
					var event = document.createEvent( 'HTMLEvents' );
					event.initEvent( 'submit', true, false );
					form.dispatchEvent( event );
				};

			var ajaxFlag = document.createElement( 'input' );
				ajaxFlag.setAttribute( 'type', 'hidden' );
				ajaxFlag.setAttribute( 'name', 'ajax' );
				ajaxFlag.setAttribute( 'value', 1 );
			
			form.appendChild( ajaxFlag );

			// automatically submit the form on file select
			input.addEventListener( 'change', function( e )
			{
				showFiles( e.target.files );
				triggerFormSubmit();
			});

			// drag&drop files if the feature is available
			if( isAdvancedUpload )
			{
				form.classList.add( 'has-advanced-upload' ); // letting the CSS part to know drag&drop is supported by the browser

				[ 'drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop' ].forEach( function( event )
				{
					form.addEventListener( event, function( e )
					{
						// preventing the unwanted behaviours
						e.preventDefault();
						e.stopPropagation();
					});
				});
				[ 'dragover', 'dragenter' ].forEach( function( event )
				{
					form.addEventListener( event, function()
					{
						form.classList.add( 'is-dragover' );
					});
				});
				[ 'dragleave', 'dragend', 'drop' ].forEach( function( event )
				{
					form.addEventListener( event, function()
					{
						form.classList.remove( 'is-dragover' );
					});
				});
				form.addEventListener( 'drop', function( e )
				{
					droppedFiles = e.dataTransfer.files; // the files that were dropped
					showFiles( droppedFiles );
					
					triggerFormSubmit();
				});
			}


			// if the form was submitted
			form.addEventListener( 'submit', function( e )
			{
				// preventing the duplicate submissions if the current one is in progress
				if( form.classList.contains( 'is-uploading' ) ) return false;

				form.classList.add( 'is-uploading' );
				form.classList.remove( 'is-error' );

				if( isAdvancedUpload ) // ajax file upload for modern browsers
				{
					e.preventDefault();

					// gathering the form data
					var ajaxData = new FormData( form );
					
					if( droppedFiles )
					{
						Array.prototype.forEach.call( droppedFiles, function( file )
						{
							ajaxData.append( input.getAttribute( 'name' ), file );
						});
					}

					// ajax request
					var ajax = new XMLHttpRequest();
						ajax.open( form.getAttribute( 'method' ), form.getAttribute( 'action' ), true );

					ajax.onload = function()
					{
						form.classList.remove( 'is-uploading' );
						if( ajax.status >= 200 && ajax.status < 400 )
						{
							try {
								var data = ajax.responseText;
								
								loadAceReportJSON(data);
								
								form.classList.add('is-success');
							}
							catch (e) {
								errorMsg.textContent = e;
								errorMsg.appendChild(document.createElement('br'));
								form.classList.add('is-error');
							}
						}
						else alert( 'Upload failed. Please, contact the webmaster.' );
					};

					ajax.onerror = function()
					{
						form.classList.remove( 'is-uploading' );
						console.log('Error: ' + ajax.status);
						console.log(ajax);
						console.log(ajaxData);
						alert( 'Error. Please, try again.' );
					};

					ajax.send( ajaxData );
				}
				else // fallback Ajax solution upload for older browsers
				{
					var iframeName	= 'uploadiframe' + new Date().getTime(),
						iframe		= document.createElement( 'iframe' );

						$iframe		= $( '<iframe name="' + iframeName + '" style="display: none;"></iframe>' );

					iframe.setAttribute( 'name', iframeName );
					iframe.style.display = 'none';

					document.body.appendChild( iframe );
					form.setAttribute( 'target', iframeName );

					iframe.addEventListener( 'load', function()
					{
						try {
							var data = iframe.contentDocument.body.innerHTML;
							form.classList.remove( 'is-uploading' );
							iframe.parentNode.removeChild( iframe );
							
							loadAceReportJSON(data);
							
							form.classList.add('is-success');
							form.removeAttribute( 'target' );
						}
						catch (e) {
							errorMsg.textContent = e;
							errorMsg.appendChild(document.createElement('br'));
							form.classList.remove( 'is-uploading' );
							form.classList.add('is-error');
							form.removeAttribute( 'target' );
						}
					});
				}
			});


			// restart the form if has a state of error/success
			Array.prototype.forEach.call( restart, function( entry )
			{
				entry.addEventListener( 'click', function( e )
				{
					e.preventDefault();
					form.classList.remove( 'is-error', 'is-success' );
					input.click();
				});
			});

			// Firefox focus bug fix for file input
			input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
			input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });

		});
		
	}( document, window, 0 ));


function loadAceReportJSON(data) {
	
	var input = data.match(/(<input id="json".*?>)/i);
	
	if (input !== null) {
		var html = document.createElement('div');
			html.innerHTML = input[0];
		data = html.querySelector('input#json').value;
	}
	
	data = JSON.parse(data);
		
	if (data.hasOwnProperty('aceFlag') && data.aceFlag == 'savedReport') {
		manage.loadConformanceReport(JSON.stringify(data));
	}
	
	else {
		var ace = new Ace();
			ace.storeJSON(data);
			ace.loadReport();
	}
}
