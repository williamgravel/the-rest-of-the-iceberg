import React from 'react'
import ReactFullpage from '@fullpage/react-fullpage'
import Header from './Header'
import TopArtists from './TopArtists'
import TopTracks from './TopTracks'

const Fullpage = () => (
  <ReactFullpage
    scrollingSpeed={1000}
    render={({ state, fullpageApi }) => {
      return (
        <ReactFullpage.Wrapper>
          <div className='section'>
            <Header />
          </div>
          <div className='section'>
            <TopArtists />
          </div>
          <div className='section'>
            <TopTracks />
          </div>
        </ReactFullpage.Wrapper>
      )
    }}
  />
)

export default Fullpage
