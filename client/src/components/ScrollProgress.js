import React, { useState, useEffect } from 'react'
import styled from 'styled-components/macro'

const ProgressBar = styled.div`
  position: sticky;
  background-color: white;
  top: 0;
  height: 4px;
  width: ${(props) => (props.progress ? `${props.progress}%` : '0%')};
  z-index: 1;
`

const ScrollProgress = ({ target }) => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const scrollListener = () => {
    if (!target.current) {
      return
    }

    const element = target.current
    const totalHeight = element.clientHeight - element.offsetTop - window.innerHeight
    const windowScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0

    if (windowScrollTop === 0) {
      return setScrollProgress(0)
    }

    if (windowScrollTop > totalHeight) {
      return setScrollProgress(100)
    }

    setScrollProgress((windowScrollTop / totalHeight) * 100)
  }

  useEffect(() => {
    window.addEventListener('scroll', scrollListener)
    return () => window.removeEventListener('scroll', scrollListener)
  })

  return <ProgressBar progress={scrollProgress} />
}

export default ScrollProgress
