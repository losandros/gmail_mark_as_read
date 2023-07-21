// Mark as read after how many days?
var MARK_AS_READ_AFTER_DAYS = "90";

// Mark emails as read in which folder/label?
var LABEL_TO_MARK="inbox";


function Intialize() {
  return;
}

function Install() {

  ScriptApp.newTrigger("markMails")
           .timeBased()
           .at(new Date((new Date()).getTime() + 1000*60*2))
           .create();
  
  ScriptApp.newTrigger("markMails")
           .timeBased().everyDays(1).create();

}

function Uninstall() {
  https://script.google.com/macros/d/MBqrNPSzGjwZ_-vuH7kZCsXuAQ7im4wST/gwt/clear.cache.gif
  var triggers = ScriptApp.getProjectTriggers();
  for (var i=0; i<triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  
}

function markMails() {

  var age = new Date();  
  age.setDate(age.getDate() - MARK_AS_READ_AFTER_DAYS);    
  
  var purge  = Utilities.formatDate(age, Session.getTimeZone(), "yyyy-MM-dd");
  var search = "label:" + LABEL_TO_MARK + " label:unread" + " older_than:" + MARK_AS_READ_AFTER_DAYS + "d";
  Logger.log(search)
  try {
    var threads = GmailApp.search(search, 0, 100);
    Logger.log(threads)
    if (threads.length == 100) {
      ScriptApp.newTrigger("markMails")
               .timeBased()
               .at(new Date((new Date()).getTime() + 1000*60*10))
               .create();
    }
    Logger.log(GmailApp.getMessagesForThread(threads[1]).length);
    for (var i=0; i<threads.length; i++) {
      var messages = GmailApp.getMessagesForThread(threads[i]);
      for (var j=0; j<messages.length; j++) {
        var email = messages[j];       
        if (email.getDate() < age) {
          Logger.log(email.getDate() + " - "+ email.getSubject());
          email.markRead();
        }
      }
    }   
  } catch (e) {}
}
