// PACKAGE IMPORTS
import React, { useState } from 'react'
import axios from 'axios'

// COMPONENTS
import { Container, Row, Col } from 'react-bootstrap'
import { Heading } from './Section'
import { Button } from './ActionButtons'

const GeneratePlaylist = async (e, playlistApi, setLoading) => {
  e.preventDefault()
  try {
    setLoading(true)
    const res = await axios.get(`/api/playlist/${playlistApi}`)
    setLoading(false)
    window.open(res.data, '_blank')
  } catch (error) {
    console.error('Unable to generate playlist')
  }
}

function GeneratePlaylistButton(props) {
  const [isFetching, setIsFetching] = useState(false)
  return (
    <Button
      type='button'
      name={props.name}
      onClick={(e) => GeneratePlaylist(e, props.api, setIsFetching)}
      disabled={isFetching}
    >
      {isFetching ? 'Loading...' : props.text}
    </Button>
  )
}

function CustomPlaylists() {
  return (
    <Container fluid style={{ userSelect: 'none' }}>
      <Row style={{ marginBottom: '60px' }}>
        <Col></Col>
        <Col lg={7}>
          <Heading>Custom Playlists</Heading>
        </Col>
        <Col></Col>
      </Row>

      <Row>
        <Col style={{ textAlign: 'center' }}>
          <GeneratePlaylistButton name='secondChancePlaylist' text='Generate playlist' api='second' />
        </Col>
      </Row>
    </Container>
  )
}

export default CustomPlaylists
