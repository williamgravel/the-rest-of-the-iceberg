// PACKAGE IMPORTS
import React, { useState, useEffect, useReducer } from 'react'
import axios from 'axios'
import Fullpage from '@fullpage/react-fullpage'
import Particles from 'react-tsparticles'
import particlesOptions from './particles.json'

// GLOBAL VARIBLES
import { ThemeProvider } from 'styled-components'
import { AuthContext, LibContext, TopContext, TimeContext } from './global/globalContexts'
import { init, reducer } from './global/timeRangeReducer'
import { themeV3 } from './global/globalTheme'

// APP STYLING
import './App.scss'

// CUSTOM COMPONENTS
import Header from './components/Header'
import { LibStats, LibArtists } from './components/LibraryOverview'
import { TopArtists, CommonGenres, TopTracks, AudioFeatures } from './components/TopItems'

function App() {
  const [authStatus, setAuthStatus] = useState(false)
  const [libData, setLibData] = useState(null)
  const [topData, setTopData] = useState(null)
  const [timeRange, timeRangeDispatch] = useReducer(reducer, 0, init)

  useEffect(() => {
    if (document.cookie.split(';').some((item) => item.includes('auth=true'))) {
      setAuthStatus(true)
    }
    if (authStatus && !libData) {
      axios.get('/api/library').then((response) => {
        setLibData(response.data)
      })
    }
    if (authStatus && !topData) {
      axios.get('/api/top').then((response) => {
        setTopData(response.data)
      })
    }
  }, [authStatus, libData, topData])

  return (
    <>
      <Particles options={particlesOptions} />
      <Fullpage
        licenseKey={'E2CB5B80-44174E5C-8A9056CE-1041B060'}
        scrollingSpeed='700'
        afterRender={() => {}}
        render={({ state, fullpageApi }) => {
          return (
            <Fullpage.Wrapper>
              {libData && topData ? (
                <ThemeProvider theme={themeV3}>
                  <div className='section'>
                    <AuthContext.Provider value={authStatus}>
                      <Header />
                    </AuthContext.Provider>
                  </div>

                  <div className='section'>
                    <LibContext.Provider value={libData}>
                      <LibStats />
                    </LibContext.Provider>
                  </div>

                  <div className='section'>
                    <LibContext.Provider value={libData}>
                      <LibArtists />
                    </LibContext.Provider>
                  </div>

                  <div className='section'>
                    <TimeContext.Provider value={[timeRange, timeRangeDispatch]}>
                      <TopContext.Provider value={topData}>
                        <TopArtists />
                      </TopContext.Provider>
                    </TimeContext.Provider>
                  </div>

                  <div className='section'>
                    <TimeContext.Provider value={[timeRange, timeRangeDispatch]}>
                      <TopContext.Provider value={topData}>
                        <CommonGenres />
                      </TopContext.Provider>
                    </TimeContext.Provider>
                  </div>

                  <div className='section'>
                    <TimeContext.Provider value={[timeRange, timeRangeDispatch]}>
                      <TopContext.Provider value={topData}>
                        <TopTracks />
                      </TopContext.Provider>
                    </TimeContext.Provider>
                  </div>

                  <div className='section'>
                    <TimeContext.Provider value={[timeRange, timeRangeDispatch]}>
                      <TopContext.Provider value={topData}>
                        <AudioFeatures />
                      </TopContext.Provider>
                    </TimeContext.Provider>
                  </div>
                </ThemeProvider>
              ) : (
                <ThemeProvider theme={themeV3}>
                  <div className='section'>
                    <AuthContext.Provider value={authStatus}>
                      <Header />
                    </AuthContext.Provider>
                  </div>
                </ThemeProvider>
              )}
            </Fullpage.Wrapper>
          )
        }}
      />
    </>
  )
}

export default App
