const socket = io()

// const moment = require('moment')

const clientsTotal = document.getElementById('clients-total')
const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

const messageTone = new Audio('/message-tone.mp3')

// HELPER FUNCTIONS

function addMessageToUI (isOwnMessage, data) {
    clearFeedback()

    const element = `
    <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
        <p class="message">
            ${data.message}
            <span>${data.name} ・ ${moment(data.dateTime).fromNow()}</span>
        </p>
    </li>`

    messageContainer.innerHTML += element

    scrollToBottom()
}

function sendMessage(){
    // console.log(messageInput.value)

    // Don't send empty message
    if(messageInput.value === '') return

    // Data
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date()
    }

    socket.emit('message', data)
    addMessageToUI(true, data)
    messageInput.value = ''
}

function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

function clearFeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element)
    })
}

// END HELPER FUNCTIONS


messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage()
})

messageInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing...`
    })
})

messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
        feedback: ''
    })
})

socket.on('clients-total', (data) => {
    // console.log(data);
    clientsTotal.innerText = `Total clients ${data}`
})

socket.on('chat-message', (data) => {
    console.log(data)
    messageTone.play()
    addMessageToUI(false, data)
})

socket.on('feedback', (data) => {
    clearFeedback()

    const element = `
    <li class="message-feedback">
        <p class="feedback" id="feedback">${data.feedback}</p>
    </li>
    `
    messageContainer.innerHTML += element
})

