$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$(function() {
    function bind_table() {
        $('table[data-url]').each(function(){
            var tbody = $(this).find('tbody');
            tbody.find('tr.real').remove();
            var tr = $(this).find('tbody tr');            
            $.get($(this).attr('data-url'), function(data) {
                $.each(data, function(k, v) {
                    var row = tr.clone();
                    $.each(v, function(name, value) {
                        row.find('td[data-bind="' + name + '"]').text(value);
                    });
                    row.removeClass('hide').addClass('real').appendTo(tbody);
                });
            });
        });
    }
    $('div.modal button.btn-primary').click(function() {
        var data = JSON.stringify($('div.modal form').serializeObject());
        $('div.modal').modal('hide');
        $.post($('div.modal form').attr('action'), {
            data: data
        }, function(data) {
            bind_table();
        }, 'json');
    });
    $('div.modal form').submit(function() {
        // On submit disable its submit button
        return false;
    });
    bind_table();
});