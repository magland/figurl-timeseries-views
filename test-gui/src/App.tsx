import { MuiThemeProvider } from '@material-ui/core';
import { defaultRecordingSelection, RecordingSelectionContext, recordingSelectionReducer } from './package';
import { getFigureData, SetupUrlState, startListeningToParent } from '@figurl/interface';
import { useWindowDimensions } from '@figurl/core-utils';
import { useEffect, useMemo, useReducer, useState } from 'react';
import './localStyles.css';
import theme from './theme';
import View from './View';
import { isViewData, ViewData } from './ViewData';
// import { SetupAnnotations } from 'libraries/context-annotations';

const urlSearchParams = new URLSearchParams(window.location.search)
const queryParams = Object.fromEntries(urlSearchParams.entries())

function App() {
  const [data, setData] = useState<ViewData>()
  const [errorMessage, setErrorMessage] = useState<string>()
  const {width, height} = useWindowDimensions()

  const [recordingSelection, recordingSelectionDispatch] = useReducer(recordingSelectionReducer, defaultRecordingSelection)

  useEffect(() => {
    if (queryParams.test === '1') {
      // To test the Test1View without using the figurl parent
      // for example, with no internet connection,
      // use http://localhost:3000?test=1
      // setData({type: 'Test1'})
    }
    else {
      getFigureData().then((data: any) => {
        if (!isViewData(data)) {
          setErrorMessage(`Invalid figure data`)
          console.error('Invalid figure data', data)
          return
        }
        setData(data)
      }).catch((err: any) => {
        setErrorMessage(`Error getting figure data`)
        console.error(`Error getting figure data`, err)
      })
    }
  }, [])

  const opts = useMemo(() => ({}), [])

  if (!queryParams.figureId) {
    return (
      <div style={{padding: 20}}>
        <h2>This page is not being embedded as a figurl figure.</h2>
        <h3>Here are some examples you may want to try:</h3>
        <ul>
          <li><a href="https://www.figurl.org/f?v=http://localhost:3000&d=sha1://0d9cb4bae0e34ccbf4d897cbd51fcb27efa0c471&label=Timeseries%20graph%20example">TimeseriesGraph</a></li>
        </ul>
      </div>
    )
  }

  if (!queryParams.figureId) {
    return (
      <div style={{padding: 20}}>
        <h2>This page is not being embedded as a figurl figure.</h2>
        <h3>Here are some examples you may want to try:</h3>
        <ul>
          <li><a href="https://www.figurl.org/f?v=http://localhost:3000&d=sha1://5be70cba528fb561f791b8a777410c045994cf1b&label=Autocorrelograms%20example&s={}">autocorrelograms</a></li>
        </ul>
      </div>
    )
  }

  if (errorMessage) {
    return <div style={{color: 'red'}}>{errorMessage}</div>
  }

  if (!data) {
    return <div>Waiting for data</div>
  }

  return (
    <MuiThemeProvider theme={theme}>
      <RecordingSelectionContext.Provider value={{recordingSelection, recordingSelectionDispatch}}>
        {/* <UnitSelectionContext.Provider value={{unitSelection, unitSelectionDispatch}}> */}
          {/* <SetupAnnotations> */}
            <SetupUrlState>
              <View
                data={data}
                opts={opts}
                width={width - 10}
                height={height - 5}
              />
            </SetupUrlState>
          {/* </SetupAnnotations> */}
        {/* </UnitSelectionContext.Provider> */}
      </RecordingSelectionContext.Provider>
    </MuiThemeProvider>
  )
}

startListeningToParent()

export default App;

