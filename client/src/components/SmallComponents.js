import React from 'react'
import styled from 'styled-components/macro'

const theme = {
  lightPrimary: '#00A7E1',
  darkPrimary: '#00171F',
  lightAccent: '#007EA7',
  darkAccent: '#003459',
}

const Button = styled.button`
  color: white;
  font-family: Montserrat;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  background-color: ${(props) => props.theme.lightAccent};
  border: none;
  border-radius: 50px;
  padding: 16px 48px;
  display: inline-block;
  transition: all 0.3s ease 0s;

  &:hover {
    color: white;
    background-color: ${(props) => props.theme.lightPrimary};
    transition: all 0.3s ease 0s;
  }
`
Button.defaultProps = { theme }

const Thumbnail = styled.img`
  height: 100px;
  width: 100px;
  object-fit: cover;
  border: none;
  z-index: 0;
`
Thumbnail.defaultProps = { theme }

const Ul = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`

const Li = styled.li`
  display: flex;
  width: 100%;
  height: 100px;
  margin: 10px 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`

const Table = styled.table`
  width: 100%;
  height: 100%;
  table-layout: fixed;
`

const TableCell = styled.td`
  &.image {
    padding: 0;
    width: 100px;
  }
  &.text {
    padding: 0 20px;
    vertical-align: top;
  }
  &.number {
    padding: 0 20px;
    width: 10%;
    font-size: 1.2em;
    text-align: right;
    vertical-align: middle;
  }
`

const Link = styled.a`
  color: white;
  font-size: 1.6em;
  line-height: 110%;
  padding-top: 32px;
  text-decoration: none;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    text-decoration: none;
    color: ${(props) => props.theme.darkAccent};
  }
  &:active {
    text-decoration: none;
    color: ${(props) => props.theme.darkPrimary};
  }
`
Link.defaultProps = { theme }

const Desc = styled.span`
  color: ${(props) => props.theme.darkAccent};
  line-height: 110%;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
Desc.defaultProps = { theme }

const List = (props) => {
  return (
    <div>
      <Ul>{props.children}</Ul>
    </div>
  )
}

const ListItem = (props) => {
  if (props.artist) {
    return (
      <Li>
        <Table>
          <tbody>
            <tr>
              <TableCell className='image'>
                <Thumbnail src={props.artist.profilePic} alt={props.artist.name} />
              </TableCell>
              <TableCell className='text'>
                <Link href={props.artist.spotifyURL}>{props.artist.name}</Link>
              </TableCell>
              <TableCell className='number'>
                <span>{props.position}</span>
              </TableCell>
            </tr>
          </tbody>
        </Table>
      </Li>
    )
  } else if (props.track) {
    return (
      <Li>
        <Table>
          <tbody>
            <tr>
              <TableCell className='image'>
                <Thumbnail src={props.track.albumArt} alt={props.track.name} />
              </TableCell>
              <TableCell className='text'>
                <Link href={props.track.spotifyURL}>{props.track.name}</Link>
                <Desc>{props.track.artistName}</Desc>
              </TableCell>
              <TableCell className='number'>
                <span>{props.position}</span>
              </TableCell>
            </tr>
          </tbody>
        </Table>
      </Li>
    )
  }
}

export { Button, List, ListItem }
