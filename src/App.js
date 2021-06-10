import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Cards from './components/Cards/Cards';
import PhotoUpload from './components/PhotoUpload/PhotoUpload';
import VideoUpload from './components/VideoUpload/VideoUpload';
import AllUploads from './components/AllUploads/AllUploads';

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <Switch>
            <Route path="/" exact component={Cards}/>
            <Route path="/photo-upload" exact component={PhotoUpload}/>
            <Route path="/video-upload" exact component={VideoUpload}/>
            <Route path="/all-uploads" exact component={AllUploads}/>
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
