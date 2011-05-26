var wrapWith = function(tag){
    return function(name, field){
        if (field.widget.type == 'hidden') {
          return field.widget.toHTML(name, field);
        }
        var label = this.label;
        if(!label){
            label = name[0].toUpperCase() + name.substr(1).replace('_', ' ');
        }
        var html = '<' + tag + ' class="' + field.classes().join(' ') + '"' + formatAttributes(field.wrapAttributes) + '>';
        if(field.widget.type == 'multipleCheckbox' ||
           field.widget.type == 'multipleRadio'){
            html += '<fieldset ' + formatAttributes(field.widget.fieldsetAttributes) + '>' +
                '<legend>' + field.labelText(name) + '</legend>' +
                field.errorHTML() +
                field.widget.toHTML(name, field) +
            '</fieldset>';
        }
        else {
            html += field.errorHTML() +
                field.labelHTML(name, field.id) +
                field.widget.toHTML(name, field);
        }
        return html + '</' + tag + '>';
    };
};
exports.div = wrapWith('div');
exports.p = wrapWith('p');
exports.li = wrapWith('li');

exports.table = function(name, field){
    return '<tr class="' + field.classes().join(' ') + '">' +
        '<th>' + field.labelHTML(name) + '</th>' +
        '<td>' +
            field.errorHTML() +
            field.widget.toHTML(name, field) +
        '</td>' +
    '</tr>';
};

function formatAttributes(attributes) {
  if (attributes == undefined || attributes.length == 0) {
    return '';
  }
  var output = ' ';
  for (var name in attributes) {
    output += name + '="' + attributes[name] + '"';
  }
  
  return output;
}