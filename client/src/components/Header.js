// PACKAGE IMPORTS
import React from 'react'

// COMPONENTS
import { Container, Row, Col } from 'react-bootstrap'
import { Title } from './LargeComponents'
import IcebergLogo from './IcebergLogo'

function Header() {
  return (
    <Container fluid style={{ userSelect: 'none' }}>
      <Row>
        <Col style={{ textAlign: 'center' }}>
          <Title>THE REST OF THE ICEBERG</Title>
          <IcebergLogo />
        </Col>
      </Row>
    </Container>
  )
}

export default Header
