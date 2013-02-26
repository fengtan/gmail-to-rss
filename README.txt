      ______                _ __   __           ____  __________
     / ____/___ ___  ____ _(_) /  / /_____     / __ \/ ___/ ___/
    / / __/ __ `__ \/ __ `/ / /  / __/ __ \   / /_/ /\__ \\__ \ 
   / /_/ / / / / / / /_/ / / /  / /_/ /_/ /  / _, _/___/ /__/ / 
   \____/_/ /_/ /_/\__,_/_/_/   \__/\____/  /_/ |_|/____/____/  


*********************************************************************
* SYNOPSIS
*********************************************************************
This script turns a Gmail inbox into an RSS feed.
It runs as a Google Apps Script: https://script.google.com/.

*********************************************************************
* INSTALLATION
*********************************************************************
1) Create a blank project on https://script.google.com/

2) Copy this script in your new project

3) Run the script by clicking Menu > Run > doGet

4) You will be asked whether you agree to grant this script access
   to your Gmail account. Accept the request.

5) Create a first version by clicking Menu > File > Manage Versions

6) Deploy this script by clicking Menu > Publish > Deploy as web app

7) If your RSS browser supports authentication for private feeds:
   - Select 'Execute the app as : User accessing the web app' 
   - Select 'Who has access to the app : Only me' 
   
   If your RSS browser does not support such authentication:
   - Select 'Execute the app as : me'
   - Select 'Who has access to the app : Anonyone, even anonymous'

   Do *not* select the latter if you plan to run this script on your
   personnal Gmail account. You would expose all your mail to anyone
   on the Internet. You would rather use a test account.

   Note that few RSS readers support authentication for private feeds.
   FeedDemon's pro version supports such authentication. Google Reader
   does not (http://support.google.com/reader/answer/78730).

8) You will be given a Google Apps Script URL. Paste it into your
   RSS reader. You may have to authenticate. The feed will display
   all messages contained in your inbox.

