import styled from 'styled-components'
import { HourGlass } from '@styled-icons/entypo'
import { SwitchHorizontal } from '@styled-icons/heroicons-outline'
// import {
//   Heart,
//   Hot,
//   MusicAlbum,
//   MusicArtist,
//   MusicNotes,
//   MusicPlaylist,
//   Timer,
//   ViewTile,
// } from '@styled-icons/zondicons'

export const Title = styled.h1`
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
  animation: floating 8s ease-in-out infinite;

  @keyframes floating {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(20px);
    }
    100% {
      transform: translateY(-0px);
    }
  }
`

export const Heading = styled.h1`
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

export const ImageWrapper = styled.div`
  @include clearfix;
  width: 600px;
  margin-right: 100px;
`

export const Image = styled.img`
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

export const Square = styled.div`
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

export const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  margin-left: 100px;
`

export const Item = styled.li`
  /* box */
  display: block;
  max-width: 800px;
  height: 100px;
  margin-bottom: 20px;

  /* font */
  /* font-style: italic; */
  font-weight: bold;

  /* pseudo-classes */
  &.active a {
    color: ${(props) => props.theme[props.color].primary.color};
    text-shadow: 2px 2px 1px ${(props) => props.theme[props.color].primary.darker};
    text-decoration: none;
  }
  &.active span.counter {
    color: ${(props) => props.theme.dark.color} !important;
    text-shadow: 2px 2px 1px ${(props) => props.theme.dark.accent};
  }
  &.active span.text {
    color: ${(props) => props.theme[props.color].secondary.color} !important;
    text-shadow: 1px 1px 1px ${(props) => props.theme[props.color].secondary.darker};
  }
`

export const ItemPrefix = styled.span`
  /* box */
  margin-right: 30px;

  /* font */
  color: ${(props) => props.theme.neutral.color};
  font-size: 3rem;
  text-shadow: 2px 2px 1px ${(props) => props.theme.neutral.accent};
`

export const ItemTitle = styled.a`
  /* font */
  color: ${(props) => props.theme.light.color};
  font-size: 2.5rem;
  text-shadow: 2px 2px 1px ${(props) => props.theme.light.accent};

  /* pseudo-classes */
  &:active {
    color: #70281a !important;
    text-decoration: none;
  }
`

export const ItemSubtitle = styled.span`
  /* box */
  margin-left: 20px;

  /* font */
  color: ${(props) => props.theme.light.color};
  font-size: 1.2rem;
  font-weight: normal;
  text-shadow: 1px 1px 1px ${(props) => props.theme.light.accent};
`

export const ArtistSwitchButton = styled(SwitchHorizontal)`
  /* box */
  display: inline-block;
  width: 40px;
  height: 40px;
`

export const TimeRangeButton = styled(HourGlass)`
  /* box */
  display: inline-block;
  width: 40px;
  height: 40px;
`

export const ButtonText = styled.span`
  /* box */
  display: inline-block;
  margin-left: 5px;

  /* font */
  font-size: 1.3rem;
  font-style: italic;
`

export const ButtonWrapper = styled.div`
  /* box */
  display: inline-block;
  width: auto;
  max-width: 40px;
  height: 50px;
  margin: 0 0 0 20px;
  position: absolute;
  bottom: 0;

  /* font */
  color: ${(props) => props.theme[props.color]?.primary?.color || props.theme[props.color].color};
  text-shadow: 1px 1px 1px ${(props) => props.theme[props.color]?.primary?.darker || props.theme[props.color].accent};
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  transition: max-width 0.2s ease-out;
  cursor: pointer;

  &:hover {
    max-width: 220px;
  }
`
