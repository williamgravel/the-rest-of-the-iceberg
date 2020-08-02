// PACKAGE IMPORTS
import React, { useContext, useState } from 'react'
import 'animate.css/animate.min.css'

// GLOBAL CONTEXT
import { TopContext, TimeContext } from '../global/globalContexts'

// COMPONENTS
import { Container, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
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
  TimeRangeButton,
  ButtonText,
} from './LargeComponents'

function TimeRangeSwitcher() {
  const [timeRange, timeRangeDispatch] = useContext(TimeContext)

  return (
    <ButtonWrapper color={timeRange.color} onClick={() => timeRangeDispatch({ type: 'cycle' })}>
      <TimeRangeButton />
      <OverlayTrigger
        placement='top'
        delay={{ 'show': 1000, 'hide': 100 }}
        overlay={<Tooltip id='time-range-tooltip'>past {timeRange.past}</Tooltip>}
      >
        <ButtonText>{timeRange.text}</ButtonText>
      </OverlayTrigger>
    </ButtonWrapper>
  )
}

function ListRow(props) {
  const topData = useContext(TopContext)
  const [timeRange] = useContext(TimeContext)
  const [pos, setPos] = useState(0)

  return (
    <Row>
      <Col className='d-flex justify-content-end '>
        <ImageWrapper>
          <Square color={timeRange.color}></Square>
          <Image
            src={
              topData[props.itemType][timeRange.value].list[pos].profilePic ||
              topData[props.itemType][timeRange.value].list[pos].albumArt
            }
            alt={topData[props.itemType][timeRange.value].list[pos].name}
          />
        </ImageWrapper>
      </Col>
      <Col className='d-flex justify-content-start'>
        <List>
          {topData[props.itemType][timeRange.value].list.slice(0, 5).map((item, index) => (
            <Item key={item.spotifyID} color={timeRange.color} className={pos === index ? 'active' : ''}>
              <ItemPrefix className='counter' onMouseEnter={() => setPos(index)}>
                {index + 1}
              </ItemPrefix>
              <ItemTitle href={item.spotifyURL} onMouseEnter={() => setPos(index)}>
                {item.name.length <= 25 ? item.name : item.name.slice(0, 22) + '...'}
              </ItemTitle>
              {props.itemType === 'tracks' && (
                <ItemSubtitle className='text' onMouseEnter={() => setPos(index)}>
                  {item.artistName.length <= 20 ? item.artistName : item.artistName.slice(0, 17) + '...'}
                </ItemSubtitle>
              )}
            </Item>
          ))}
        </List>
      </Col>
    </Row>
  )
}

function TopArtists() {
  return (
    <Container fluid style={{ userSelect: 'none' }}>
      <Row style={{ marginBottom: '60px' }}>
        <Col></Col>
        <Col lg={7}>
          <Heading>Top Artists</Heading>
          <TimeRangeSwitcher />
        </Col>
        <Col></Col>
      </Row>
      <ListRow itemType='artists' />
    </Container>
  )
}

function CommonGenres() {
  return (
    <Container fluid style={{ userSelect: 'none' }}>
      <Row style={{ marginBottom: '60px' }}>
        <Col></Col>
        <Col lg={7}>
          <Heading>Top Genres</Heading>
          <TimeRangeSwitcher />
        </Col>
        <Col></Col>
      </Row>
    </Container>
  )
}

function TopTracks() {
  return (
    <Container fluid style={{ userSelect: 'none' }}>
      <Row style={{ marginBottom: '60px' }}>
        <Col></Col>
        <Col lg={7}>
          <Heading>Top Tracks</Heading>
          <TimeRangeSwitcher />
        </Col>
        <Col></Col>
      </Row>
      <ListRow itemType='tracks' />
    </Container>
  )
}

function AudioFeatures() {
  return (
    <Container fluid style={{ userSelect: 'none' }}>
      <Row style={{ marginBottom: '60px' }}>
        <Col></Col>
        <Col lg={7}>
          <Heading>Audio Features</Heading>
          <TimeRangeSwitcher />
        </Col>
        <Col></Col>
      </Row>
    </Container>
  )
}

export { TopArtists, CommonGenres, TopTracks, AudioFeatures }
