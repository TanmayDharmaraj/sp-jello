import Rx from 'rxjs/Rx';
import fp from 'lodash/fp';
import {run} from '@cycle/rxjs-run';
import {makeHTTPDriver} from '@cycle/http'

function intent(httpSource) {
    let GetListItems = function() {
        let request$ = Rx.Observable.of({url: "https://rapidcircle1com.sharepoint.com/sites/streamdev/_api/web/lists/getbytitle('Customers')/items", content: 'customers', method: 'GET', accept: "application/json;odata=verbose"})

        let response$$ = httpSource.filter(x$ => x$.url.indexOf("https://rapidcircle1com.sharepoint.com/sites/streamdev") != -1).select(response$$);
        let response$ = response$$.switch ();
        return {response$, request$}
    }();
    return {GetListItems}
}

function model(intents) {
    return intents.GetListItems.response$.subscribe(function(x) {
        return x.body.d.results;
    }, function(err) {
        console.error(err.response.body.error);
    }, function() {
        console.log('Completed');
    });
}

function main(sources) {
    const intents = intent(sources.HTTP);
    return {HTTP: intents.GetListItems.request$};
};

const drivers = {
    HTTP: makeHTTPDriver()
};
run(main, drivers);

/*
function main(sources) {
  let request$ = xs.of({
    url: 'http://localhost:8080/hello', // GET method by default
    category: 'hello',
  });

  let response$ = sources.HTTP
    .select('hello')
    .flatten();

  let vdom$ = response$
    .map(res => res.text) // We expect this to be "Hello World"
    .startWith('Loading...')
    .map(text =>
      div('.container', [
        h1(text)
      ])
    );

  return {
    DOM: vtree$,
    HTTP: request$
  };
}*/
