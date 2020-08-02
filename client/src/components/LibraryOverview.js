// PACKAGE IMPORTS
import React, { useContext, useState } from 'react'
import 'animate.css/animate.min.css'
// import { useCountUp } from 'react-countup'

// GLOBAL CONTEXT
import { LibContext } from '../global/globalContexts'

// COMPONENTS
import { Container, Row, Col } from 'react-bootstrap'
import {
  Heading,
  ImageWrapper,
  Image,
  Square,
  List,
  Item,
  ItemPrefix,
  ItemTitle,
  ItemSubtitle,
  ButtonWrapper,
  ArtistSwitchButton,
  ButtonText,
} from './LargeComponents'

// function CountUpNumber(props) {
//   const { countUp } = useCountUp({ end: props.number, delay: 2, duration: 2 })
//   return <span>{countUp}</span>
// }

function LibStats() {
  const libData = useContext(LibContext)

  return (
    <Container fluid style={{ userSelect: 'none' }}>
      <Row className='align-items-end' style={{ marginBottom: '40px' }}>
        <Col></Col>
        <Col lg={7}>
          <Heading>Your Stats</Heading>
        </Col>
        <Col></Col>
      </Row>

      <Row>
        <Col lg={6} className='d-flex justify-content-end '></Col>
        <Col lg={6} className='d-flex justify-content-start'></Col>
      </Row>
    </Container>
  )
}

function LibArtists() {
  const libData = useContext(LibContext)
  const [list, setList] = useState('commonArtists')
  const [pos, setPos] = useState(0)

  return (
    <Container fluid style={{ userSelect: 'none' }}>
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
            <ArtistSwitchButton />
            <ButtonText>switch list</ButtonText>
          </ButtonWrapper>
        </Col>

        <Col></Col>
      </Row>

      <Row>
        <Col lg={6} className='d-flex justify-content-end '>
          <ImageWrapper>
            <Square color={list === 'commonArtists' ? 'blue' : 'green'} />
            <Image src={libData[list][pos].artistID.profilePic} alt={libData[list][pos].artistID.name} />
          </ImageWrapper>
        </Col>
        <Col lg={6} className='d-flex justify-content-start'>
          <List>
            {libData[list].map((artist, index) => (
              <Item
                key={artist.artistID.spotifyID}
                color={list === 'commonArtists' ? 'blue' : 'green'}
                className={pos === index ? 'active' : ''}
              >
                <ItemPrefix className='counter' onMouseEnter={() => setPos(index)}>
                  {index + 1}
                </ItemPrefix>
                <ItemTitle href={artist.artistID.spotifyURL} onMouseEnter={() => setPos(index)}>
                  {artist.artistID.name.length <= 25 ? artist.artistID.name : artist.artistID.name.slice(0, 22) + '...'}
                </ItemTitle>
                <ItemSubtitle className='text' onMouseEnter={() => setPos(index)}>
                  {list === 'commonArtists'
                    ? `${artist.trackCount} tracks`
                    : `${artist.newestYear - artist.oldestYear} years`}
                </ItemSubtitle>
              </Item>
            ))}
          </List>
        </Col>
      </Row>
    </Container>
  )
}

export { LibStats, LibArtists }
