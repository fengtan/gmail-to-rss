/*
 * MIT License: www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2013 Fengtan<https://github.com/Fengtan/>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * Processes the HTTP request and returns the RSS feed
 *
 * @see Google Apps Script API "Serving Content"
 *   https://developers.google.com/apps-script/content_service
 */
function doGet() {
  var rssItems = formatGmailThreads(GmailApp.getInboxThreads());
  var rssChannel = formatRssChannel(
    'Gmail (' + Session.getUser().getEmail() + ')',
    'https://mail.google.com/',
    'Gmail to RSS | Turn a Gmail inbox into an RSS feed',
    new Date(),
    rssItems
  );
  return ContentService.createTextOutput('<?xml version="1.0" encoding="utf-8"?>')
  .append(rssChannel)
  .setMimeType(ContentService.MimeType.RSS);
}

/**
 * Formats an RSS channel according to the RSS specification
 *
 * @param title
 *   Title of the channel
 * @param link
 *   URL of the channel
 * @param description
 *   Description of the channel
 * @param lastBuildDate
 *   Date of the last build of the channel
 * @param items
 *   RSS items that belong to the channel
 *
 * @return
 *   Channel formatted according to RSS specification
 *   
 * @see RSS 2.0 specification
 *   http://feed2.w3.org/docs/rss2.html
 */
function formatRssChannel(title, link, description, lastBuildDate, items) {
  // Sanitize potentially dangerous input
  title = HtmlService.createHtmlOutput().appendUntrusted(title).getContent();
  description = HtmlService.createHtmlOutput().appendUntrusted(description).getContent();
  lastBuildDate = formatRssDate(lastBuildDate);
  // rssChannel will contain the RSS-formatted channel
  var rssChannel = ContentService.createTextOutput();
  rssChannel.append('<rss version="2.0">');
  rssChannel.append('<channel>');
  rssChannel.append('<title>' + title + '</title>');
  rssChannel.append('<link>' + link + '</link>');
  rssChannel.append('<description>' + description + '</description>');
  rssChannel.append('<lastBuildDate>' + lastBuildDate + '</lastBuildDate>');
  rssChannel.append(items);
  rssChannel.append('</channel>');
  rssChannel.append('</rss>');
  return rssChannel.getContent();
}

/**
 * Formats Gmail Threads as RSS items
 *
 * @param gmailThreads
 *   An array of GmailThreads
 *
 * @return
 *   Items formatted according to RSS specification
 *
 * @see RSS 2.0 specification
 *   http://feed2.w3.org/docs/rss2.html
 */
function formatGmailThreads(gmailThreads) {
  var rssItems = ContentService.createTextOutput();
  for(var i in gmailThreads) {
    var gmailMessages = gmailThreads[i].getMessages();
    for(var j in gmailMessages) {
      rssItems.append(formatGmailMessage(gmailMessages[j]));
    }
  }
  return rssItems.getContent();  
}

/**
 * Formats a Gmail Message as an RSS item
 *
 * @param gmailMessage
 *   GmailMessage
 *
 * @return
 *   Item formatted according to RSS specification
 *
 * @see RSS 2.0 specification
 *   http://feed2.w3.org/docs/rss2.html
 */
function formatGmailMessage(gmailMessage) {
  return formatRssItem(
    gmailMessage.getFrom(),
    gmailMessage.getSubject(),
    gmailMessage.getBody(),
    gmailMessage.getDate(),
    getMessageUrl(gmailMessage.getId()),
    getMessageUrl(gmailMessage.getId())
  )
}

/**
 * Formats an RSS item according to the RSS specification
 *
 * @param author
 *   Author of the item
 * @param title
 *   Title of the item
 * @param description
 *   Description of the item
 * @param pubDate
 *   Publication date of the item
 * @param guid
 *   Unique ID of the item
 * @param link
 *   URL of the item
 *
 * @return
 *   Item formatted according to RSS specification
 *   
 * @see RSS 2.0 specification
 *   http://feed2.w3.org/docs/rss2.html
 */
function formatRssItem(author, title, description, pubDate, guid, link) {
  // Sanitize potentially dangerous input
  author = HtmlService.createHtmlOutput().appendUntrusted(author).getContent();
  title = HtmlService.createHtmlOutput().appendUntrusted(title).getContent();
  description = HtmlService.createHtmlOutput().appendUntrusted(description).getContent();
  pubDate = formatRssDate(pubDate);
  // rssItem will contain the RSS-formatted item
  var rssItem = ContentService.createTextOutput();
  rssItem.append('<item>');
  rssItem.append('<author>' + author + '</author>');
  rssItem.append('<title>' + title + '</title>');
  rssItem.append('<description>' + description + '</description>');
  rssItem.append('<pubDate>' + pubDate + '</pubDate>');
  rssItem.append('<guid>' + guid + '</guid>');
  rssItem.append('<link>' + link + '</link>');
  rssItem.append('</item>');
  return rssItem.getContent();
}

/**
 * Formats a date according to the RSS specification
 *
 * @param date
 *   Date to format
 *
 * @return
 *  Date formatted according to RSS 2.0 specification
 *
 * @see RSS 2.0 specification
 *   http://feed2.w3.org/docs/rss2.html
 * @see RFC822 "Standard for ARPA Internet Text Messages"
 *   http://www.w3.org/Protocols/rfc822/#z28
 */
function formatRssDate(date) {
  return Utilities.formatDate(date, Session.getTimeZone(), 'EEE, dd MMM yyyy HH:mm:ss zzz');
}

/**
 * Provides the URL to visualize a message on Gmail
 *
 * @param id
 *   Message ID
 *
 * @return
 *   URL of the message
 */
function getMessageUrl(id) {
  return 'https://mail.google.com/mail/?shva=1#inbox/' + id;
}
