// PACKAGE IMPORTS
import React, { useContext } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import IcebergOutline from '../assets/icebergOutline.png'
import IcebergFilled from '../assets/icebergFilled.png'

// GLOBAL CONTEXT
import { AuthContext } from '../global/globalContexts'

const loginClick = async (e) => {
  e.preventDefault()
  try {
    const res = await axios.get('/auth/spotify/login')
    window.location = res.data.redirect
  } catch (error) {
    console.error('Unable to authenticate user')
  }
}

const IcebergWrapper = styled.div`
  /* box */
  height: 65vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const IcebergImage = styled.img`
  height: 60vh;
  transition: height 0.3s ease-in-out;

  animation: floating 6s ease-in-out infinite;

  @keyframes floating {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(25px);
    }
    100% {
      transform: translateY(-0px);
    }
  }

  &.logged-in {
    height: 63vh;
  }

  &.logged-out:hover {
    height: 63vh;
  }
`

const LoggedIn = () => {
  return <IcebergImage src={IcebergFilled} alt='Solid iceberg logo' className='logged-in' />
}

const LoggedOut = () => {
  return (
    <IcebergImage
      src={IcebergOutline}
      alt='Empty iceberg logo'
      className='logged-out'
      onClick={loginClick}
      style={{ cursor: 'pointer' }}
    />
  )
}

const StyledIcebergLogo = () => {
  const authStatus = useContext(AuthContext)

  return <IcebergWrapper>{authStatus ? <LoggedIn /> : <LoggedOut />}</IcebergWrapper>
}

export default StyledIcebergLogo
