var Element = require('../node_modules/node-xmpp/node_modules/ltx').Element;
var Client = require('node-xmpp').Client;

var write = function(writer) {
    writer("<");
    writer(this.name);
    for(var k in this.attrs) {
        var v = this.attrs[k];
        if (v || v === '' || v === 0) {
            writer(" ");
            writer(k);
            writer("=\"");
            if (typeof v != 'string')
                v = v.toString();
            writer(escapeXml(v));
            writer("\"");
        }
    }
    if (this.children.length == 0) {
        writer("/>");
    } else {
        writer(">");
        for(var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            /* Skip null/undefined */
            if (child || child === 0) {
                if (child.write) {
                    child.write(writer);
                } else if (typeof child === 'string') {
                    writer(child);
                } else if (child.toString) {
                    writer(child.toString());
                }
            }
        }
        writer("</");
        writer(this.name);
        writer(">");
    }
};

function escapeXml(s) {
    return s.
        replace(/\&/g, '&amp;').
        replace(/</g, '&lt;').
        replace(/>/g, '&gt;').
        replace(/"/g, '&quot;').
        replace(/'/g, '&apos;');
}

Client.prototype.sendUnsafe = function (obj) {
    Element.prototype.write = write;
    this.send(obj);
};
