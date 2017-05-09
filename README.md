#Simple, lightweight WYSIWYG Web Editor

I found the full-fledged WYSIWYG-Editors like CKEditor too messy and slow, so I created yet another web editor, which is really simple and lightweight.
This is not a plugin. You have to edit the code to suit your needs. 

Working demo: http://www.tools.nubenum.de/wysiwyg/editor.html

Please keep in mind that if you remove elements from the editor.html, you might need to remove the appropriate JS calls in the editor.js.

In order to post the HTML that the editor created to a server, you could use a snippet like this:
```
<form method="post" id="form" action="">
<input type="hidden" name="editable" id="hidden_post" value="">
<input type="button" value="Save" onclick="document.getElementById('hidden_post').value = document.getElementById('editable').innerHTML;document.getElementById('form').submit();">
</form>
```
