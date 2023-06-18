import styled from 'styled-components'
import { HourGlass } from '@styled-icons/entypo'
import { ArrowsRightLeft } from '@styled-icons/heroicons-outline'
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

const ButtonWrapper = styled.div`
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

const ButtonText = styled.span`
  /* box */
  display: inline-block;
  margin-left: 5px;

  /* font */
  font-size: 1.3rem;
  font-style: italic;
`

const TimeRangeButton = styled(HourGlass)`
  /* box */
  display: inline-block;
  width: 40px;
  height: 40px;
`

const ArtistListButton = styled(ArrowsRightLeft)`
  /* box */
  display: inline-block;
  width: 40px;
  height: 40px;
`

const Button = styled.button`
  /* box */
  padding: 8px 32px;

  /* font */
  color: white;
  font-weight: 500;

  /* design */
  background-color: ${(props) => props.theme.blue.primary.color};
  border: none;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;

  /* pseudo-classes */
  &:hover {
    background-color: ${(props) => props.theme.blue.secondary.color};
    border-radius: 40px;
  }
  &:active,
  :focus {
    background-color: ${(props) => props.theme.blue.tertiary.color};
  }

  &:disabled {
    color: #ddd;
    background-color: ${(props) => props.theme.blue.tertiary.darker};
  }
`

export { ButtonWrapper, ButtonText, TimeRangeButton, ArtistListButton, Button }
