import React from 'react'
import styled from 'styled-components'

const ImageWrapper = styled.div`
  @include clearfix;
  width: 600px;
  margin-right: 100px;
`

const Image = styled.img`
  width: 600px;
  height: 600px;
  object-fit: cover;
  border: none;
  position: relative;
  top: 0;
  left: 100%;
  margin-left: -100%;
  float: left;
`

const Square = styled.div`
  width: 600px;
  height: 600px;
  background-color: ${(props) => props.theme[props.color].primary.color};
  transform: rotate(2deg);
  position: relative;
  top: 15px;
  left: 102.5%;
  margin-left: -100%;
  float: left;
`

const LargeThumbnail = ({ src, alt, color }) => {
  return (
    <ImageWrapper>
      <Square color={color}></Square>
      <Image src={src} alt={alt} />
    </ImageWrapper>
  )
}

export { LargeThumbnail }
