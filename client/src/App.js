// APP STYLING
import './App.scss'

// PACKAGE IMPORTS
import React, { useState, useEffect, useReducer } from 'react'
import axios from 'axios'
import Fullpage from '@fullpage/react-fullpage'
import Particles from 'react-tsparticles'
import particlesOptions from './particles.json'
import { forceCheck } from 'react-lazyload'

// GLOBAL VARIBLES
import { ThemeProvider } from 'styled-components'
import { AuthContext, LibContext, TopContext, TimeContext } from './global/globalContexts'
import { init, reducer } from './global/timeRangeReducer'
import { themeV3 } from './global/globalTheme'

// CUSTOM COMPONENTS
import Header from './components/Header'
import { LibStats, LibArtists } from './components/LibraryOverview'
import { TopArtists, CommonGenres, TopTracks, AudioFeatures } from './components/TopItems'
import CustomPlaylists from './components/CustomPlaylists'

function App() {
  const [authStatus, setAuthStatus] = useState(false)
  const [libData, setLibData] = useState(null)
  const [topData, setTopData] = useState(null)
  const [timeRange, timeRangeDispatch] = useReducer(reducer, 0, init)

  useEffect(() => {
    if (document.cookie.split(';').some((item) => item.includes('auth=true'))) {
      setAuthStatus(true)
    }
    if (authStatus) {
      ;(async function getUserData() {
        const [libResponse, topResponse] = await Promise.all([axios.get('/api/library'), axios.get('/api/top')])
        setLibData(libResponse.data)
        setTopData(topResponse.data)
      })()
    }
  }, [authStatus])

  return (
    <>
      <Particles options={particlesOptions} />
      <Fullpage
        licenseKey={'E2CB5B80-44174E5C-8A9056CE-1041B060'}
        scrollingSpeed='700'
        navigation={true}
        navigationPosition='left'
        navigationTooltips={[
          'Home',
          'Library Stats',
          'Library Artists',
          'Top Artists',
          'Common Genres',
          'Top Tracks',
          'Audio Features',
          'Custom Playlists',
        ]}
        afterRender={() => {}}
        onLeave={(origin, destination, direction) => {
          if (destination.index === 1) setTimeout(forceCheck, 400)
        }}
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

                  <div className='section'>
                    <CustomPlaylists />
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
