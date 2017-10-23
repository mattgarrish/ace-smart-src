# DAISY EPUB Accessibility Conformance and Reporting Tool

## User Admin

This site uses [UserSpice 4.2](https://userspice.com) for user admin and page security. A copy of the zipped source is stored in the /dependencies directory.

Upload the source to the root directory and configure before uploading the source files for the reporting tool. To install, open the /install/index.php file in a browser and add the necessary MySQL configuration info.

After installation, only the /users directory and /z_us_root.php files should remain in the root directory. Any other files can be deleted.

Modifications to the interface specific to this tool are stored in the /usersc branch of this repository. If additional changes are needed, make them here so that the source can be updated without overriding.

NOTE: There is a bug in 4.2 redirecting users to the root index.php file. The redirect option in the usersc/scripts/custom_login_script.php file is ignored, so the following path on line 24 in users/index.php:

```
Redirect::to($us_url_root.'users/account.php');
```

has to be modified to 'index.php'.