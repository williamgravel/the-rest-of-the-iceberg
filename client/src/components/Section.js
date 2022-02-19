import styled, { keyframes } from 'styled-components'
import { Row, Col } from 'react-bootstrap'

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

// const fadeOut = keyframes`
//   from {
//     opacity: 1;
//   }
//   to {
//     opacity: 0;
//   }
// `

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(20px);
  }
  100% {
    transform: translateY(-0px);
  }
`

const RowHeading = styled(Row)`
  /* box */
  margin-bottom: 60px;
  align-items: flex-end;
  justify-content: center;
`

const ColBox = styled(Col)`
  /* box */
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  /* animation */
  pointer-events: none;
  div {
    pointer-events: auto;
    transition: opacity 150ms linear;
  }
  &:hover > div {
    opacity: 0.5;
  }
  div:hover {
    opacity: 1;
  }
`

const Title = styled.h1`
  /* box */
  display: inline-block;
  margin: 0;

  /* text */
  color: ${(props) => props.theme.light.color};
  font-size: 6.5rem;
  line-height: 100%;
  font-weight: bold;
  text-shadow: 3px 3px 1px ${(props) => props.theme.light.accent};

  /* animation */
  animation: ${float} 8s ease-in-out infinite;
`

const Heading = styled.h1`
  /* box */
  display: inline-block;
  margin: 0;

  /* text */
  font-family: 'Rocket Clouds', sans-serif !important;
  color: ${(props) => props.theme.light.color};
  font-size: 5.5em;
  line-height: 100%;
  /* font-style: italic; */
  font-weight: bold;
  text-shadow: 3px 3px 1px ${(props) => props.theme.light.accent};
`

const Box = styled.div`
  /* box */
  margin: 40px 40px;
  padding: 10px 10px;
  width: 25%;
  height: 250px;

  /* layout */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;

  /* design */
  color: white;
  text-align: center;

  /* animation */
  animation: ${fadeIn} 1s linear;
  animation-fill-mode: backwards;
  &:nth-of-type(1) {
    animation-delay: 0s;
  }
  &:nth-of-type(2) {
    animation-delay: 1.5s;
  }
  &:nth-of-type(3) {
    animation-delay: 3s;
  }
  &:nth-of-type(4) {
    animation-delay: 4.5s;
  }
  &:nth-of-type(5) {
    animation-delay: 6s;
  }
  &:nth-of-type(6) {
    animation-delay: 7.5s;
  }
`

Box.Text = styled.span`
  /* text */
  font-size: 2.25rem;
  line-height: 120%;

  /* animation */
  animation: float 6s ease-in-out infinite;
  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(${(props) => props.float + 'px'});
    }
    100% {
      transform: translateY(-0px);
    }
  }
`

Box.Stat = styled.span`
  /* text */
  color: ${(props) => props.theme[props.color].primary.color};
  text-shadow: 3px 3px 1px ${(props) => props.theme[props.color].primary.darker};
  font-size: 4.5rem;
  font-weight: bold;
  line-height: 120%;

  /* animation */
  animation: float 6s ease-in-out infinite;
  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(${(props) => props.float + 'px'});
    }
    100% {
      transform: translateY(-0px);
    }
  }
`

const Quote = styled.span`
  /* box */
  display: block;
  width: 100%;

  /* font */
  color: ${(props) => props.theme[props.color].primary.color};
  text-align: center;
`

export { RowHeading, ColBox, Title, Heading, Box, Quote }
