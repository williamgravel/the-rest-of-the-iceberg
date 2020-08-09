import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`

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

const Title = styled.h1`
  /* box */
  display: inline-block;
  margin: 0;

  /* font */
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

  /* font */
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
  margin: 40px 10px;
  padding: 10px 10px;
  width: 30%;
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
  animation-fill-mode: both;
  &:nth-child(1) {
    animation-delay: 0s;
  }
  &:nth-child(2) {
    animation-delay: 1.5s;
  }
  &:nth-child(3) {
    animation-delay: 3s;
  }
  &:nth-child(4) {
    animation-delay: 4.5s;
  }
  &:nth-child(5) {
    animation-delay: 6s;
  }
  &:nth-child(6) {
    animation-delay: 7.5s;
  }
`

Box.Text = styled.span`
  /* box */

  /* font */
  font-size: 2.25rem;
  line-height: 120%;
`

Box.Stat = styled.span`
  /* box */

  /* font */
  color: ${(props) => props.theme[props.color].primary.color};
  text-shadow: 3px 3px 1px ${(props) => props.theme[props.color].primary.darker};
  font-size: 4.5rem;
  font-weight: bold;
  line-height: 120%;
`

export { Title, Heading, Box }
