# Ace SMART Source Code Repository

This private repository hosts the source code for the Ace SMART tool. Do not share access to this repository outside DAISY Consortium staff and select members.

The public repository is at https://www.github.com/DAISY/ace-smart. All public feedback is collected at this repository. When addressing issues, make a shadow copy into this repository so that issues can be tracked and closed with the appropriate source code changes.

To access the public web site, go to [smart.daisy.org](http://smart.daisy.org)

## Site Access

The public web site is hosted on an AWS server. An SSH connection is needed to ftp files and make changes to the database. Contact the DAISY web admin for the private key necessary to connect.

## User Admin

This site uses [UserSpice 4.3](https://userspice.com) for user admin and page security. A copy of the zipped source is stored in the /dependencies directory.

Upload the UserSpice source to the public site's root directory and configure the application before uploading the source files for the reporting tool from this repository. To install, open the /install/index.php file in a browser and add the necessary configuration info.

Before installing, make sure to configure MySQL. The first step is to create a database called ```smart_users```. Next create a user named ```daisysmart``` and grant it full access to the ```smart_users``` database. No specific password is required; just don't forget it between creating the user and configuring the web site! If you cannot access the MySQL instance on the public server, contact the DAISY web admin for the information.

Access to the DAISY SMTP mail service also needs to be configured in order to send out alerts when new user accounts are created, and to allow users to reset their passwords. Use the account smart@daisy.org for sending mail. Contact the DAISY web admin for SMTP access details.

After installation, only the /users directory and /z_us_root.php files should remain in the root directory. Any other files can be deleted.

Modifications to the interface specific to this tool are stored in the /usersc branch of this repository. If additional changes are needed, make them here so that the source can be updated without overriding.

NOTE: There is a bug redirecting users to the root index.php file. The redirect option in the usersc/scripts/custom_login_script.php file is ignored, so the following path on line 24 in users/index.php:

```
Redirect::to($us_url_root.'users/account.php');
```

has to be modified to 'index.php'.
