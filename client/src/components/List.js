import styled from 'styled-components/macro'

const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  margin-left: 100px;
`

const Prefix = styled.span`
  /* box */
  margin-right: 30px;

  /* font */
  color: ${(props) => props.theme.neutral.color};
  font-size: 3rem;
  text-shadow: 2px 2px 1px ${(props) => props.theme.neutral.accent};
`
const Title = styled.a`
  /* font */
  color: ${(props) => props.theme.light.color};
  font-size: 2.5rem;
  text-shadow: 2px 2px 1px ${(props) => props.theme.light.accent};
  text-decoration: none;

  /* pseudo-classes */
  &:active {
    color: #70281a !important;
  }
`

const Subtitle = styled.span`
  /* box */
  margin-left: 20px;

  /* font */
  color: ${(props) => props.theme.light.color};
  font-size: 1.2rem;
  font-weight: normal;
  text-shadow: 1px 1px 1px ${(props) => props.theme.light.accent};
`

const ListItem = styled.li`
  /* box */
  display: block;
  max-width: 800px;
  height: 100px;
  margin-bottom: 20px;

  /* font */
  /* font-style: italic; */
  font-weight: bold;

  /* pseudo-classes */
  &.active ${Title} {
    color: ${(props) => props.theme[props.color].primary.color};
    text-shadow: 2px 2px 1px ${(props) => props.theme[props.color].primary.darker};
    text-decoration: none;
  }
  &.active ${Prefix} {
    color: ${(props) => props.theme.dark.color} !important;
    text-shadow: 2px 2px 1px ${(props) => props.theme.dark.accent};
  }
  &.active ${Subtitle} {
    color: ${(props) => props.theme[props.color].secondary.color} !important;
    text-shadow: 1px 1px 1px ${(props) => props.theme[props.color].secondary.darker};
  }
`

ListItem.Prefix = Prefix
ListItem.Title = Title
ListItem.Subtitle = Subtitle

export { List, ListItem }
