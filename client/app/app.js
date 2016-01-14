/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

//import 'todomvc-common';
import {IndexRoute, Route, hashHistory} from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import {RelayRouter} from 'react-router-relay';
import TodoApp from './components/TodoApp';
import TodoList from './components/TodoList';
import ViewerQueries from './queries/ViewerQueries';

console.log('start app');
ReactDOM.render(
  <RelayRouter history={hashHistory}>
    <Route
      path="/" component={TodoApp} queries={ViewerQueries}>
      <IndexRoute
        component={TodoList}
        queries={ViewerQueries}
        prepareParams={() => ({status: 'any'})}
      />
      <Route
        path=":status" component={TodoList}
        queries={ViewerQueries}
      />
    </Route>
  </RelayRouter>,
  document.getElementById('root')
);
