function handleTextNode(textNode) {
    if(textNode.nodeName !== '#text') {
         //Don't do anything except on text nodes.
        return;
    }
    let origText = textNode.textContent;
    var newHtml = origText;
    var regexp = /\[#(\d+)\]/g;
    var id = origText.match(regexp);

    if (id != null) {
      var num = id[0].match(/\d+/);
      newHtml = origText.replace(regexp,'<a href="https://www.pivotaltracker.com/story/show/' + num + '">\[#'+ num +'\]</a>');
    }

    //Only change the DOM if we actually made a replacement in the text.
    //Compare the strings, as it should be faster than a second RegExp operation and
    //  lets us use the RegExp in only one place for maintainability.

    if( newHtml !== origText) {
        let newSpan = document.createElement('span');
        newSpan.innerHTML = newHtml;
        textNode.parentNode.replaceChild(newSpan,textNode);
    }
}

//Testing: Walk the DOM of the <body> handling all non-empty text nodes
function processDocument() {
    //Create the TreeWalker
    let treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT,{
        acceptNode: function(node) {
            if(node.textContent.length === 0) {
                return NodeFilter.FILTER_SKIP; //Skip empty text nodes
            } //else
            return NodeFilter.FILTER_ACCEPT;
        }
    }, false );
    //Make a list of nodes prior to modifying the DOM. Once the DOM is modified the
    //  TreeWalker can become invalid (i.e. it stop after the first modification).
    let nodeList=[];
    while(treeWalker.nextNode()){
        nodeList.push(treeWalker.currentNode);
    }
    //Iterate over all text nodes, calling handleTextNode on each node in the list.
    nodeList.forEach(function(el){
        handleTextNode(el);
    });
}

processDocument();
