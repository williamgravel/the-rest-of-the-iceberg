// PACKAGE IMPORTS
import React, { useState } from 'react'
import axios from 'axios'

// COMPONENTS
import { Container, Row, Col, Form } from 'react-bootstrap'
import { RowHeading, Heading } from './Section'
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
    <Container fluid>
      <RowHeading>
        <Col lg={7}>
          <Heading>Custom Playlists</Heading>
        </Col>
      </RowHeading>

      <Row>
        <Col style={{ textAlign: 'center' }}>
          <GeneratePlaylistButton name='secondChancePlaylist' text='Generate playlist' api='second' />
          <Form>
            <Form.Group controlId='formBasicRangeCustom'>
              <Form.Label>Range</Form.Label>
              <Form.Control type='range' custom />
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default CustomPlaylists
