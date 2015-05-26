# automatic-typesetter
Photoshop script for automated typesetting.

Save the script in your Photoshop's Scripts folder (Presets\Scripts inside Photoshop's installation folder)
Restart Photoshop.

Ensure that the translated manga script conforms to the standard format.

Save the script as a plain text, utf-8 encoded .txt file.
Place the file inside the folder where the cleaned PSDs are located. Make sure there are no .txt files other than the script in the same folder.

Now for the fun part....
Drag empty text boxes where you want text to be placed. They don't need to be perfect, just the approximate place where you think the text should go, with appropriate dimensions. (basically do what you'd do anyway when copy/pasting text, just don't copy/paste any text)
Press Enter after dragging each box (that's Enter on the num pad side, not the return key). This commits the layer and allows you to drag the next text box.
Create the text boxes in the reading order of the text. If you don't, the text from the script will go in the wrong places. The first text as it appears in the script goes into the bottommost text layer in the layers window.

Once you are done placing all the text boxes, run the script:
File->Scripts->AutomaticTypesetter
Select the folder where you placed the PSDs and the .txt file. 

You might want to do a quick check before starting the script just to make sure you have the right number of text boxes on each page. The script will warn you if the numbers don't match but carry on.
