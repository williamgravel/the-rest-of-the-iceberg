// PACKAGE IMPORTS
import React, { useContext, useState } from 'react'
import LazyLoad from 'react-lazyload'
import { useCountUp } from 'react-countup'

// GLOBAL CONTEXT
import { TopContext, TimeContext } from '../global/globalContexts'

// UTIL FUNCTIONS
import trimText from '../utils/trimText'

// COMPONENTS
import { Container, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { RowHeading, ColBox, Heading, Box } from './Section'
import { List, ListItem } from './List'
import { ButtonWrapper, ButtonText, TimeRangeButton } from './ActionButtons'
import { LargeThumbnail } from './Thumbnail'

const TimeRangeSwitcher = () => {
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

const ListRow = (props) => {
  const topData = useContext(TopContext)
  const [timeRange] = useContext(TimeContext)
  const [pos, setPos] = useState(0)

  return (
    <Row>
      <Col className='d-flex justify-content-end'>
        <LargeThumbnail
          src={
            topData[props.itemType][timeRange.value].list[pos].profilePic ||
            topData[props.itemType][timeRange.value].list[pos].albumArt
          }
          alt={topData[props.itemType][timeRange.value].list[pos].name}
          color={timeRange.color}
        />
      </Col>
      <Col className='d-flex justify-content-start'>
        <List>
          {topData[props.itemType][timeRange.value].list.slice(0, 5).map((item, index) => (
            <ListItem key={item.spotifyID} color={timeRange.color} className={pos === index ? 'active' : ''}>
              <ListItem.Prefix onMouseEnter={() => setPos(index)}>{index + 1}</ListItem.Prefix>
              <ListItem.Title href={item.spotifyURL} onMouseEnter={() => setPos(index)}>
                {trimText(item.name, 25)}
              </ListItem.Title>
              {props.itemType === 'tracks' && (
                <ListItem.Subtitle onMouseEnter={() => setPos(index)}>
                  {trimText(item.artistName, 20)}
                </ListItem.Subtitle>
              )}
            </ListItem>
          ))}
        </List>
      </Col>
    </Row>
  )
}

const DanceabilityMetric = ({ delay, float }) => {
  const topData = useContext(TopContext)
  return (
    <Box>
      <Box.Text float={float}></Box.Text>
    </Box>
  )
}

const TopArtists = () => {
  return (
    <Container fluid>
      <RowHeading>
        <Col lg={7}>
          <Heading>Top Artists</Heading>
          <TimeRangeSwitcher />
        </Col>
      </RowHeading>
      <ListRow itemType='artists' />
    </Container>
  )
}

const CommonGenres = () => {
  return (
    <Container fluid>
      <RowHeading>
        <Col lg={7}>
          <Heading>Top Genres</Heading>
          <TimeRangeSwitcher />
        </Col>
      </RowHeading>
    </Container>
  )
}

const TopTracks = () => {
  return (
    <Container fluid>
      <RowHeading>
        <Col lg={7}>
          <Heading>Top Tracks</Heading>
          <TimeRangeSwitcher />
        </Col>
      </RowHeading>
      <ListRow itemType='tracks' />
    </Container>
  )
}

const AudioFeatures = () => {
  return (
    <Container fluid>
      <RowHeading>
        <Col lg={7}>
          <Heading>Audio Features</Heading>
          <TimeRangeSwitcher />
        </Col>
      </RowHeading>
    </Container>
  )
}

export { TopArtists, CommonGenres, TopTracks, AudioFeatures }
