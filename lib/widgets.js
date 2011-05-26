// generates a string for common widget attributes
// var attrs = function(a){
//     html = ' name="' + a.name + '"';
//     html += ' id=' + (a.id ? '"' + a.id + '"': '"id_' + a.name + '"');
//     html += (a.classes.length) ? ' class="' + a.classes.join(' ') + '"': '';
//     return html;
// };

// more generic form formatting
var formatAttributes = function(attributes) {
  var html = '';
  if (!attributes.id) {
    attributes.id = 'id_' + attributes.name;
  }
  
  if (attributes.classes) {
    if (attributes.classes.length == 0) {
      delete attributes.classes;
    }
    else {
      attributes.classes = attributes.classes.join(' ');
    }
  }
  
  for (var name in attributes) {
    html += ' ' + name + '="' + attributes[name] + '"';
  }
  
  return html.substring(1);
}

// used to generate different input elements varying only by type attribute
var input = function(type){
    return function(opt){
        var opt = opt || {};
        var w = {};
        w.classes = opt.classes || [];
        w.attributes = opt.attributes || {};
        w.before = opt.before || '';
        w.after = opt.after || '';
        w.fieldsetAttributes = opt.fieldsetAttributes || {};
        w.type = type;
        w.toHTML = function(name, f){
            var f = f || {};
            var attr = _extend({'name': name, id: f.id, classes: w.classes}, w.attributes);
            var html = '<input';
            html += ' type="' + w.type + '"';
            html += ' ' + formatAttributes(attr) + ' ';
            html += f.value ? ' value="' + f.value + '"': '';
            return w.before + html + ' />' + w.after;
        }
        return w;
    };
};

exports.input = function(type, opt){
  var opt = opt || {};
  var i = input(type);
  return i(opt);
};

exports.text = input('text');
exports.password = input('password');
exports.hidden = input('hidden');

exports.checkbox = function(opt){
    var opt = opt || {};
    var w = {};
    w.classes = opt.classes || [];
    w.attributes = opt.attributes || {};
    w.before = opt.before || '';
    w.after = opt.after || '';
    w.fieldsetAttributes = opt.fieldsetAttributes || {};
    w.type = 'checkbox';
    w.toHTML = function(name, f){
        var f = f || {};
        var attr = _extend({'name': name, id: f.id, classes: w.classes}, w.attributes);
        var html = '<input type="checkbox"';
        html += ' ' + formatAttributes(attr) + ' ';
        html += f.value ? ' checked="checked"': '';
        return w.before + html + ' />' + w.after;
    }
    return w;
};

exports.select = function(opt){
    var opt = opt || {};
    var w = {};
    w.classes = opt.classes || [];
    w.attributes = opt.attributes || {};
    w.before = opt.before || '';
    w.after = opt.after || '';
    w.fieldsetAttributes = opt.fieldsetAttributes || {};
    w.type = 'select';
    w.toHTML = function(name, f){
        var f = f || {};
        var attr = _extend({'name': name, id: f.id, classes: w.classes}, w.attributes);
        var html = '<select ' + formatAttributes(attr) + ' >';
        html += Object.keys(f.choices).reduce(function(html, k){
            return html + '<option value="' + k + '"' +
            ((f.value && f.value == k) ? ' selected="selected"': '') + '>' +
                f.choices[k] +
            '</option>';
        }, '');
        return w.before + html + '</select>' + w.after;
    }
    return w;
};

exports.textarea = function(opt){
    var opt = opt || {};
    var w = {};
    w.classes = opt.classes || [];
    w.attributes = opt.attributes || {};
    w.before = opt.before || '';
    w.after = opt.after || '';
    w.fieldsetAttributes = opt.fieldsetAttributes || {};
    w.type = 'textarea';
    w.toHTML = function(name, f){
        var f = f || {};
        var attr = _extend({'name': name, id: f.id, classes: w.classes}, w.attributes);
        var html = '<textarea ' + formatAttributes(attr);
        html += opt.rows ? ' rows="' + opt.rows + '"': '';
        html += opt.cols ? ' cols="' + opt.cols + '"': '';
        html += '>';
        html += f.value ? f.value : '';
        return w.before + html + '</textarea>' + w.after;
    }
    return w;
};

exports.multipleCheckbox = function(opt){
    var opt = opt || {};
    var w = {};
    w.classes = opt.classes || [];
    w.attributes = opt.attributes || {};
    w.before = opt.before || '';
    w.after = opt.after || '';
    w.fieldsetAttributes = opt.fieldsetAttributes || {};
    w.type = 'multipleCheckbox';
    w.toHTML = function(name, f){
        var f = f || {};
        return Object.keys(f.choices).reduce(function(html, k){
          var id = f.id ? f.id + '_' + k: 'id_' + name + '_' + k;
          var attr = _extend({'id': id, 'name': name, classes: w.classes}, w.attributes);
          
            // input element
            html += '<input type="checkbox"';
            html += ' ' + formatAttributes(attr) + ' ';

            if(w.classes.length)
                html += ' class="' + w.classes.join(' ') + '"';

            html += ' value="' + k + '"';

            if(f.value instanceof Array){
                if(f.value.some(function(v){return v == k;})){
                    html += ' checked="checked"';
                }
            }
            else html += (f.value == k) ? ' checked="checked"': '';

            html += '>';

            // label element
            html += '<label for="' + id + '">' + f.choices[k] + '</label>';

            return w.before + html + w.after;
        }, '');
    };
    return w;
};

exports.multipleRadio = function(opt){
    var opt = opt || {};
    var w = {};
    w.classes = opt.classes || [];
    w.attributes = opt.attributes || {};
    w.before = opt.before || '';
    w.after = opt.after || '';
    w.fieldsetAttributes = opt.fieldsetAttributes || {};
    w.type = 'multipleRadio';
    w.toHTML = function(name, f){
        var f = f || {};
        return Object.keys(f.choices).reduce(function(html, k){
            // input element
            var id = f.id ? f.id + '_' + k: 'id_' + name + '_' + k;
            var attr = _extend({'id': id, 'name': name, classes: w.classes}, w.attributes);
            
            html += '<input type="radio"';
            html += ' ' + formatAttributes(attr) + ' ';
            html += ' name="' + name + '"';
            
            if(w.classes.length)
                html += ' class="' + w.classes.join(' ') + '"';

            html += ' value="' + k + '"';

            if(f.value instanceof Array){
                if(f.value.some(function(v){return v == k;})){
                    html += ' checked="checked"';
                }
            }
            else html += (f.value == k) ? ' checked="checked"': '';
            html += '>';

            // label element
            html += '<label for="' + id + '">' + f.choices[k] + '</label>';

            return w.before + html + w.after;
        }, '');
    };
    return w;
};

exports.multipleSelect = function(opt){
    var opt = opt || {};
    var w = {};
    w.classes = opt.classes || [];
    w.attributes = opt.attributes || {};
    w.before = opt.before || '';
    w.after = opt.after || '';
    w.fieldsetAttributes = opt.fieldsetAttributes || {};
    w.type = 'multipleSelect';
    w.toHTML = function(name, f){
        var f = f || {};
        var html = '<select multiple="mulitple" ' + formatAttributes(attr) + '>';
        html += Object.keys(f.choices).reduce(function(html, k){
            var attr = _extend({classes: w.classes}, w.attributes);
            html += '<option value="' + k + '"';
            if(f.value instanceof Array){
                if(f.value.some(function(v){return v == k;})){
                    html += ' selected="selected"';
                }
            }
            else if(f.value && f.value == k){
                html += ' selected="selected"';
            }
            html += '>' + f.choices[k] + '</option>';
            return html;
        }, '');
        return w.before + html + '</select>' + w.after;
    }
    return w;
};

// simple, non-recursive extend, taken from underscore.js
function _extend(source, destination) {
  for (var prop in source) {
    if (source[prop] !== void 0) destination[prop] = source[prop];
  }
  
  return destination;
}