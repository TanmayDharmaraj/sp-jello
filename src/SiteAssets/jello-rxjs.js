import Rx from 'rxjs/Rx';
import fp from 'lodash/fp';

var Jello = function(options) {
    var Filter = function() {
        var where = function(where) {
            return Rx.Observable.of("$filter=" + where);
        }
        var select = function(select) {
            return Rx.Observable.of("$select=" + select);
        }
        var make = function(args) {
            return Rx.Observable.forkJoin(args)
        }
        return {where, select, make}
    }()
    var ListItems = function() {
        var get = function(filterOb) {
            var promise = null;
            if (filterOb) {
                filterOb.subscribe({
                    next: function(filterValues) {
                        promise = $.ajax({
                            url: "https://rapidcircle1com.sharepoint.com/sites/streamdev/_api/web/lists/getbytitle('Customers')/items?" + filterValues.join("&"),
                            type: 'GET',
                            headers: {
                                "accept": "application/json;odata=verbose"
                            }
                        }).promise();
                    },
                    error: function(er) {
                        console.error(er);
                    },
                    complete: function() {
                        //done
                    }
                });
            } else {
                promise = $.ajax({
                    url: "https://rapidcircle1com.sharepoint.com/sites/streamdev/_api/web/lists/getbytitle('Customers')/items",
                    type: 'GET',
                    headers: {
                        "accept": "application/json;odata=verbose"
                    }
                }).promise();
            }
            return Rx.Observable.fromPromise(promise)
        }
        return {get}
    }();
    return {ListItems: ListItems, Filter: Filter}
}();

//To kick things off.
var filter = Jello.Filter.make([Jello.Filter.where("Id eq 8"), Jello.Filter.select("Title")])
Jello.ListItems.get(filter).subscribe({
    next: function(x) {
        console.log(x)
    },
    error: function(e) {
        console.error(e)
    },
    complete: function() {
        //done
    }
});
