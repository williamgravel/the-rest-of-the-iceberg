// PACKAGE IMPORTS
import React, { useContext, useState } from 'react'
import LazyLoad from 'react-lazyload'
import { useCountUp } from 'react-countup'

// GLOBAL CONTEXT
import { LibContext } from '../global/globalContexts'

// UTIL FUNCTIONS
import trimText from '../utils/trimText'

// COMPONENTS
import { Container, Row, Col } from 'react-bootstrap'
import { Heading, Box } from './Section'
import { List, ListItem } from './List'
import { ButtonWrapper, ButtonText, ArtistListButton } from './ActionButtons'
import { LargeThumbnail } from './Thumbnail'

const Counter = ({ children, color, decimals, delay, suffix }) => {
  const { countUp } = useCountUp({
    end: children,
    decimals: decimals || 0,
    delay: delay,
    duration: 2,
    suffix: suffix || '',
  })
  return <Box.Stat color={color}>{countUp}</Box.Stat>
}

const LibStats = () => {
  const libData = useContext(LibContext)

  return (
    <Container fluid>
      <Row className='align-items-end' style={{ marginBottom: '60px' }}>
        <Col></Col>
        <Col lg={7}>
          <Heading>Your Stats</Heading>
        </Col>
        <Col></Col>
      </Row>
      <LazyLoad height={680} once>
        <Row className='justify-content-center'>
          <Col lg={9} className='d-flex flex-wrap justify-content-center'>
            <Box>
              <Box.Text>total of</Box.Text>
              <Counter color='red' delay={1}>
                {libData.totalTracks}
              </Counter>
              <Box.Text>tracks saved</Box.Text>
            </Box>
            <Box>
              <Box.Text>total of</Box.Text>
              <Counter color='pink' delay={2.5}>
                {libData.totalArtists}
              </Counter>
              <Box.Text>artists saved</Box.Text>
            </Box>
            <Box>
              <Box.Text>total of</Box.Text>
              <Counter color='purple' delay={4} suffix='h'>
                {Math.round(libData.totalPlaytime / 3.6e6)}
              </Counter>
              <Box.Text>of playtime</Box.Text>
            </Box>
            <Box>
              <Box.Text>library around</Box.Text>
              <Counter color='yellow' decimals={1} delay={5.5} suffix='%'>
                {Math.round(libData.percentExplicit * 10) / 10}
              </Counter>
              <Box.Text>explicit</Box.Text>
            </Box>
            <Box>
              <Box.Text>average of</Box.Text>
              <Counter color='green' decimals={1} delay={7}>
                {Math.round(libData.tracksPerArtist.mean * 10) / 10}
              </Counter>
              <Box.Text>tracks saved per artist</Box.Text>
            </Box>
            <Box>
              <Box.Text>median of</Box.Text>
              <Counter color='blue' delay={8.5} suffix='d'>
                {Math.round(libData.daysUntilSave.median)}
              </Counter>
              <Box.Text>until saving a track</Box.Text>
            </Box>
          </Col>
        </Row>
      </LazyLoad>
    </Container>
  )
}

const LibArtists = () => {
  const libData = useContext(LibContext)
  const [list, setList] = useState('commonArtists')
  const [pos, setPos] = useState(0)

  return (
    <Container fluid>
      <Row className='align-items-end' style={{ marginBottom: '40px' }}>
        <Col></Col>
        <Col lg={7}>
          <Heading>{list === 'commonArtists' ? 'Common Artists' : 'Classic Artists'}</Heading>
          <ButtonWrapper
            color='dark'
            onClick={() => {
              list === 'commonArtists' ? setList('classicArtists') : setList('commonArtists')
            }}
          >
            <ArtistListButton />
            <ButtonText>switch list</ButtonText>
          </ButtonWrapper>
        </Col>
        <Col></Col>
      </Row>
      <Row>
        <Col lg={6} className='d-flex justify-content-end'>
          <LargeThumbnail
            src={libData[list][pos].artistID.profilePic}
            alt={libData[list][pos].artistID.name}
            color={list === 'commonArtists' ? 'blue' : 'green'}
          />
        </Col>
        <Col lg={6} className='d-flex justify-content-start'>
          <List>
            {libData[list].map((artist, index) => (
              <ListItem
                key={artist.artistID.spotifyID}
                color={list === 'commonArtists' ? 'blue' : 'green'}
                className={pos === index ? 'active' : ''}
              >
                <ListItem.Prefix onMouseEnter={() => setPos(index)}>{index + 1}</ListItem.Prefix>
                <ListItem.Title href={artist.artistID.spotifyURL} onMouseEnter={() => setPos(index)}>
                  {trimText(artist.artistID.name, 25)}
                </ListItem.Title>
                <ListItem.Subtitle onMouseEnter={() => setPos(index)}>
                  {list === 'commonArtists'
                    ? `${artist.trackCount} tracks`
                    : `${artist.newestYear - artist.oldestYear} years`}
                </ListItem.Subtitle>
              </ListItem>
            ))}
          </List>
        </Col>
      </Row>
    </Container>
  )
}

export { LibStats, LibArtists }
