'use client'

import * as io from 'socket.io-client'
import { useEffect, useCallback, useRef } from 'react'
import { Application, extend } from '@pixi/react'
import { Container, Graphics, Sprite } from 'pixi.js'
import { SceneSprite } from './SceneSprite.js'
import { Viewport } from '@/components/viewport/Viewport.js'

extend({
  Container,
  Graphics,
  Sprite,
})

const GamePage = () => {
  const imageUrl = '/api/media/file/london-night-town.jpg'
  const viewportRef = useRef(null)
  const backgroundRef = useRef(null)

  useEffect(() => {
    const socket = io.connect('http://localhost:3000')

    socket.on('connect', () => {
      console.log('Connected to WebSocket server')
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server')
    })

    socket.on('message', (data) => {
      console.log('Received message:', data)
    })

    socket.emit('identity', 42, (response) => {
      console.log('Identity response from server:', response)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <Application className="w-full h-full bg-black">
      <Viewport
        ref={viewportRef}
        screenWidth={1024}
        screenHeight={1024}
        worldWidth={backgroundRef.current?.width || 2000}
        worldHeight={backgroundRef.current?.height || 2000}
        drag
        wheel
        pinch
      >
        <SceneSprite imageUrl={imageUrl} ref={backgroundRef} />
      </Viewport>
    </Application>
  )
}

export default GamePage
