'use client'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
const socket = io()
export default function Chat() {
  const [message, setMessage] = useState('')
  const [chatLog, setChatLog] = useState<
    {
      message: string
      timeStamp: number
    }[]
  >([])
  useEffect(() => {
    socket.on('chat-message', (messages) => {
      setChatLog((prev) => [...prev, messages])
    })
    return () => {
      socket.off('chat-message')
    }
  }, [])
  const handleSend = () => {
    if (message.trim().length > 0) {
      const timeStamp = Date.now()
      socket.emit('chat-message', { message, timeStamp }) // you can add username or token also with this object after adding authentication flow
      setMessage('')
    } else {
      alert('Please enter message')
    }
  }
  return (
    <div className="p-4 w-[100%] m-auto">
      <h2>Real-Time Chat</h2>
      <div className="flex row gap-2 mt-3">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <button onClick={handleSend} className="p-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </div>
      <ul className="mt-5 list-none">
        {chatLog.map((chat, i) => (
          <li
            key={i}
            className="p-2 border border-gray-300 rounded mt-4 break-words"
          >
            {chat.message}
            <span className="block text-xs text-gray-400">
              - {new Date(chat.timeStamp).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
