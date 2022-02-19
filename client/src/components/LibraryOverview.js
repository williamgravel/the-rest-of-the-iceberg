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
import { RowHeading, ColBox, Heading, Box } from './Section'
import { List, ListItem } from './List'
import { ButtonWrapper, ButtonText, ArtistListButton } from './ActionButtons'
import { LargeThumbnail } from './Thumbnail'

const TotalTracks = ({ delay, float }) => {
  const libData = useContext(LibContext)
  const { countUp } = useCountUp({ end: libData.totalTracks, delay: delay, duration: 2 })
  return (
    <Box>
      <Box.Text float={float}>total of</Box.Text>
      <Box.Stat float={float} color='red'>
        {countUp}
      </Box.Stat>
      <Box.Text float={float}>tracks saved</Box.Text>
    </Box>
  )
}

const TotalArtists = ({ delay, float }) => {
  const libData = useContext(LibContext)
  const { countUp } = useCountUp({ end: libData.totalArtists, delay: delay, duration: 2 })
  return (
    <Box>
      <Box.Text float={float}>total of</Box.Text>
      <Box.Stat float={float} color='pink'>
        {countUp}
      </Box.Stat>
      <Box.Text float={float}>artists saved</Box.Text>
    </Box>
  )
}

const TotalPlaytime = ({ delay, float }) => {
  const libData = useContext(LibContext)
  const { countUp } = useCountUp({
    end: Math.round(libData.totalPlaytime / 3.6e6),
    delay: delay,
    duration: 2,
    suffix: 'h',
  })
  return (
    <Box>
      <Box.Text float={float}>total of</Box.Text>
      <Box.Stat float={float} color='purple'>
        {countUp}
      </Box.Stat>
      <Box.Text float={float}>of playtime</Box.Text>
    </Box>
  )
}

const PercentExplicit = ({ delay, float }) => {
  const libData = useContext(LibContext)
  const { countUp } = useCountUp({
    end: Math.round(libData.percentExplicit * 10) / 10,
    decimals: 1,
    delay: delay,
    duration: 2,
    suffix: '%',
  })
  return (
    <Box>
      <Box.Text float={float}>library around</Box.Text>
      <Box.Stat float={float} color='yellow'>
        {countUp}
      </Box.Stat>
      <Box.Text float={float}>explicit</Box.Text>
    </Box>
  )
}

const TracksPerArtist = ({ delay, float }) => {
  const libData = useContext(LibContext)
  const { countUp } = useCountUp({
    end: Math.round(libData.tracksPerArtist.mean * 10) / 10,
    decimals: 1,
    delay: delay,
    duration: 2,
  })
  return (
    <Box>
      <Box.Text float={float}>average of</Box.Text>
      <Box.Stat float={float} color='green'>
        {countUp}
      </Box.Stat>
      <Box.Text float={float}>tracks saved per artist</Box.Text>
    </Box>
  )
}

const DaysUntilSave = ({ delay, float }) => {
  const libData = useContext(LibContext)
  const { countUp } = useCountUp({
    end: Math.round(libData.daysUntilSave.median),
    delay: delay,
    duration: 2,
    suffix: 'd',
  })
  return (
    <Box>
      <Box.Text float={float}>median of</Box.Text>
      <Box.Stat float={float} color='blue'>
        {countUp}
      </Box.Stat>
      <Box.Text float={float}>until saving a track</Box.Text>
    </Box>
  )
}

const LibStats = () => {
  return (
    <Container fluid>
      <RowHeading>
        <Col lg={7}>
          <Heading>Your Stats</Heading>
        </Col>
      </RowHeading>
      <LazyLoad height={680} once>
        <Row className='justify-content-center'>
          <ColBox lg={9}>
            <TotalTracks delay={1} float={15} />
            <TotalArtists delay={2.5} float={20} />
            <TotalPlaytime delay={4} float={10} />
            <PercentExplicit delay={5.5} float={25} />
            <TracksPerArtist delay={7} float={15} />
            <DaysUntilSave delay={8.5} float={20} />
          </ColBox>
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
      <RowHeading>
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
      </RowHeading>
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
